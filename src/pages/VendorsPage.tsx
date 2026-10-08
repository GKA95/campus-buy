import React, { useState, useMemo } from 'react';
import { Vendor, UniversityId } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import { VendorCard } from '../components/common/VendorCard';
import { Search, Store } from 'lucide-react';

interface VendorsPageProps {
  vendors: Vendor[];
  onSelectVendor: (vendorId: string) => void;
  initialUniversityId?: UniversityId | 'all';
}

export const VendorsPage: React.FC<VendorsPageProps> = ({
  vendors,
  onSelectVendor,
  initialUniversityId = 'all'
}) => {
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityId | 'all'>(initialUniversityId);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      if (selectedUniversity !== 'all' && v.universityId !== selectedUniversity) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          v.name.toLowerCase().includes(q) ||
          v.bio.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.universityName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [vendors, selectedUniversity, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white font-brand">
          Verified Campus Vendors
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Support student entrepreneurs, faculty shops, and trusted local vendors across campuses.
        </p>

        {/* Search & Campus Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendor name, store niche, or campus..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="sm:w-64">
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value as UniversityId | 'all')}
              className="w-full text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white px-3.5 py-2.5 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Ghanaian Universities</option>
              {UNIVERSITIES.map(u => (
                <option key={u.id} value={u.id}>{u.shortName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map(vendor => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onSelect={onSelectVendor}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center space-y-3">
          <Store className="w-10 h-10 text-orange-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No vendors found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            No campus vendors matched your current search. Try selecting another university.
          </p>
          <button
            onClick={() => { setSelectedUniversity('all'); setSearchQuery(''); }}
            className="px-4 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-black rounded-lg transition-colors"
          >
            Show All Vendors
          </button>
        </div>
      )}

    </div>
  );
};
