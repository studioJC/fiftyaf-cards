import AsyncStorage from "@react-native-async-storage/async-storage";

const JOURNAL_KEY = "@reinvention_cards:journal_entries";

export interface JournalEntry {
  id: string;
  cardId: number;
  cardTitle: string;
  date: string; // ISO date string
  timestamp: number;
  reflection: string;
}

/**
 * Generate a unique ID for journal entries
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all journal entries
 */
export async function getJournalEntries(): Promise<JournalEntry[]> {
  try {
    const stored = await AsyncStorage.getItem(JOURNAL_KEY);
    const entries: JournalEntry[] = stored ? JSON.parse(stored) : [];
    
    // Sort by timestamp descending (newest first)
    entries.sort((a, b) => b.timestamp - a.timestamp);
    
    return entries;
  } catch (error) {
    console.error("Error getting journal entries:", error);
    return [];
  }
}

/**
 * Get journal entries for a specific card
 */
export async function getEntriesByCard(cardId: number): Promise<JournalEntry[]> {
  const allEntries = await getJournalEntries();
  return allEntries.filter((entry) => entry.cardId === cardId);
}

/**
 * Get a single journal entry by ID
 */
export async function getJournalEntry(id: string): Promise<JournalEntry | null> {
  const entries = await getJournalEntries();
  return entries.find((entry) => entry.id === id) || null;
}

/**
 * Create a new journal entry
 */
export async function createJournalEntry(
  cardId: number,
  cardTitle: string,
  reflection: string
): Promise<JournalEntry> {
  const newEntry: JournalEntry = {
    id: generateId(),
    cardId,
    cardTitle,
    date: new Date().toISOString().split("T")[0],
    timestamp: Date.now(),
    reflection,
  };

  const entries = await getJournalEntries();
  entries.unshift(newEntry); // Add to beginning

  await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  
  return newEntry;
}

/**
 * Update an existing journal entry
 */
export async function updateJournalEntry(
  id: string,
  reflection: string
): Promise<JournalEntry | null> {
  const entries = await getJournalEntries();
  const index = entries.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return null;
  }

  entries[index].reflection = reflection;
  entries[index].timestamp = Date.now(); // Update timestamp

  await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  
  return entries[index];
}

/**
 * Delete a journal entry
 */
export async function deleteJournalEntry(id: string): Promise<boolean> {
  const entries = await getJournalEntries();
  const filtered = entries.filter((entry) => entry.id !== id);

  if (filtered.length === entries.length) {
    return false; // Entry not found
  }

  await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Clear all journal entries
 */
export async function clearJournal(): Promise<void> {
  await AsyncStorage.removeItem(JOURNAL_KEY);
}
