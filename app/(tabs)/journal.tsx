import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Platform } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { getJournalEntries, type JournalEntry } from "@/lib/journal-storage";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function JournalScreen() {
  const colors = useColors();
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Reload entries when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  async function loadEntries() {
    setLoading(true);
    try {
      const journalEntries = await getJournalEntries();
      setEntries(journalEntries);
    } catch (error) {
      console.error("Error loading journal entries:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleNewEntry() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({ pathname: "/journal/new" as any });
  }

  function handleEntryPress(entryId: string) {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({ pathname: "/journal/[id]" as any, params: { id: entryId } });
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-foreground">Journal</Text>
            <Text className="text-sm text-muted mt-1">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleNewEntry}
            className="bg-primary rounded-full w-12 h-12 items-center justify-center active:opacity-80"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text className="text-white text-2xl font-light">+</Text>
          </TouchableOpacity>
        </View>

        {/* Entry List */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted">Loading entries...</Text>
          </View>
        ) : entries.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-2xl mb-2">📝</Text>
            <Text className="text-lg font-semibold text-foreground mb-2">No Entries Yet</Text>
            <Text className="text-sm text-muted text-center mb-6">
              Start journaling your reflections on today's cards
            </Text>
            <TouchableOpacity
              onPress={handleNewEntry}
              className="bg-primary rounded-full py-3 px-6 active:opacity-80"
            >
              <Text className="text-white font-semibold">Write First Entry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 24, gap: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleEntryPress(item.id)}
                className="bg-surface rounded-xl p-4 active:opacity-70"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <View className="flex-row items-start justify-between mb-2">
                  <Text className="text-base font-semibold text-foreground flex-1">
                    {item.cardTitle}
                  </Text>
                  <IconSymbol name="chevron.right" size={16} color={colors.muted} />
                </View>
                <Text className="text-xs text-muted mb-2">{formatDate(item.date)}</Text>
                <Text className="text-sm text-foreground leading-relaxed" numberOfLines={3}>
                  {truncateText(item.reflection, 150)}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
