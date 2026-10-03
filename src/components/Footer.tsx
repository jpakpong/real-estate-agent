import React from 'react';
import { Building2, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-900 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800/80">
          {/* Brand & Office */}
          <div className="md:col-span-2">
            <span className="text-xl font-serif font-semibold text-white tracking-tight block mb-3">
              Aurelia Metropolitan
            </span>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed mb-6 font-normal">
              Licensed Prime Residential Real Estate Brokerage. Exclusively representing buyers of luxury apartments, lofts, and sky penthouses in the central metropolitan district.
            </p>
            <div className="space-y-1.5 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>One Meridian Plaza, 40th Floor, Downtown City Center</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>+1 (212) 555-0100</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>concierge@aureliametropolitan.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              City Center Districts
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#interactive-map-section" className="hover:text-white transition-colors">
                  Financial Core Residences
                </a>
              </li>
              <li>
                <a href="#interactive-map-section" className="hover:text-white transition-colors">
                  Arts & Culture Quarter
                </a>
              </li>
              <li>
                <a href="#interactive-map-section" className="hover:text-white transition-colors">
                  Civic & Central Gardens
                </a>
              </li>
              <li>
                <a href="#interactive-map-section" className="hover:text-white transition-colors">
                  Harbor Waterfront Promenades
                </a>
              </li>
              <li>
                <a href="#interactive-map-section" className="hover:text-white transition-colors">
                  Historic Old Town Walk
                </a>
              </li>
            </ul>
          </div>

          {/* Disclosures & Regulatory */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Regulatory Standards
            </h4>
            <div className="space-y-3 text-[11px] text-neutral-500 leading-relaxed">
              <p>
                Equal Housing Opportunity. All dimensions and architectural renderings are approximate and subject to field verification.
              </p>
              <div className="flex items-center gap-2 text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Licensed Metropolitan Brokerage RE-84920</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} Aurelia Metropolitan Prime Residences. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">Terms of Brokerage</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">Fair Housing Notice</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
