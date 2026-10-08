import React from 'react';
import { University } from '../../types';
import { MapPin, Users, ArrowRight } from 'lucide-react';

interface UniversityCardProps {
  university: University;
  onSelect: (universityId: string) => void;
  active?: boolean;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ university, onSelect, active }) => {
  return (
    <div
      onClick={() => onSelect(university.id)}
      className={`relative bg-white dark:bg-zinc-900 rounded-xl border p-5 transition-all cursor-pointer flex flex-col justify-between hover:shadow-lg dark:hover:shadow-orange-950/20 ${
        active 
          ? 'border-orange-500 ring-2 ring-orange-500/30 shadow-md' 
          : 'border-zinc-200/90 dark:border-zinc-800 hover:border-orange-500/50 dark:hover:border-orange-500/60'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-zinc-950 dark:bg-black text-orange-500 font-brand font-bold flex items-center justify-center text-sm shadow-sm border border-zinc-800">
            {university.iconInitials}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
            <Users className="w-3 h-3 text-zinc-400" />
            <span>{university.studentCount}</span>
          </div>
        </div>

        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-snug">
          {university.shortName}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
          {university.name}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-medium mt-2">
          <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <span className="truncate">{university.location}</span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2.5 line-clamp-2 leading-relaxed">
          {university.description}
        </p>

        {/* Halls preview */}
        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-[10px] uppercase font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider">
            Popular Halls & Hostels:
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {university.popularHalls.slice(0, 3).map((hall, idx) => (
              <span key={idx} className="text-[11px] text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded">
                {hall}
              </span>
            ))}
            {university.popularHalls.length > 3 && (
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 px-1 py-0.5">
                +{university.popularHalls.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-orange-600 dark:text-orange-400">
        <span>Explore Campus Market</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
};
