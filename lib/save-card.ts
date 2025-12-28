// import * as MediaLibrary from "expo-media-library";
// import * as FileSystem from "expo-file-system/legacy";
import { Platform, Alert } from "react-native";
import { Card } from "@/constants/cards";

/**
 * Save a card image to the device's camera roll
 * Note: This feature requires expo-media-library package to be installed
 * Run: pnpm add expo-media-library
 */
export async function saveCardToPhotos(card: Card): Promise<boolean> {
  try {
    if (Platform.OS === "web") {
      Alert.alert("Feature Not Available", "Saving to photos is not supported on web.");
      return false;
    }

    // TODO: Implement after expo-media-library is properly installed
    Alert.alert(
      "Coming Soon",
      "Save to photos feature will be available in the next update.",
      [{ text: "OK" }]
    );
    return false;

    /* Uncomment after expo-media-library is installed:
    
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant photo library access to save cards to your camera roll.",
        [{ text: "OK" }]
      );
      return false;
    }

    const imageUri = card.image;
    const asset = await MediaLibrary.createAssetAsync(imageUri);
    
    const album = await MediaLibrary.getAlbumAsync("Reinvention Cards");
    if (album === null) {
      await MediaLibrary.createAlbumAsync("Reinvention Cards", asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    Alert.alert(
      "Card Saved!",
      `"${card.title}" has been saved to your Photos in the Reinvention Cards album.`,
      [{ text: "OK" }]
    );

    return true;
    */
  } catch (error) {
    console.error("Error saving card to photos:", error);
    Alert.alert(
      "Save Failed",
      "There was an error saving the card. Please try again.",
      [{ text: "OK" }]
    );
    return false;
  }
}
