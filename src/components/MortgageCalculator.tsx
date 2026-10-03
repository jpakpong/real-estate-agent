import React, { useState } from 'react';
import { DollarSign, Percent, Calculator, ArrowRight, ShieldCheck } from 'lucide-react';

interface MortgageCalculatorProps {
  onBookViewing: () => void;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ onBookViewing }) => {
  const [homePrice, setHomePrice] = useState<number>(2280000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(6.25);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [monthlyHoa, setMonthlyHoa] = useState<number>(1450);

  const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
  const loanPrincipal = homePrice - downPaymentAmount;

  // Monthly mortgage calculation: M = P * [r(1+r)^n] / [(1+r)^n – 1]
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTermYears * 12;
  const monthlyPrincipalInterest =
    monthlyRate > 0
      ? (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanPrincipal / totalMonths;

  // Property Tax (~0.85% annual)
  const monthlyTax = (homePrice * 0.0085) / 12;
  // Insurance
  const monthlyInsurance = (homePrice * 0.0025) / 12;
  // Total Monthly Outlay
  const totalMonthlyOutlay = monthlyPrincipalInterest + monthlyTax + monthlyInsurance + monthlyHoa;

  return (
    <section id="calculator-section" className="py-20 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
            Financial Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-neutral-900">
            Carrying Cost & Mortgage Outlay
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Simulate principal, interest, HOA dues, and municipal real estate taxes for prime city center residential acquisitions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-neutral-200">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Purchase Price */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 mb-2">
                <span>Purchase Price</span>
                <span className="font-mono text-neutral-900 text-sm font-bold tabular-nums">
                  ${homePrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={800000}
                max={5000000}
                step={25000}
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>$800k</span>
                <span>$2.5M</span>
                <span>$5.0M</span>
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 mb-2">
                <span>Down Payment ({downPaymentPercent}%)</span>
                <span className="font-mono text-neutral-900 text-sm font-bold tabular-nums">
                  ${Math.round(downPaymentAmount).toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>10% (Min)</span>
                <span>20% (Standard)</span>
                <span>50% (High Equity)</span>
              </div>
            </div>

            {/* Interest Rate & Loan Term */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Mortgage Rate (%)
                </label>
                <div className="relative">
                  <Percent className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="number"
                    step="0.05"
                    min="3.0"
                    max="10.0"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-md font-mono text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Loan Amortization
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLoanTermYears(30)}
                    className={`py-2 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                      loanTermYears === 30
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    30 Years
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoanTermYears(15)}
                    className={`py-2 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                      loanTermYears === 15
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    15 Years
                  </button>
                </div>
              </div>
            </div>

            {/* Monthly HOA fee adjust */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-700 mb-1.5">
                <span>Estimated Monthly Common Charge (HOA)</span>
                <span className="font-mono text-neutral-900 font-bold tabular-nums">
                  ${monthlyHoa.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min={400}
                max={3500}
                step={50}
                value={monthlyHoa}
                onChange={(e) => setMonthlyHoa(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
            </div>
          </div>

          {/* Breakdown Summary Column */}
          <div className="lg:col-span-5 bg-neutral-900 text-white rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-amber-300 mb-1">
                Estimated Total Monthly Outlay
              </div>
              <div className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-white mb-6 tabular-nums">
                ${Math.round(totalMonthlyOutlay).toLocaleString()}
                <span className="text-sm font-sans text-neutral-400 font-normal ml-1">/ month</span>
              </div>

              {/* Stacked Breakdown lines */}
              <div className="space-y-3 pb-6 border-b border-neutral-800 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Principal & Interest</span>
                  <span className="font-mono font-medium text-white tabular-nums">
                    ${Math.round(monthlyPrincipalInterest).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Building Common Charges (HOA)</span>
                  <span className="font-mono font-medium text-white tabular-nums">
                    ${monthlyHoa.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Estimated Municipal Tax</span>
                  <span className="font-mono font-medium text-white tabular-nums">
                    ${Math.round(monthlyTax).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Hazard & Condo Insurance</span>
                  <span className="font-mono font-medium text-white tabular-nums">
                    ${Math.round(monthlyInsurance).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 text-xs text-neutral-400 flex items-center justify-between">
                <span>Loan Principal</span>
                <span className="font-mono text-white font-medium tabular-nums">
                  ${Math.round(loanPrincipal).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={onBookViewing}
                className="w-full py-3 px-4 bg-amber-100 hover:bg-amber-200 text-neutral-950 font-semibold text-xs sm:text-sm rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Book Advisor Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-[10px] text-neutral-400 text-center mt-2.5">
                Estimates for informational modeling purposes only.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
