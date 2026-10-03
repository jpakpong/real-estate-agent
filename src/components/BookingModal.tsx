import React, { useState } from 'react';
import { Property, Booking, TourType } from '../types';
import { X, Calendar, Clock, User, Mail, Phone, CheckCircle, Download, ShieldCheck, Sparkles, Building, Video } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  allProperties: Property[];
  onConfirmBooking: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  property,
  allProperties,
  onConfirmBooking,
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    property?.id || allProperties[0]?.id || ''
  );
  const [tourType, setTourType] = useState<TourType>('In-Person Private Walkthrough');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('11:00 AM');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [buyerType, setBuyerType] = useState<Booking['buyerType']>('Immediate Buyer');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const currentProperty =
    allProperties.find((p) => p.id === selectedPropertyId) || property || allProperties[0];

  // Generate next 10 days for convenient day picker
  const upcomingDays = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const iso = d.toISOString().split('T')[0];
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    return { iso, weekday, dayNum, month };
  });

  const timeSlots = [
    '09:30 AM',
    '11:00 AM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM',
    '06:00 PM (Sunset Slot)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    const newBooking: Booking = {
      id: `AUR-${Math.floor(1000 + Math.random() * 9000)}-${currentProperty.id.split('-')[1]?.toUpperCase() || 'RES'}`,
      propertyId: currentProperty.id,
      propertyTitle: currentProperty.title,
      propertyAddress: currentProperty.address,
      propertyImage: currentProperty.heroImage,
      tourType,
      date: selectedDate,
      timeSlot: selectedTime,
      buyerName: fullName,
      buyerEmail: email,
      buyerPhone: phone,
      buyerType,
      specialRequests,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
    };

    onConfirmBooking(newBooking);
    setConfirmedBooking(newBooking);
  };

  const handleDownloadCalendar = () => {
    if (!confirmedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Aurelia Metropolitan//Residential Viewing//EN
BEGIN:VEVENT
SUMMARY:Private Residence Viewing: ${confirmedBooking.propertyTitle}
DESCRIPTION:Private Walkthrough with ${currentProperty.agent.name} (${currentProperty.agent.phone})\\nType: ${confirmedBooking.tourType}\\nRef: ${confirmedBooking.id}
LOCATION:${confirmedBooking.propertyAddress}
DTSTART:${confirmedBooking.date.replace(/-/g, '')}T110000Z
DTEND:${confirmedBooking.date.replace(/-/g, '')}T120000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Viewing-${confirmedBooking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetAndClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-auto">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Confirmation State */
          <div className="p-8 sm:p-10 text-center">
            <div className="w-14 h-14 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
              Private Tour Confirmed
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-neutral-900 mb-2">
              Viewing Appointment Reserved
            </h2>
            <p className="text-xs text-neutral-600 max-w-md mx-auto mb-6">
              A private advisor has been assigned to host your consultation and walkthrough. An invitation dispatch has been transmitted to <span className="font-medium text-neutral-900">{confirmedBooking.buyerEmail}</span>.
            </p>

            {/* Reservation Summary Card */}
            <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200 text-left mb-6 max-w-lg mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-3 text-xs">
                <span className="text-neutral-500 font-medium">Reference Code</span>
                <span className="font-mono font-bold text-neutral-900 tracking-wider">
                  {confirmedBooking.id}
                </span>
              </div>

              <div className="flex gap-3 mb-4">
                <img
                  src={confirmedBooking.propertyImage}
                  alt={confirmedBooking.propertyTitle}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-neutral-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-serif font-medium text-neutral-900 text-sm">
                    {confirmedBooking.propertyTitle}
                  </h4>
                  <p className="text-xs text-neutral-500">{confirmedBooking.propertyAddress}</p>
                  <p className="text-xs text-amber-800 font-medium mt-1">
                    {confirmedBooking.tourType}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-neutral-200">
                <div>
                  <span className="text-neutral-500 block">Date & Time</span>
                  <span className="font-semibold text-neutral-900">
                    {confirmedBooking.date} at {confirmedBooking.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Assigned Advisor</span>
                  <span className="font-semibold text-neutral-900">
                    {currentProperty.agent.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleDownloadCalendar}
                className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <button
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
                Private Consultation & Viewing
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-neutral-900">
                Book a Private Viewing
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Experience prime city center craftsmanship in person or via high-resolution virtual tour.
              </p>
            </div>

            {/* Selected Flat Card Header */}
            <div className="mb-6 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentProperty.heroImage}
                  alt={currentProperty.title}
                  className="w-14 h-14 rounded-lg object-cover shrink-0 border border-neutral-200"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <div className="text-[11px] text-amber-900 font-medium">
                    {currentProperty.district} · {currentProperty.floor}
                  </div>
                  <h4 className="font-serif font-medium text-neutral-900 text-sm truncate">
                    {currentProperty.title}
                  </h4>
                  <div className="text-xs font-semibold text-neutral-800 tabular-nums">
                    {currentProperty.priceFormatted} · {currentProperty.beds} Beds · {currentProperty.sqft} sq ft
                  </div>
                </div>
              </div>

              {/* Selector to change residence if wanted */}
              <div className="shrink-0">
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="text-xs bg-white border border-neutral-300 rounded px-2 py-1 text-neutral-700 cursor-pointer"
                >
                  {allProperties.map((p) => (
                    <option key={p.id} value={p.id}>
                      Change: {p.title.split(' at ')[0]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 1: Tour Type Selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-neutral-700 mb-2 uppercase tracking-wider">
                1. Select Tour Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    type: 'In-Person Private Walkthrough' as TourType,
                    icon: Building,
                    title: 'Private Walkthrough',
                    desc: '60 min exclusive tour with Senior Advisor',
                  },
                  {
                    type: 'Sunset Champagne VIP Tour' as TourType,
                    icon: Sparkles,
                    title: 'VIP Sunset Tour',
                    desc: 'Golden hour viewing with skyline aperitif',
                  },
                  {
                    type: 'Virtual 4K Live Video Tour' as TourType,
                    icon: Video,
                    title: 'Live 4K Virtual Tour',
                    desc: 'Interactive guided video walk for remote buyers',
                  },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setTourType(item.type)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      tourType === item.type
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <item.icon
                        className={`w-4 h-4 ${tourType === item.type ? 'text-amber-300' : 'text-neutral-500'}`}
                      />
                      <span className="text-xs font-bold">{item.title}</span>
                    </div>
                    <span
                      className={`text-[10px] leading-tight ${
                        tourType === item.type ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Date Selector (Horizontal Scrollable Strip) */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-neutral-700 mb-2 uppercase tracking-wider">
                2. Preferred Viewing Date
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {upcomingDays.map((day) => {
                  const isSelected = selectedDate === day.iso;
                  return (
                    <button
                      type="button"
                      key={day.iso}
                      onClick={() => setSelectedDate(day.iso)}
                      className={`min-w-[62px] p-2 rounded-lg text-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-semibold opacity-70">
                        {day.weekday}
                      </div>
                      <div className="text-base font-bold tabular-nums my-0.5">
                        {day.dayNum}
                      </div>
                      <div className="text-[10px] opacity-70">{day.month}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Time Slot Selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-neutral-700 mb-2 uppercase tracking-wider">
                3. Preferred Time Slot
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-3 text-xs font-medium rounded-md border text-center transition-colors cursor-pointer ${
                      selectedTime === slot
                        ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Discerning Buyer Information */}
            <div className="mb-6 pt-4 border-t border-neutral-200">
              <label className="block text-xs font-semibold text-neutral-700 mb-3 uppercase tracking-wider">
                4. Residential Buyer Credentials
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] text-neutral-600 mb-1">Full Legal Name *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Julian Montgomery"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-md focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-600 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="email"
                      required
                      placeholder="julian@montgomery.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-md focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-600 mb-1">Telephone / WhatsApp *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (212) 555-0199"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-md focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-600 mb-1">Buyer Readiness</label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-md focus:ring-1 focus:ring-neutral-900 focus:bg-white cursor-pointer"
                  >
                    <option value="Immediate Buyer">Immediate Buyer (Ready to close)</option>
                    <option value="Relocating to City">Relocating to City (30-90 days)</option>
                    <option value="Portfolio Investor">Portfolio Investor</option>
                    <option value="Exploring Options">Preliminary Search</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-600 mb-1">
                  Special Inquiries / Access Requirements (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Parking access required, interested in architectural floor load specs..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-md focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Confidential White-Glove Advisory</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  Confirm Viewing Appointment
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
