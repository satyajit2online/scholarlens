import React from 'react';
import { GraduationCap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <GraduationCap size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">ScholarLens</span>
        </div>
        <nav className="flex gap-4">
          <span className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
            Documentation
          </span>
          <span className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
            About
          </span>
        </nav>
      </div>
    </header>
  );
};

export default Header;