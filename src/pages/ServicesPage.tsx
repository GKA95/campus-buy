import React, { useState, useMemo } from 'react';
import { CampusService, UniversityId } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import { ServiceCard } from '../components/common/ServiceCard';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Wrench, 
  Printer, 
  Sparkles, 
  Camera, 
  BookOpen, 
  Bike, 
  Palette, 
  Home, 
  Utensils, 
  CheckCircle2
} from 'lucide-react';

interface ServicesPageProps {
  services: CampusService[];
  initialUniversityId?: UniversityId | 'all';
}

const SERVICE_CATEGORIES = [
  'All',
  'Printing',
  'Laundry',
  'Food Delivery',
  'Graphic Design',
  'Repairs',
  'Photography',
  'Tutoring',
  'Transportation',
  'Accommodation'
];

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  initialUniversityId = 'all'
}) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityId | 'all'>(initialUniversityId);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Service booking modal state
  const [bookingService, setBookingService] = useState<CampusService | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    hall: user?.hallOrHostel || '',
    room: user?.roomNumber || '',
    date: 'Today / ASAP',
    notes: ''
  });

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      if (selectedCategory !== 'All' && s.category !== selectedCategory) {
        return false;
      }
      if (selectedUniversity !== 'all' && s.universityId !== selectedUniversity) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.providerName.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [services, selectedCategory, selectedUniversity, searchQuery]);

  const handleOpenBooking = (service: CampusService) => {
    setBookingService(service);
    setBookingSuccess(false);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingService(null);
      setBookingSuccess(false);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 transition-colors">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white font-brand">
          Campus Student Services
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Reliable academic printing, door-to-door laundry, device repairs, tutoring, and dorm amenities.
        </p>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search printing, laptop screen fix, laundry pickup, tutoring..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="sm:w-64">
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value as UniversityId | 'all')}
              className="w-full text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-zinc-800 dark:text-zinc-200 focus:outline-none"
            >
              <option value="all">All Campuses</option>
              {UNIVERSITIES.map(u => (
                <option key={u.id} value={u.id}>{u.shortName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 pb-1 scrollbar-none">
          {SERVICE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white font-semibold'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(srv => (
            <ServiceCard
              key={srv.id}
              service={srv}
              onRequestBooking={handleOpenBooking}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center space-y-3 transition-colors">
          <Wrench className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-950 dark:text-white">No services found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            No service providers match the current filters.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedUniversity('all'); }}
            className="px-4 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Booking Modal */}
      <Modal
        isOpen={!!bookingService}
        onClose={() => setBookingService(null)}
        title={bookingService ? `Request Service: ${bookingService.title}` : 'Request Service'}
      >
        {bookingSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-zinc-950 dark:text-white">Request Sent Successfully!</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xs mx-auto">
              {bookingService?.providerName} has been notified and will contact you via WhatsApp/call shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="p-3 bg-orange-50 dark:bg-orange-950/40 rounded-xl border border-orange-200 dark:border-orange-800/60 flex items-center justify-between">
              <div>
                <span className="text-zinc-500 dark:text-zinc-400 text-[11px] block">Provider</span>
                <span className="font-bold text-zinc-950 dark:text-white">{bookingService?.providerName}</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 dark:text-zinc-400 text-[11px] block">Starting At</span>
                <span className="font-bold text-orange-600 dark:text-orange-400 font-mono">
                  GH₵ {bookingService?.startingPrice}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={bookingForm.name}
                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                placeholder="e.g. Kwame Mensah"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  placeholder="+233 55 123 4567"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Hall / Hostel</label>
                <input
                  type="text"
                  required
                  value={bookingForm.hall}
                  onChange={(e) => setBookingForm({ ...bookingForm, hall: e.target.value })}
                  placeholder="e.g. Conti, Block B"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Service Details / Project Notes</label>
              <textarea
                rows={3}
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                placeholder="Describe your request (e.g. 50 pages spiral binding, laptop model, wash & iron preferences)..."
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBookingService(null)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Submit Booking Request
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
