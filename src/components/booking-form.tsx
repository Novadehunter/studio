"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CalendarIcon, CalendarPlus, CalendarCheck2, Lightbulb, Loader2 } from "lucide-react"
import { format, isSameDay } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getMeetingTitleSuggestions } from "@/app/actions"
import { type Booking, type BookingFormData, bookingFormSchema, branches } from "@/lib/types"

interface BookingFormProps {
  onAddBooking: (data: BookingFormData) => void;
  existingBookings: Booking[];
}

export function BookingForm({ onAddBooking, existingBookings }: BookingFormProps) {
  const { toast } = useToast()
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      branch: undefined,
      title: "",
      date: undefined,
      startTime: "",
      endTime: "",
    },
  })

  function hasTimeOverlap(date: Date, startTime: string, endTime: string): boolean {
    return existingBookings.some(booking => {
      if (!isSameDay(new Date(booking.date), date)) return false;
      return (startTime < booking.endTime && endTime > booking.startTime);
    });
  }

  async function onSubmit(data: BookingFormData) {
    if (hasTimeOverlap(data.date, data.startTime, data.endTime)) {
      form.setError("startTime", {
        type: "manual",
        message: "This time slot is already booked. Please choose another time.",
      });
      return;
    }
    
    onAddBooking(data);
    toast({
      title: "Success!",
      description: "Your meeting has been booked successfully.",
    })
    form.reset();
    setSuggestions([]);
  }

  async function handleSuggestClick() {
    const keywords = form.getValues("title");
    if (!keywords.trim()) {
        toast({
            variant: "destructive",
            title: "Uh oh!",
            description: "Please enter some keywords to get suggestions.",
        });
        return;
    }
    setIsSuggesting(true);
    const result = await getMeetingTitleSuggestions(keywords);
    setSuggestions(result.suggestions);
    setIsSuggesting(false);
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
        <CalendarPlus className="mr-2 h-5 w-5" /> New Booking
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Title</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input placeholder="e.g. Project Alpha Review" {...field} />
                  </FormControl>
                  <Button type="button" variant="outline" onClick={handleSuggestClick} disabled={isSuggesting}>
                    {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
                    <span className="sr-only">Suggest Titles</span>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {suggestions.length > 0 && (
             <div className="bg-background/50 p-2 rounded-md border">
                <h3 className="text-sm font-medium text-foreground mb-1 px-2">AI Suggestions</h3>
                <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} 
                             className="text-sm p-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                             onClick={() => {
                                 form.setValue("title", suggestion);
                                 setSuggestions([]);
                             }}>
                            {suggestion}
                        </div>
                    ))}
                </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarCheck2 className="mr-2 h-4 w-4" />}
            Book Meeting
          </Button>
        </form>
      </Form>
    </>
  )
}
