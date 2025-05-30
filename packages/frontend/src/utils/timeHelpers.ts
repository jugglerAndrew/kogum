import type { DailyMealType } from "../types";

export const getCurrentMealType = (date: Date = new Date()): DailyMealType => {
  const currentHour = date.getHours();

  if (currentHour >= 0 && currentHour <= 6) {
    return "dessert"; // 00:00 - 06:00
  } else if (currentHour > 6 && currentHour <= 12) {
    return "breakfast"; // 06:01 - 12:00
  } else if (currentHour > 12 && currentHour <= 18) {
    return "lunch"; // 12:01 - 18:00
  } else {
    // currentHour > 18 && currentHour <= 23 (implicitly 23:59)
    return "dinner"; // 18:01 - 23:59
  }
};

// Helper to format meal type for display
export const formatMealType = (mealType: DailyMealType): string => {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
};
