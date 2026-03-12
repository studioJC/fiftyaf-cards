import { useState } from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { CARDS, getRandomCard, type Card } from "@/constants/cards";
import { drawNewCard } from "@/lib/card-storage";
import { useColors } from "@/hooks/use-colors";

export default function ShuffleScreen() {
  const colors = useColors();
  const router = useRouter();
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Animation values
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  async function handleShuffle() {
    if (isShuffling) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsShuffling(true);
    setShowResult(false);

    // Shuffle animation
    rotation.value = withSequence(
      withTiming(360, { duration: 300 }),
      withTiming(720, { duration: 300 }),
      withTiming(1080, { duration: 300 })
    );

    scale.value = withSequence(
      withSpring(1.1, { damping: 10 }),
      withSpring(0.95, { damping: 10 }),
      withSpring(1.05, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );

    // Wait for animation to complete
    setTimeout(async () => {
      const newCard = await drawNewCard();
      setSelectedCard(newCard);
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Reveal animation
      opacity.value = withSequence(withTiming(0, { duration: 200 }), withTiming(1, { duration: 300 }));

      setTimeout(() => {
        setShowResult(true);
        setIsShuffling(false);
      }, 500);
    }, 900);
  }

  function handleViewCard() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/" as any);
  }

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center p-6 gap-8">
        {/* Title */}
        <View className="items-center gap-2">
          <Text className="text-3xl font-bold text-foreground">Draw a Card</Text>
          <Text className="text-sm text-muted text-center">
            {showResult
              ? "Your new card has been drawn"
              : "Shuffle the deck to draw a new card for today"}
          </Text>
        </View>

        {/* Card Display */}
        <Animated.View style={[animatedStyle, { width: "100%", maxWidth: 400 }]}>
          {selectedCard && showResult ? (
            <View className="w-full aspect-video rounded-2xl overflow-hidden bg-surface shadow-lg">
              <Image
                source={selectedCard.image}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View
              className="w-full aspect-video rounded-2xl items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <View className="items-center gap-4">
                <View
                  className="w-32 h-32 rounded-full items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <Text className="text-6xl">🎴</Text>
                </View>
                <Text className="text-white font-semibold text-lg">Ready to Shuffle</Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Card Info */}
        {selectedCard && showResult && (
          <View className="items-center gap-2">
            <Text className="text-2xl font-bold text-foreground">{selectedCard.title}</Text>
            <Text className="text-sm text-muted">{selectedCard.domain}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="w-full gap-4">
          {!showResult ? (
            <TouchableOpacity
              onPress={handleShuffle}
              disabled={isShuffling}
              className="bg-primary rounded-full py-4 px-8 items-center active:opacity-80"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                opacity: isShuffling ? 0.6 : 1,
              }}
            >
              <Text className="text-white font-semibold text-lg">
                {isShuffling ? "Shuffling..." : "Shuffle Deck"}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleViewCard}
                className="bg-primary rounded-full py-4 px-8 items-center active:opacity-80"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text className="text-white font-semibold text-lg">View Today&apos;s Card</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShuffle}
                className="border-2 border-primary rounded-full py-3 px-6 items-center active:opacity-70"
              >
                <Text className="text-primary font-semibold">Shuffle Again</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}
