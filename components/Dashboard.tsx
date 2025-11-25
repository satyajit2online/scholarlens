import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import VisualizationCard from './VisualizationCard';
import { BookOpen, FlaskConical, Lightbulb, CheckCircle2, ListChecks, Printer, Copy, Check } from 'lucide-react';

interface DashboardProps {
  data: AnalysisResult;
  onReset: () => void;
}

// Helper to parse **bold** text and apply highlights
const renderHighlightedText = (text: string) => {
  if (!text) return null;
  // Split by the markdown bold syntax
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      return (
        <span key={index} className="font-bold text-indigo-800 bg-indigo-50 px-1 rounded-sm border border-indigo-100/50">
          {content}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(data.citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:max-w-none">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6 print:border-none">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif leading-tight">{data.title}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-slate-600">
            <span className="font-medium text-indigo-600">{data.authors}</span>
            <span>•</span>
            <span>{data.publicationDate}</span>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Printer size={16} />
            Save as PDF
          </button>
          <button 
            onClick={onReset}
            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Analyze Another
          </button>
        </div>
      </div>

      {/* Citation Box (Collapsible-ish visual) */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suggested Citation (APA)</span>
          <p className="text-sm text-slate-700 font-mono mt-1 line-clamp-2">{data.citation}</p>
        </div>
        <button 
          onClick={handleCopyCitation}
          className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors shrink-0"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy Citation'}
        </button>
      </div>

      {/* Print Only Citation */}
      <div className="hidden print:block mb-4">
        <p className="text-xs text-slate-500">Citation: {data.citation}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block print:space-y-6">
        {/* Left Column: Text Analysis */}
        <div className="lg:col-span-2 space-y-8 print:space-y-6">
          
          {/* Summary */}
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 print:shadow-none print:border print:p-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">Executive Summary</h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-justify">
              {renderHighlightedText(data.summary)}
            </p>
          </section>

          {/* Methodology & Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
            <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 print:shadow-none print:border print:p-4 break-inside-avoid">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-slate-900">Methodology</h2>
              </div>
              <ul className="space-y-3">
                {data.methodology.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 leading-6">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 print:bg-black" />
                    <span>{renderHighlightedText(item)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 print:shadow-none print:border print:p-4 break-inside-avoid">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-slate-900">Key Results</h2>
              </div>
              <ul className="space-y-3">
                {data.results.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 leading-6">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 print:bg-black" />
                    <span>{renderHighlightedText(item)}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

           {/* Literature Review Points */}
           <section className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 print:bg-white print:border-slate-200 print:p-4 break-inside-avoid">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="w-5 h-5 text-indigo-700" />
              <h2 className="text-lg font-semibold text-indigo-900 print:text-slate-900">Why Cite This? (Literature Review Points)</h2>
            </div>
            <ul className="grid grid-cols-1 gap-3">
              {data.literatureReviewPoints.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-indigo-800 text-sm print:text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-200 text-[10px] font-bold text-indigo-700 print:bg-slate-200 print:text-slate-800">
                    {idx + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

        </div>

        {/* Right Column: Visuals & Conclusion */}
        <div className="space-y-8 print:space-y-6 print:mt-6">
          
          {/* Graphical Representation */}
          <section className="h-96 print:h-[400px] break-inside-avoid page-break-inside-avoid">
            <VisualizationCard 
              title={data.chartTitle} 
              data={data.chartData} 
              type={data.chartType}
            />
          </section>

          {/* Conclusion */}
          <section className="bg-slate-900 rounded-xl p-6 shadow-lg text-white print:bg-white print:text-slate-900 print:border print:border-slate-200 print:shadow-none break-inside-avoid">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-400 print:text-indigo-600" />
              <h2 className="text-lg font-semibold text-white print:text-slate-900">Conclusion</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed italic print:text-slate-700 print:not-italic">
              "{data.conclusion}"
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;