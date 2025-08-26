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
import { Clock, User } from "lucide-react";

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-slate-800">
            Meetings for {format(selectedDate, "PPP")}
          </DialogTitle>
          <DialogDescription>
            {bookingsForDate.length > 0 
              ? `There are ${bookingsForDate.length} meeting(s) scheduled for this day.`
              : "No meetings scheduled for this day."}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2 -mr-4">
          {bookingsForDate.length > 0 ? (
            <div className="space-y-4">
              {bookingsForDate.map((booking) => {
                const colors = branchColors[booking.branch];
                return (
                  <div key={booking.id} className={cn("p-4 rounded-lg border-l-4 transition-all hover:shadow-md", colors.border, colors.bg)}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-900 pr-2">{booking.title}</h4>
                      <Badge variant="secondary" className={cn("text-xs whitespace-nowrap", colors.badgeBg, colors.text)}>{booking.branch}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {booking.startTime} - {booking.endTime}
                      </p>
                      <p className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Booked by: {booking.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500">You can book a meeting on this day.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
