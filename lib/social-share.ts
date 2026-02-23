import { Platform, Share, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { captureRef } from "react-native-view-shot";
import { Card } from "@/constants/cards";
import { RefObject } from "react";

/**
 * Share a card as an image to social media
 * This captures the ShareableCard component as an image and shares it
 */
export async function shareCardImage(
  viewRef: RefObject<any>,
  card: Card
): Promise<boolean> {
  try {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (!viewRef.current) {
      console.error("View ref not available");
      return shareCardText(card);
    }

    // Capture the view as an image
    const uri = await captureRef(viewRef, {
      format: "png",
      quality: 1,
      width: 1080,
      height: 1080,
    });

    // Share the image
    if (Platform.OS === "web") {
      // Web fallback to text sharing
      return shareCardText(card);
    }

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return shareCardText(card);
    }

    await Sharing.shareAsync(uri, {
      mimeType: "image/png",
      dialogTitle: `Today's FiftyAF Minute Moment: ${card.title}`,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    return true;
  } catch (error) {
    console.error("Error sharing card image:", error);
    // Fallback to text sharing
    return shareCardText(card);
  }
}

/**
 * Share a card as text (fallback method)
 */
export async function shareCardText(card: Card): Promise<boolean> {
  try {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const message = `Today's FiftyAF Minute Moment:\n\n${card.title.toUpperCase()}\n${card.domain}\n\n#FiftyAF #DailyReflection #BeKindAndCurious`;

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
 * Legacy function for backward compatibility
 */
export async function shareCard(card: Card): Promise<boolean> {
  return shareCardText(card);
}

/**
 * Get shareable text for a card
 */
export function getShareableText(card: Card): string {
  return `Today's FiftyAF Minute Moment:\n\n${card.title.toUpperCase()}\n${card.domain}\n\n#FiftyAF #DailyReflection #BeKindAndCurious`;
}
