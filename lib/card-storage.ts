import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, getRandomCard, getCardById } from "@/constants/cards";

const DAILY_CARD_KEY = "@reinvention_cards:daily_card";
const CARD_HISTORY_KEY = "@reinvention_cards:card_history";

export interface DailyCardEntry {
  cardId: number;
  date: string; // ISO date string (YYYY-MM-DD)
  timestamp: number;
}

/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

/**
 * Get or draw today's card
 * Returns the card that was drawn for today, or draws a new one if none exists
 */
export async function getTodaysCard(): Promise<{ card: Card; isNew: boolean }> {
  try {
    const stored = await AsyncStorage.getItem(DAILY_CARD_KEY);
    const today = getTodayDateString();

    if (stored) {
      const entry: DailyCardEntry = JSON.parse(stored);
      
      // Check if the stored card is from today
      if (entry.date === today) {
        const card = getCardById(entry.cardId);
        if (card) {
          return { card, isNew: false };
        }
      }
    }

    // Draw a new card for today
    const newCard = getRandomCard();
    const newEntry: DailyCardEntry = {
      cardId: newCard.id,
      date: today,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem(DAILY_CARD_KEY, JSON.stringify(newEntry));
    await addToHistory(newEntry);

    return { card: newCard, isNew: true };
  } catch (error) {
    console.error("Error getting today's card:", error);
    // Fallback to random card
    return { card: getRandomCard(), isNew: true };
  }
}

/**
 * Manually draw a new card (replaces today's card)
 */
export async function drawNewCard(): Promise<Card> {
  const newCard = getRandomCard();
  const today = getTodayDateString();
  
  const newEntry: DailyCardEntry = {
    cardId: newCard.id,
    date: today,
    timestamp: Date.now(),
  };

  await AsyncStorage.setItem(DAILY_CARD_KEY, JSON.stringify(newEntry));
  await addToHistory(newEntry);

  return newCard;
}

/**
 * Add card draw to history
 */
async function addToHistory(entry: DailyCardEntry): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(CARD_HISTORY_KEY);
    const history: DailyCardEntry[] = stored ? JSON.parse(stored) : [];

    // Check if we already have an entry for this date
    const existingIndex = history.findIndex((h) => h.date === entry.date);
    
    if (existingIndex >= 0) {
      // Update existing entry
      history[existingIndex] = entry;
    } else {
      // Add new entry
      history.push(entry);
    }

    // Keep only last 90 days
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const filtered = history.filter((h) => h.timestamp > ninetyDaysAgo);

    // Sort by date descending (newest first)
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    await AsyncStorage.setItem(CARD_HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error adding to history:", error);
  }
}

/**
 * Get card history (last 90 days)
 */
export async function getCardHistory(): Promise<DailyCardEntry[]> {
  try {
    const stored = await AsyncStorage.getItem(CARD_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error getting card history:", error);
    return [];
  }
}

/**
 * Clear all card data (for testing/reset)
 */
export async function clearCardData(): Promise<void> {
  await AsyncStorage.multiRemove([DAILY_CARD_KEY, CARD_HISTORY_KEY]);
}
