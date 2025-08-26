import { z } from "zod";

export type Booking = {
  id: number;
  name: string;
  branch: Branch;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
};

export const branches = ["Technical", "Planning", "Development", "Accounts", "Admin", "Transport", "Legal"] as const;
export type Branch = typeof branches[number];

export const branchColors: Record<Branch, { bg: string, text: string, border: string, badgeBg: string }> = {
  Technical: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-500", badgeBg: "bg-blue-100" },
  Planning: { bg: "bg-green-50", text: "text-green-800", border: "border-green-500", badgeBg: "bg-green-100" },
  Development: { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-500", badgeBg: "bg-purple-100" },
  Accounts: { bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-500", badgeBg: "bg-yellow-100" },
  Admin: { bg: "bg-red-50", text: "text-red-800", border: "border-red-500", badgeBg: "bg-red-100" },
  Transport: { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-500", badgeBg: "bg-indigo-100" },
  Legal: { bg: "bg-gray-50", text: "text-gray-800", border: "border-gray-500", badgeBg: "bg-gray-200" },
};

export const bookingFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  branch: z.enum(branches, { required_error: "Please select a branch." }),
  title: z.string().min(3, { message: "Meeting title is required." }),
  date: z.date({ required_error: "A date is required." }).refine(date => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 is Sunday, 6 is Saturday
  }, { message: "Please select a working day (Mon-Fri)." }),
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
}).refine(data => data.endTime > data.startTime, {
  message: "End time must be after start time.",
  path: ["endTime"],
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
