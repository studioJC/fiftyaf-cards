import { useState, useCallback } from "react";
import { ScrollView, Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { CARDS, DOMAINS, type CardDomain } from "@/constants/cards";
import { getFavorites } from "@/lib/favorites";
import { useColors } from "@/hooks/use-colors";

export default function LibraryScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState<CardDomain | "All" | "Favorites">("All");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  async function loadFavorites() {
    const favorites = await getFavorites();
    setFavoriteIds(favorites);
  }

  const filteredCards =
    selectedDomain === "All"
      ? CARDS
      : selectedDomain === "Favorites"
      ? CARDS.filter((card) => favoriteIds.includes(card.id))
      : CARDS.filter((card) => card.domain === selectedDomain);

  function handleCardPress(cardId: number) {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({ pathname: "/card/[id]" as any, params: { id: cardId.toString() } });
  }

  function handleDomainPress(domain: CardDomain | "All" | "Favorites") {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedDomain(domain);
  }

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Card Library</Text>
          <Text className="text-sm text-muted mt-1">Explore all 21 cards</Text>
        </View>

        {/* Domain Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 pb-4"
          contentContainerStyle={{ gap: 8 }}
        >
          <TouchableOpacity
            onPress={() => handleDomainPress("All")}
            className={`px-4 py-2 rounded-full ${
              selectedDomain === "All" ? "bg-primary" : "bg-surface border border-border"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedDomain === "All" ? "text-white" : "text-foreground"
              }`}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDomainPress("Favorites")}
            className={`px-4 py-2 rounded-full ${
              selectedDomain === "Favorites" ? "bg-primary" : "bg-surface border border-border"
            }`}
          >
            <View className="flex-row items-center gap-1">
              <Text className="text-base">{selectedDomain === "Favorites" ? "❤️" : "🤍"}</Text>
              <Text
                className={`text-sm font-medium ${
                  selectedDomain === "Favorites" ? "text-white" : "text-foreground"
                }`}
              >
                Favorites {favoriteIds.length > 0 && `(${favoriteIds.length})`}
              </Text>
            </View>
          </TouchableOpacity>

          {DOMAINS.map((domain) => (
            <TouchableOpacity
              key={domain}
              onPress={() => handleDomainPress(domain)}
              className={`px-4 py-2 rounded-full ${
                selectedDomain === domain ? "bg-primary" : "bg-surface border border-border"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedDomain === domain ? "text-white" : "text-foreground"
                }`}
              >
                {domain}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Card Grid */}
        <FlatList
          data={filteredCards}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 24, gap: 16 }}
          columnWrapperStyle={{ gap: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleCardPress(item.id)}
              className="flex-1 bg-surface rounded-xl overflow-hidden active:opacity-70"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="aspect-video">
                <Image
                  source={item.image}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
              <View className="p-3">
                <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className="text-xs text-muted mt-1" numberOfLines={1}>
                  {item.domain}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenContainer>
  );
}
