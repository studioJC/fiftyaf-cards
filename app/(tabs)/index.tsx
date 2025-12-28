import { useState, useEffect, useCallback } from "react";
import { ScrollView, Text, View, TouchableOpacity, Image, ActivityIndicator, Platform, Alert } from "react-native";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { Card } from "@/constants/cards";
import { getTodaysCard, drawNewCard } from "@/lib/card-storage";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { getStreakData, recordTodaysVisit, getStreakMilestoneMessage, type StreakData } from "@/lib/streak-tracking";
import { shareCard } from "@/lib/social-share";

export default function TodayScreen() {
  const colors = useColors();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewCard, setIsNewCard] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  
  const player = useAudioPlayer(card?.audio);

  // Load today's card on mount
  useEffect(() => {
    loadTodaysCard();
    setupAudio();
    loadStreak();
  }, []);

  // Reload streak when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadStreak();
    }, [])
  );

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

  async function loadTodaysCard() {
    setLoading(true);
    try {
      const result = await getTodaysCard();
      setCard(result.card);
      setIsNewCard(result.isNew);
    } catch (error) {
      console.error("Error loading today's card:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadStreak() {
    try {
      const data = await recordTodaysVisit();
      setStreakData(data);
      
      // Show milestone message if reached
      const milestone = getStreakMilestoneMessage(data.currentStreak);
      if (milestone && data.currentStreak > 1) {
        setTimeout(() => {
          Alert.alert("Streak Milestone!", milestone, [{ text: "Keep Going!" }]);
        }, 500);
      }
    } catch (error) {
      console.error("Error loading streak:", error);
    }
  }

  async function handleDrawNewCard() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setLoading(true);
    try {
      const newCard = await drawNewCard();
      setCard(newCard);
      setIsNewCard(true);
      
      // Stop current audio if playing
      if (player && player.playing) {
        player.pause();
      }
    } catch (error) {
      console.error("Error drawing new card:", error);
    } finally {
      setLoading(false);
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

  if (loading || !card) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-muted">Drawing your card...</Text>
      </ScreenContainer>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-6">
          {/* Header with Streak */}
          <View className="items-center gap-3">
            <View className="items-center gap-1">
              <Text className="text-sm text-muted uppercase tracking-wide">
                {isNewCard ? "Today's Card" : "Your Card for Today"}
              </Text>
              <Text className="text-xs text-muted">{today}</Text>
            </View>
            
            {/* Streak Counter */}
            {streakData && streakData.currentStreak > 0 && (
              <View className="bg-surface rounded-full px-6 py-3 flex-row items-center gap-2">
                <Text className="text-2xl">🔥</Text>
                <View>
                  <Text className="text-lg font-bold text-foreground">
                    {streakData.currentStreak} {streakData.currentStreak === 1 ? "Day" : "Days"}
                  </Text>
                  <Text className="text-xs text-muted">Current Streak</Text>
                </View>
              </View>
            )}
          </View>

          {/* Card Image */}
          <View className="w-full aspect-video rounded-2xl overflow-hidden bg-surface shadow-lg">
            <Image
              source={card.image}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>

          {/* Card Title & Domain */}
          <View className="items-center gap-1">
            <Text className="text-3xl font-bold text-foreground tracking-wide">
              {card.title.toUpperCase()}
            </Text>
            <Text className="text-sm text-muted">{card.domain}</Text>
          </View>

          {/* Audio Player */}
          <View className="bg-surface rounded-2xl p-6 gap-4 shadow-sm">
            <Text className="text-base text-foreground text-center leading-relaxed">
              {card.summary}
            </Text>

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
              ~77 seconds • Ends with "Be Kind & Curious"
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => shareCard(card)}
              className="flex-1 border-2 border-primary rounded-full py-3 px-6 items-center active:opacity-70"
            >
              <Text className="text-primary font-semibold">Share Card</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleDrawNewCard}
              className="flex-1 bg-primary rounded-full py-3 px-6 items-center active:opacity-80"
            >
              <Text className="text-white font-semibold">Draw New</Text>
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View className="h-8" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
