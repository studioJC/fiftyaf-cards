import { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, TouchableOpacity, Image, ActivityIndicator, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { getCardById, type Card } from "@/constants/cards";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { shareCardImage } from "@/lib/social-share";
import { ShareableCard } from "@/components/shareable-card";

export default function CardDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const shareableCardRef = useRef(null);

  const player = useAudioPlayer(card?.audio);

  useEffect(() => {
    if (id) {
      const cardData = getCardById(parseInt(id));
      setCard(cardData || null);
    }
    setupAudio();
  }, [id]);

  // Track player state
  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      setIsPlaying(player.playing);
    }, 100);

    return () => clearInterval(interval);
  }, [player]);

  async function setupAudio() {
    try {
      await setAudioModeAsync({ playsInSilentMode: true });
    } catch (error) {
      console.error("Error setting audio mode:", error);
    }
  }

  function handlePlayPause() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (!player) return;

    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  }

  function handleBack() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  }

  if (!card) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1">
          {/* Back Button */}
          <View className="px-6 pt-4 pb-2">
            <TouchableOpacity
              onPress={handleBack}
              className="flex-row items-center gap-2 active:opacity-70"
            >
              <IconSymbol name="chevron.left" size={20} color={colors.primary} />
              <Text className="text-primary font-medium">Back</Text>
            </TouchableOpacity>
          </View>

          {/* Card Image */}
          <View className="w-full aspect-video px-6 py-4">
            <View
              className="w-full h-full rounded-2xl overflow-hidden bg-surface"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Image
                source={card.image}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Card Info */}
          <View className="px-6 gap-6">
            {/* Title & Domain */}
            <View className="items-center gap-1">
              <Text className="text-3xl font-bold text-foreground tracking-wide text-center">
                {card.title.toUpperCase()}
              </Text>
              <Text className="text-sm text-muted">{card.domain}</Text>
            </View>

            {/* Summary */}
            <View className="bg-surface rounded-2xl p-6 shadow-sm">
              <Text className="text-base text-foreground leading-relaxed">{card.summary}</Text>
            </View>

            {/* Audio Player */}
            <View className="gap-4">
              <TouchableOpacity
                onPress={handlePlayPause}
                className="bg-primary rounded-full py-4 px-8 items-center active:opacity-80"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center gap-2">
                  <IconSymbol
                    name={isPlaying ? "pause.fill" : "play.fill"}
                    size={24}
                    color="#FFFFFF"
                  />
                  <Text className="text-white font-semibold text-lg">
                    {isPlaying ? "Pause Insight" : "Play Insight"}
                  </Text>
                </View>
              </TouchableOpacity>

              <Text className="text-xs text-muted text-center">
                ~77 seconds • Ends with &quot;Be Kind &amp; Curious&quot;
              </Text>
            </View>

            {/* Share Button */}
            <TouchableOpacity
              onPress={() => shareCardImage(shareableCardRef, card)}
              className="border-2 border-primary rounded-full py-3 px-6 items-center active:opacity-70"
            >
              <Text className="text-primary font-semibold">Share This Card</Text>
            </TouchableOpacity>

            {/* Spacer */}
            <View className="h-8" />
          </View>
        </View>
      </ScrollView>

      {/* Hidden ShareableCard for image capture */}
      <View style={{ position: "absolute", left: -10000, top: -10000 }}>
        <View ref={shareableCardRef}>
          {card && <ShareableCard card={card} />}
        </View>
      </View>
    </ScreenContainer>
  );
}
