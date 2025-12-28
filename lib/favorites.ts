import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "@fiftyaf:favorites";

/**
 * Get all favorite card IDs
 */
export async function getFavorites(): Promise<number[]> {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
}

/**
 * Check if a card is favorited
 */
export async function isFavorite(cardId: number): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(cardId);
}

/**
 * Add a card to favorites
 */
export async function addFavorite(cardId: number): Promise<void> {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(cardId)) {
      favorites.push(cardId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error("Error adding favorite:", error);
  }
}

/**
 * Remove a card from favorites
 */
export async function removeFavorite(cardId: number): Promise<void> {
  try {
    const favorites = await getFavorites();
    const updated = favorites.filter((id) => id !== cardId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
}

/**
 * Toggle favorite status for a card
 */
export async function toggleFavorite(cardId: number): Promise<boolean> {
  const isCurrentlyFavorite = await isFavorite(cardId);
  
  if (isCurrentlyFavorite) {
    await removeFavorite(cardId);
    return false;
  } else {
    await addFavorite(cardId);
    return true;
  }
}
