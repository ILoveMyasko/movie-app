import React from 'react';
import { Film, Star, Search } from 'lucide-react';

interface NavbarProps {
  currentView: 'top' | 'genre';
  onViewChange: (view: 'top' | 'genre') => void;
  onLogoClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange, onLogoClick }) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onLogoClick}>
          <div className="rounded-lg bg-indigo-600 p-2 group-hover:bg-indigo-500 transition-colors">
            <Film className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">CineBase</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-4">
          <button
            onClick={() => onViewChange('top')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              currentView === 'top'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Top Rated</span>
          </button>
          
          <button
            onClick={() => onViewChange('genre')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              currentView === 'genre'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Browse Genre</span>
          </button>
        </div>
      </div>
    </nav>
  );
};