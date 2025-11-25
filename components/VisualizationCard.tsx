import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import { ChartDataPoint } from '../types';
import { PieChart as PieIcon, BarChart as BarIcon, LineChart as LineIcon } from 'lucide-react';

interface VisualizationCardProps {
  title: string;
  data: ChartDataPoint[];
  type: 'bar' | 'line' | 'pie';
}

const COLORS = ['#4F46E5', '#818CF8', '#C7D2FE', '#312E81', '#6366F1', '#A5B4FC'];

const VisualizationCard: React.FC<VisualizationCardProps> = ({ title, data, type }) => {
  if (!data || data.length === 0) return null;

  const renderIcon = () => {
    switch (type) {
      case 'pie': return <PieIcon className="w-4 h-4 text-slate-400" />;
      case 'line': return <LineIcon className="w-4 h-4 text-slate-400" />;
      default: return <BarIcon className="w-4 h-4 text-slate-400" />;
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        );
      case 'line':
        return (
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="label" tick={{fill: '#64748B', fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill: '#64748B', fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4F46E5" 
              strokeWidth={3} 
              dot={{r: 4, fill: '#312E81'}} 
              activeDot={{ r: 6 }} 
              isAnimationActive={false}
            />
          </LineChart>
        );
      default:
        return (
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="label" tick={{fill: '#64748B', fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill: '#64748B', fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#1E293B' }}
              cursor={{fill: '#F1F5F9'}}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full flex flex-col print:border-none print:shadow-none print:p-0">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1 font-serif">AI Visual Insights</h3>
          <p className="text-sm text-slate-500">{title}</p>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 print:hidden">
          {renderIcon()}
        </div>
      </div>
      
      <div className="flex-grow min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-4 text-center italic print:text-slate-500">
        *Generated based on quantitative data extracted from the paper.
      </p>
    </div>
  );
};

export default VisualizationCard;