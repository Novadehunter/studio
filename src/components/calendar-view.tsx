"use client";

import * as React from 'react';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import type { Booking } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  bookings: Booking[];
  onDayClick: (day: Date) => void;
}

export function CalendarView({ bookings, onDayClick }: CalendarViewProps) {
  let today = startOfToday();
  let [currentMonth, setCurrentMonth] = React.useState(format(today, 'MMM-yyyy'));
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  let days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  const bookingsByDate = React.useMemo(() => {
    return bookings.reduce((acc: { [key: string]: number }, booking) => {
      const dateKey = booking.date;
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});
  }, [bookings]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
        <CalendarDays className="mr-2 h-5 w-5" /> Booking Calendar
      </h2>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={previousMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-medium text-slate-700 font-headline">
          {format(firstDayCurrentMonth, 'MMMM yyyy')}
        </h3>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid grid-cols-7 text-center text-sm font-medium text-slate-500 mb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, dayIdx) => {
          const dayBookingsCount = bookingsByDate[format(day, 'yyyy-MM-dd')] || 0;
          
          let bookingIndicatorClass = '';
          if (dayBookingsCount > 0) {
            if (dayBookingsCount >= 3) {
              bookingIndicatorClass = 'bg-red-200/50';
            } else if (dayBookingsCount >= 2) {
              bookingIndicatorClass = 'bg-yellow-200/50';
            } else {
              bookingIndicatorClass = 'bg-green-200/50';
            }
          }

          return (
            <div
              key={day.toString()}
              className={cn(
                dayIdx === 0 && colStartClasses[day.getDay()],
                'h-16 border rounded-md p-1 flex flex-col justify-between transition-all ease-in-out duration-200'
              )}
            >
              <button
                onClick={() => onDayClick(day)}
                className={cn(
                  'w-full h-full flex flex-col items-center justify-center rounded-md',
                  isSameMonth(day, firstDayCurrentMonth)
                    ? 'text-slate-800'
                    : 'text-slate-400',
                  !isToday(day) && 'hover:bg-primary/10',
                  isToday(day) && 'bg-primary/20 text-primary-foreground',
                  bookingIndicatorClass,
                )}
              >
                <time dateTime={format(day, 'yyyy-MM-dd')} className="font-medium">
                  {format(day, 'd')}
                </time>
                 {dayBookingsCount > 0 && isSameMonth(day, firstDayCurrentMonth) && (
                    <span className="text-xs text-slate-600 mt-1">{dayBookingsCount} booking{dayBookingsCount > 1 ? 's' : ''}</span>
                 )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];
