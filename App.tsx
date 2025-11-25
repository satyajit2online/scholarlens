import React, { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import Dashboard from './components/Dashboard';
import { AnalysisResult, AnalysisStatus } from './types';
import { analyzeResearchPaper } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);

    try {
      // Delay to allow UI to update before heavy processing/API call
      const result = await analyzeResearchPaper(file);
      setAnalysisData(result);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (err: any) {
      setStatus(AnalysisStatus.ERROR);
      setError(err.message || "An unexpected error occurred while analyzing the paper.");
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setStatus(AnalysisStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 print:pb-0 print:bg-white">
      <Header />
      
      <main>
        {status === AnalysisStatus.IDLE || status === AnalysisStatus.ANALYZING || status === AnalysisStatus.ERROR ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
             <UploadSection 
                onFileSelect={handleFileSelect} 
                isAnalyzing={status === AnalysisStatus.ANALYZING}
                error={error}
             />
             
             {/* Features Grid for Landing Page feel */}
             {status === AnalysisStatus.IDLE && (
               <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                 <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm text-center">
                   <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
                   <h3 className="font-semibold text-slate-900 mb-2">Smart Extraction</h3>
                   <p className="text-sm text-slate-500">Identify methodology, results, and conclusions automatically.</p>
                 </div>
                 <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm text-center">
                   <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
                   <h3 className="font-semibold text-slate-900 mb-2">Visual Insights</h3>
                   <p className="text-sm text-slate-500">Turn tables and data points into clear, academic-ready charts.</p>
                 </div>
                 <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm text-center">
                   <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
                   <h3 className="font-semibold text-slate-900 mb-2">Review Ready</h3>
                   <p className="text-sm text-slate-500">Get specific points formatted for your literature review gap analysis.</p>
                 </div>
               </div>
             )}
          </div>
        ) : (
          analysisData && <Dashboard data={analysisData} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;