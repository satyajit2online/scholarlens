export interface ChartDataPoint {
  label: string;
  value: number;
  unit?: string;
}

export interface AnalysisResult {
  title: string;
  authors: string;
  publicationDate: string;
  summary: string;
  methodology: string[];
  results: string[];
  conclusion: string;
  literatureReviewPoints: string[];
  chartTitle: string;
  chartType: 'bar' | 'pie' | 'line';
  chartData: ChartDataPoint[];
  citation: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}