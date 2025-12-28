import { Platform, Share, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { Card } from "@/constants/cards";

/**
 * Share a card to social media
 * Note: For full image sharing with custom branding, we would need:
 * - expo-sharing package for native sharing
 * - expo-file-system for file operations
 * - Canvas/Image manipulation library to add branding overlay
 * 
 * For now, this shares the card title and message as text
 */
export async function shareCard(card: Card): Promise<boolean> {
  try {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const message = `Today's FiftyAF Minute Moment:\n\n${card.title.toUpperCase()}\n${card.domain}\n\n"${card.summary}"\n\n#FiftyAF #DailyReflection #BeKindAndCurious`;

    const result = await Share.share({
      message,
      title: `${card.title} - FiftyAF Minute Moment`,
    });

    if (result.action === Share.sharedAction) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error sharing card:", error);
    Alert.alert(
      "Share Failed",
      "There was an error sharing the card. Please try again.",
      [{ text: "OK" }]
    );
    return false;
  }
}

/**
 * Get shareable text for a card
 */
export function getShareableText(card: Card): string {
  return `Today's FiftyAF Minute Moment:\n\n${card.title.toUpperCase()}\n${card.domain}\n\n"${card.summary}"\n\n#FiftyAF #DailyReflection #BeKindAndCurious`;
}

/**
 * Copy card text to clipboard
 */
export async function copyCardToClipboard(card: Card): Promise<boolean> {
  try {
    // Note: Would need expo-clipboard package for full clipboard support
    // For now, just show success message
    Alert.alert(
      "Coming Soon",
      "Copy to clipboard feature will be available in the next update.",
      [{ text: "OK" }]
    );
    return false;
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
}
