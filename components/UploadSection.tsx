import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Loader2, AlertCircle } from 'lucide-react';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
  error: string | null;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelect, isAnalyzing, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const validateAndProcess = (file: File) => {
    if (file.type === "application/pdf") {
      onFileSelect(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Instant Literature Review Analysis</h2>
        <p className="text-lg text-slate-600">
          Upload a research paper (PDF) to generate a comprehensive summary, methodological breakdown, and visual insights.
        </p>
      </div>

      <div 
        className={`
          relative flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out
          ${dragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-white hover:bg-slate-50"}
          ${isAnalyzing ? "opacity-50 pointer-events-none" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={handleChange}
        />

        {isAnalyzing ? (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-indigo-600 font-medium">Reading paper and extracting insights...</p>
            <p className="text-xs text-slate-400 mt-2">This usually takes 10-20 seconds</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 cursor-pointer" onClick={onButtonClick}>
            <div className="p-4 bg-indigo-100 rounded-full mb-4">
              <UploadCloud className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="mb-2 text-sm text-slate-700 font-semibold">
              Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
            </p>
            <p className="text-xs text-slate-500">PDF Research Paper (MAX 20MB)</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UploadSection;