import AsyncStorage from "@react-native-async-storage/async-storage";

const STREAK_KEY = "@fiftyaf:streak_data";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string; // ISO date string (YYYY-MM-DD)
  visitDates: string[]; // Array of ISO date strings
  totalDays: number;
}

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get yesterday's date as ISO string (YYYY-MM-DD)
 */
function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

/**
 * Initialize streak data for new users
 */
function createInitialStreakData(): StreakData {
  const today = getTodayDate();
  return {
    currentStreak: 1,
    longestStreak: 1,
    lastVisitDate: today,
    visitDates: [today],
    totalDays: 1,
  };
}

/**
 * Get current streak data
 */
export async function getStreakData(): Promise<StreakData> {
  try {
    const stored = await AsyncStorage.getItem(STREAK_KEY);
    
    if (!stored) {
      // New user - initialize with today's visit
      const initialData = createInitialStreakData();
      await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(initialData));
      return initialData;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error("Error getting streak data:", error);
    return createInitialStreakData();
  }
}

/**
 * Record today's visit and update streak
 */
export async function recordTodaysVisit(): Promise<StreakData> {
  const data = await getStreakData();
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  // Already visited today
  if (data.lastVisitDate === today) {
    return data;
  }

  // Visited yesterday - continue streak
  if (data.lastVisitDate === yesterday) {
    data.currentStreak += 1;
    data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
  } 
  // Missed a day - reset streak
  else {
    data.currentStreak = 1;
  }

  // Update visit data
  data.lastVisitDate = today;
  data.visitDates.push(today);
  data.totalDays += 1;

  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(data));
  return data;
}

/**
 * Check if user visited on a specific date
 */
export function hasVisitedOnDate(data: StreakData, date: string): boolean {
  return data.visitDates.includes(date);
}

/**
 * Get streak milestone message
 */
export function getStreakMilestoneMessage(streak: number): string | null {
  const milestones: Record<number, string> = {
    3: "🔥 3 days! You're building momentum",
    7: "🌟 One week strong! You're forming a habit",
    14: "💪 Two weeks! This is becoming part of you",
    21: "✨ 21 days! The habit is taking root",
    30: "🎯 One month! You're committed to growth",
    66: "🏆 66 days! Your habit is fully formed",
    100: "👑 100 days! You're a reflection master",
    365: "🎉 One year! This is who you are now",
  };

  return milestones[streak] || null;
}

/**
 * Get encouragement message based on streak
 */
export function getStreakEncouragement(streak: number): string {
  if (streak === 0 || streak === 1) {
    return "Every journey begins with a single step";
  } else if (streak < 7) {
    return "Keep going! Consistency is key";
  } else if (streak < 30) {
    return "You're building something powerful";
  } else if (streak < 66) {
    return "Your practice is becoming second nature";
  } else {
    return "You've mastered the art of showing up";
  }
}

/**
 * Clear streak data (for testing)
 */
export async function clearStreakData(): Promise<void> {
  await AsyncStorage.removeItem(STREAK_KEY);
}
