// @/app/actions.ts
"use server";

import { suggestMeetingTitles } from "@/ai/flows/suggest-meeting-titles";

export async function getMeetingTitleSuggestions(keywords: string) {
  if (!keywords) {
    return { suggestions: [] };
  }
  try {
    const result = await suggestMeetingTitles({ keywords });
    return result;
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    return { suggestions: [] };
  }
}
