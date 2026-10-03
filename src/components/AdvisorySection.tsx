import React from 'react';
import { ShieldCheck, Award, KeyRound, Building, PhoneCall, Mail } from 'lucide-react';

interface AdvisorySectionProps {
  onBookViewing: () => void;
}

export const AdvisorySection: React.FC<AdvisorySectionProps> = ({ onBookViewing }) => {
  return (
    <section id="agency-section" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Proposition */}
        <div className="lg:col-span-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-2">
            Private Client Practice
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-neutral-900 leading-tight mb-6">
            Discretion, precision, and city center exclusivity.
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
            Aurelia Metropolitan was founded on a singular premise: prime downtown residential acquisitions demand the same rigor as private equity transactions. We exclusively represent buyers seeking architectural integrity, walkability, and long-term capital preservation in the metropolitan core.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-neutral-100 rounded-md text-neutral-800 shrink-0 mt-0.5">
                <KeyRound className="w-4 h-4 text-amber-800" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-neutral-900 text-sm">
                  Off-Market & Pre-Public Inventory
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                  Over 40% of our residential sales never reach public portals, transacted quietly between private collections.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-neutral-100 rounded-md text-neutral-800 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-neutral-900 text-sm">
                  Acoustic & Structural Diligence
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                  Every flat in our collection undergoes decibel noise testing, mechanical audit, and HOA balance sheet review.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onBookViewing}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer shadow-sm"
            >
              Request Private Consultation
            </button>
            <div className="text-xs text-neutral-500">
              Direct line: <span className="font-semibold text-neutral-900">+1 (212) 555-0100</span>
            </div>
          </div>
        </div>

        {/* Right Column: Numbered Services List */}
        <div className="lg:col-span-6 space-y-4">
          {[
            {
              number: '01',
              title: 'Metropolitan Acquisition Advisory',
              desc: 'Tailored residential searches matching exact sunlight orientation, ceiling clearance, and private elevator requirements.',
            },
            {
              number: '02',
              title: 'Architectural Due Diligence',
              desc: 'Complete vetting of developer track records, building mechanical warranties, acoustic decibel ratings, and capital reserve funds.',
            },
            {
              number: '03',
              title: 'Discrete Closing Protocols',
              desc: 'Seamless coordination with family offices, private wealth bankers, and real estate counsel for expedited settlement.',
            },
          ].map((item) => (
            <div
              key={item.number}
              className="p-6 bg-white rounded-xl border border-neutral-200/90 hover:border-neutral-400 transition-colors shadow-xs"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-serif text-amber-900 font-bold text-lg tabular-nums">
                  {item.number}.
                </span>
                <h3 className="font-serif text-lg font-medium text-neutral-900">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs text-neutral-600 pl-8 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
