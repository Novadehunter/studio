"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Booking } from "@/lib/types";
import { branchColors } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MeetingDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  bookingsForDate: Booking[];
}

export function MeetingDetailsDialog({
  isOpen,
  onClose,
  selectedDate,
  bookingsForDate,
}: MeetingDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-slate-800">
            Meetings for {format(selectedDate, "PPP")}
          </DialogTitle>
          <DialogDescription>
            Here are the scheduled meetings for this day.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {bookingsForDate.length > 0 ? (
            <div className="space-y-4">
              {bookingsForDate.map((booking) => {
                const colors = branchColors[booking.branch];
                return (
                  <div key={booking.id} className={cn("p-3 rounded-lg border-l-4", colors.border, colors.bg)}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-900">{booking.title}</h4>
                      <Badge variant="secondary" className={cn(colors.bg, colors.text)}>{booking.branch}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      {booking.startTime} - {booking.endTime}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Booked by: {booking.name}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500">No meetings scheduled for this day.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
