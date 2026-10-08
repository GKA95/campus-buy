import React from 'react';
import { CampusService } from '../../types';
import { Star, Clock, Phone, MapPin, Printer, Sparkles, Wrench, Camera, BookOpen, Bike, Palette, Home, Utensils } from 'lucide-react';

interface ServiceCardProps {
  service: CampusService;
  onRequestBooking: (service: CampusService) => void;
}

const serviceCategoryIcons: Record<string, React.ElementType> = {
  Printing: Printer,
  Laundry: Sparkles,
  Repairs: Wrench,
  Photography: Camera,
  Tutoring: BookOpen,
  'Food Delivery': Utensils,
  Transportation: Bike,
  'Graphic Design': Palette,
  Accommodation: Home
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onRequestBooking }) => {
  const IconComponent = serviceCategoryIcons[service.category] || Wrench;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/90 dark:border-zinc-800 p-5 hover:border-orange-500/50 dark:hover:border-orange-500/60 hover:shadow-lg dark:hover:shadow-orange-950/20 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 border border-orange-200 dark:border-orange-800/60">
            <IconComponent className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{service.rating}</span>
            <span>({service.reviewCount})</span>
          </div>
        </div>

        {/* Category & Campus */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
          <span className="font-semibold text-orange-600 dark:text-orange-400 uppercase text-[10px] tracking-wider">
            {service.category}
          </span>
          <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
          <span>{service.universityName}</span>
        </div>

        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {service.title}
        </h3>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          By <span className="font-medium text-zinc-700 dark:text-zinc-300">{service.providerName}</span>
        </p>

        <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2.5 line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        {/* Turnaround time & Location tags */}
        <div className="mt-3 space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{service.turnaroundTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span className="truncate">{service.popularLocations.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 block">Starting from</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-zinc-900 dark:text-white font-mono tabular-nums">
              GH₵ {service.startingPrice < 1 ? service.startingPrice.toFixed(2) : service.startingPrice}
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[110px]">{service.priceUnit}</span>
          </div>
        </div>

        <button
          onClick={() => onRequestBooking(service)}
          className="px-3.5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Contact</span>
        </button>
      </div>
    </div>
  );
};
