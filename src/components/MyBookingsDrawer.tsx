import React from 'react';
import { Booking } from '../types';
import { X, Calendar, Clock, MapPin, Download, Trash2, CheckCircle } from 'lucide-react';

interface MyBookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onBookNew: () => void;
}

export const MyBookingsDrawer: React.FC<MyBookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onBookNew,
}) => {
  if (!isOpen) return null;

  const handleDownloadIcs = (b: Booking) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Aurelia Metropolitan//Private Viewing//EN
BEGIN:VEVENT
SUMMARY:Viewing: ${b.propertyTitle}
DESCRIPTION:Tour Format: ${b.tourType}\\nConfirmation ID: ${b.id}
LOCATION:${b.propertyAddress}
DTSTART:${b.date.replace(/-/g, '')}T110000Z
DTEND:${b.date.replace(/-/g, '')}T120000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Viewing-${b.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-neutral-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h3 className="font-serif text-xl font-medium text-neutral-900">
              My Private Viewings
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {bookings.length} scheduled appointment{bookings.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-neutral-800">No scheduled appointments</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto mb-6">
                Reserve an in-person or live 4K virtual tour of any prime city center flat.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onBookNew();
                }}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Schedule First Tour
              </button>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-neutral-500 font-semibold">{b.id}</span>
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{b.status}</span>
                    </span>
                  </div>

                  <div className="flex gap-3 mb-3">
                    <img
                      src={b.propertyImage}
                      alt={b.propertyTitle}
                      className="w-14 h-14 rounded-lg object-cover shrink-0 border border-neutral-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h4 className="font-serif font-medium text-neutral-900 text-sm truncate">
                        {b.propertyTitle}
                      </h4>
                      <p className="text-xs text-neutral-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{b.propertyAddress}</span>
                      </p>
                      <p className="text-[11px] text-amber-900 font-semibold mt-1">
                        {b.tourType}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-neutral-200 text-xs grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block">Date</span>
                      <span className="font-semibold text-neutral-800">{b.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block">Time Slot</span>
                      <span className="font-semibold text-neutral-800">{b.timeSlot}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                  <button
                    onClick={() => handleDownloadIcs(b)}
                    className="text-xs font-medium text-neutral-700 hover:text-neutral-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .ics</span>
                  </button>

                  <button
                    onClick={() => onCancelBooking(b.id)}
                    className="text-xs font-medium text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onBookNew();
            }}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-md transition-colors cursor-pointer text-center"
          >
            Book Another Viewing
          </button>
        </div>
      </div>
    </div>
  );
};
