"use client";

import { useState } from 'react';
import { add, format, isSameDay } from 'date-fns';
import { BookingForm } from '@/components/booking-form';
import { CalendarView } from '@/components/calendar-view';
import { MeetingDetailsDialog } from '@/components/meeting-details-dialog';
import type { Booking, BookingFormData } from '@/lib/types';

function getInitialBookings(): Booking[] {
  const today = new Date();
  const tomorrow = add(today, { days: 1 });
  const dayAfter = add(today, { days: 2 });
  const anotherDay = add(today, { days: 5 });

  return [
    { id: 1, name: "John Doe", branch: "Technical", title: "Quarterly Tech Review", date: format(today, 'yyyy-MM-dd'), startTime: "09:00", endTime: "11:00" },
    { id: 2, name: "Jane Smith", branch: "Planning", title: "Project Roadmap Discussion", date: format(today, 'yyyy-MM-dd'), startTime: "14:00", endTime: "15:30" },
    { id: 3, name: "Robert Johnson", branch: "Development", title: "Code Review Session", date: format(tomorrow, 'yyyy-MM-dd'), startTime: "10:30", endTime: "12:00" },
    { id: 4, name: "Sarah Williams", branch: "Admin", title: "Staff Meeting", date: format(dayAfter, 'yyyy-MM-dd'), startTime: "13:00", endTime: "14:30" },
    { id: 5, name: "Emily Brown", branch: "Transport", title: "Logistics Sync", date: format(anotherDay, 'yyyy-MM-dd'), startTime: "11:00", endTime: "12:00" },
    { id: 6, name: "Michael Clark", branch: "Legal", title: "Contract Finalization", date: format(anotherDay, 'yyyy-MM-dd'), startTime: "15:00", endTime: "16:00" },
  ];
}

export default function Home() {
  const [bookings, setBookings] = useState<Booking[]>(getInitialBookings());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleAddBooking = (newBookingData: BookingFormData) => {
    const newBooking: Booking = {
      id: Date.now(),
      ...newBookingData,
      date: format(newBookingData.date, 'yyyy-MM-dd'),
    };
    setBookings(prev => [...prev, newBooking].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.startTime.localeCompare(b.startTime)));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const closeDialog = () => {
    setSelectedDate(null);
  };

  const bookingsForSelectedDate = selectedDate
    ? bookings.filter(b => isSameDay(new Date(b.date), selectedDate))
    : [];

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-2 font-headline">Auditorium Booking System</h1>
            <p className="text-slate-600">Ministry of Transport</p>
            <p className="text-slate-500 text-sm">Book meeting rooms efficiently while ensuring no time conflicts</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2 bg-gradient-to-br from-card to-background backdrop-blur-sm rounded-xl shadow-lg p-6 border">
                <BookingForm onAddBooking={handleAddBooking} existingBookings={bookings} />
            </div>
            
            <div className="lg:col-span-3 bg-gradient-to-br from-card to-background backdrop-blur-sm rounded-xl shadow-lg p-6 border">
                <CalendarView bookings={bookings} onDayClick={handleDayClick} />
            </div>
        </div>
      </main>
      
      {selectedDate && (
        <MeetingDetailsDialog
          isOpen={!!selectedDate}
          onClose={closeDialog}
          selectedDate={selectedDate}
          bookingsForDate={bookingsForSelectedDate}
        />
      )}
    </>
  );
}
