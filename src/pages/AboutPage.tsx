import React from 'react';
import { ShieldCheck, Truck, Users, Store, HeartHandshake, HelpCircle } from 'lucide-react';
import { UNIVERSITIES } from '../data/mockData';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero / Mission */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-orange-700 dark:text-orange-400 text-xs font-semibold">
          <span>About CampusBuy Ghana</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white font-brand leading-tight">
          "Your Campus. Your Marketplace."
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
          CampusBuy was created to solve student commerce across Ghanaian tertiary universities. We empower student entrepreneurs to run verified storefronts, while making dorm essentials, electronics, textbooks, food, and campus services safely accessible to all students.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-zinc-950 dark:text-white text-base">Peer Safety First</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Every vendor profile is tied to a verified campus identity. We enforce safe meetups at hall porter lodges and faculty quads before payment.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-zinc-950 dark:text-white text-base">Hyperlocal Room Delivery</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            No waiting 3 to 5 days for city dispatches. Our vendors deliver straight to your hall room or hostel door in minutes to hours.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-zinc-950 dark:text-white text-base">Empowering Student Sellers</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            From baking snacks in hall kitchens to thrifting hoodies and repairing phones, students earn sustainable income on their terms.
          </p>
        </div>
      </div>

      {/* Campus Safety Rules */}
      <div className="bg-orange-950/10 dark:bg-zinc-900 border border-orange-200 dark:border-orange-900/40 rounded-3xl p-8 space-y-4">
        <div className="flex items-center gap-2 text-orange-900 dark:text-orange-400 font-bold text-lg font-brand">
          <HeartHandshake className="w-5 h-5 text-orange-600" />
          <span>Student Peer Trading Safety Guidelines</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          To ensure every student stays secure on campus, please follow our golden trade rules:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-800 dark:text-zinc-300">
          <div className="p-3 bg-white dark:bg-black/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <strong className="text-orange-600 dark:text-orange-400">1. Meet in Public Campus Areas:</strong> Conduct handovers at your hall porter lodge, college cafeteria, or faculty quad in broad daylight.
          </div>
          <div className="p-3 bg-white dark:bg-black/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <strong className="text-orange-600 dark:text-orange-400">2. Inspect Before Paying:</strong> Turn on electronics, test power banks, verify textbook editions, or inspect apparel stitching before handing over cash or sending MoMo.
          </div>
          <div className="p-3 bg-white dark:bg-black/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <strong className="text-orange-600 dark:text-orange-400">3. Avoid Pre-Payments to Unknown Sellers:</strong> CampusBuy recommends Cash on Delivery or MoMo payment on item receipt.
          </div>
          <div className="p-3 bg-white dark:bg-black/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <strong className="text-orange-600 dark:text-orange-400">4. Report Unverified Vendors:</strong> If a vendor asks for obscure off-campus meetups, alert the CampusBuy student support rep immediately.
          </div>
        </div>
      </div>

      {/* Supported Institutions */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white font-brand text-center">
          Our Active Campuses
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {UNIVERSITIES.map(u => (
            <span key={u.id} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold">
              {u.name} ({u.shortName})
            </span>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-lg font-brand">
          <HelpCircle className="w-5 h-5 text-orange-600" />
          <span>Frequently Asked Questions</span>
        </div>

        <div className="space-y-3">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm">
            <h4 className="font-bold text-zinc-950 dark:text-white">How do I become a vendor?</h4>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Click "Become a Vendor" or register with the vendor role. Once verified with your student ID or commercial registration, you can upload products and start receiving orders from students in your university.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm">
            <h4 className="font-bold text-zinc-950 dark:text-white">What payment methods are supported?</h4>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Buyers can choose Cash on Delivery / Hall Meetup or Mobile Money (MTN MoMo, Telecel Cash) upon personal inspection of items.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm">
            <h4 className="font-bold text-zinc-950 dark:text-white">How will Dokan and WooCommerce be connected?</h4>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              CampusBuy is built with clean async service layers matching Dokan and WooCommerce REST API specifications. Replacing mock data with live WordPress endpoints requires only updating <code className="text-orange-600 dark:text-orange-400">src/services/api.ts</code>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
