import React, { useState } from 'react';
import { UNIVERSITIES } from '../data/mockData';
import { UniversityId } from '../types';
import { UniversityCard } from '../components/common/UniversityCard';
import { Modal } from '../components/common/Modal';
import { MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface UniversitiesPageProps {
  currentUniversityId: UniversityId | 'all';
  onSelectUniversity: (id: UniversityId) => void;
  onExploreCampus: (id: UniversityId) => void;
}

export const UniversitiesPage: React.FC<UniversitiesPageProps> = ({
  currentUniversityId,
  onSelectUniversity,
  onExploreCampus
}) => {
  const [isAmbassadorModalOpen, setIsAmbassadorModalOpen] = useState(false);
  const [ambassadorSubmitted, setAmbassadorSubmitted] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantSchool, setApplicantSchool] = useState('');

  const handleAmbassadorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAmbassadorSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 transition-colors">
        <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>Campus Coverage</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white font-brand">
          Supported Universities in Ghana
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
          CampusBuy operates hyperlocal marketplaces mapped specifically to each institution’s halls of residence, faculties, and private hostel communities.
        </p>
      </div>

      {/* University Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {UNIVERSITIES.map(u => (
          <UniversityCard
            key={u.id}
            university={u}
            active={currentUniversityId === u.id}
            onSelect={() => {
              onSelectUniversity(u.id);
              onExploreCampus(u.id);
            }}
          />
        ))}
      </div>

      {/* Expansion Banner */}
      <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div>
          <h3 className="font-bold text-zinc-950 dark:text-white text-base font-brand">
            Don't see your institution listed?
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-md">
            We are actively expanding to GIMPA, UMaT, HTU, TTU, and other tertiary campuses across Ghana. Apply to become a founding campus ambassador.
          </p>
        </div>
        <button
          onClick={() => {
            setAmbassadorSubmitted(false);
            setIsAmbassadorModalOpen(true);
          }}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl whitespace-nowrap shadow-xs transition-colors"
        >
          Become Campus Ambassador
        </button>
      </div>

      {/* Ambassador Application Modal */}
      <Modal
        isOpen={isAmbassadorModalOpen}
        onClose={() => setIsAmbassadorModalOpen(false)}
        title="Campus Ambassador Application"
      >
        {ambassadorSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-zinc-900 dark:text-white text-base">Application Received!</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Thank you {applicantName || 'applicant'}. Our campus network expansion team will contact you via email.
            </p>
            <button
              onClick={() => setIsAmbassadorModalOpen(false)}
              className="mt-3 px-4 py-2 bg-orange-600 text-white text-xs font-semibold rounded-lg"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleAmbassadorSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="e.g. Ama Serwaa"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={applicantEmail}
                onChange={(e) => setApplicantEmail(e.target.value)}
                placeholder="ama@student.edu.gh"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">University / Polytechnic</label>
              <input
                type="text"
                required
                value={applicantSchool}
                onChange={(e) => setApplicantSchool(e.target.value)}
                placeholder="e.g. GIMPA Greenhill Campus"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAmbassadorModalOpen(false)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
