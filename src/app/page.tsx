"use client";

import { useState } from 'react';
import { add, format, isSameDay } from 'date-fns';
import { BookingForm } from '@/components/booking-form';
import { CalendarView } from '@/components/calendar-view';
import { MeetingDetailsDialog } from '@/components/meeting-details-dialog';
import type { Booking, BookingFormData } from '@/lib/types';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <motion.header 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
            <h1 className="text-5xl font-bold text-gray-800 mb-2 font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Auditorium Booking</h1>
            <p className="text-slate-600 text-lg">Ministry of Transport</p>
        </motion.header>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 border border-gray-200/80">
                <BookingForm onAddBooking={handleAddBooking} existingBookings={bookings} />
            </motion.div>
            
            <motion.div variants={itemVariants} className="lg:col-span-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 border border-gray-200/80">
                <CalendarView bookings={bookings} onDayClick={handleDayClick} />
            </motion.div>
        </motion.div>
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
