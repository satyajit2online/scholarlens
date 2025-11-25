import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Converts a File object to a base64 encoded string.
 */
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeResearchPaper = async (file: File): Promise<AnalysisResult> => {
  const model = "gemini-2.5-flash"; // Efficient multimodal model

  const filePart = await fileToGenerativePart(file);

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Title of the research paper" },
      authors: { type: Type.STRING, description: "Authors of the paper" },
      publicationDate: { type: Type.STRING, description: "Year or date of publication" },
      summary: { type: Type.STRING, description: "A concise summary of the paper (abstract level) covering methodology, results, and conclusion." },
      methodology: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Key steps in the research methodology"
      },
      results: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Key findings and results"
      },
      conclusion: { type: Type.STRING, description: "The final conclusion of the study" },
      literatureReviewPoints: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Critical points valuable for a literature review (gaps filled, novel contributions)"
      },
      chartTitle: { type: Type.STRING, description: "Title for a graph representing the data" },
      chartType: { 
        type: Type.STRING, 
        enum: ["bar", "pie", "line"],
        description: "The most appropriate chart type to visualize the extracted data." 
      },
      chartData: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING, description: "Label for the data point (e.g., Group A, 2020)" },
            value: { type: Type.NUMBER, description: "Numerical value for the data point" },
            unit: { type: Type.STRING, description: "Unit of measurement (optional)" }
          },
          required: ["label", "value"]
        },
        description: "Extracted quantitative data suitable for visualization (e.g., sample sizes, success rates, comparison metrics)"
      },
      citation: { type: Type.STRING, description: "A formally formatted APA style citation for this paper." }
    },
    required: ["title", "summary", "methodology", "results", "conclusion", "literatureReviewPoints", "chartData", "chartType", "citation"]
  };

  const prompt = `
    You are an expert academic researcher assisting a PhD student. 
    Analyze the attached research paper PDF. 
    Extract the key information required for a literature review.

    For the 'summary', 'methodology', and 'results' sections:
    - Identify the most critical keywords, technical terms, specific metrics, or core concepts (e.g., specific algorithm names, p-values, sample sizes).
    - Enclose these key terms in double asterisks so they can be highlighted (e.g., "The study achieved an **accuracy of 98%** using **CNNs**").
    
    Crucially, look for quantitative data in the results or methodology that can be visualized.
    - If the data represents parts of a whole (e.g., demographics), choose 'pie'.
    - If the data represents a trend over time or continuous variable, choose 'line'.
    - If the data is categorical comparison, choose 'bar'.
    
    Also generate a standard APA citation for the paper.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          filePart,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for factual extraction
      }
    });

    if (!response.text) {
      throw new Error("No response received from the model.");
    }

    const result: AnalysisResult = JSON.parse(response.text);
    return result;

  } catch (error) {
    console.error("Error analyzing paper:", error);
    throw error;
  }
};