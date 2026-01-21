import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { getTodaysCard } from "@/lib/card-storage";
import { createJournalEntry } from "@/lib/journal-storage";
import { type Card } from "@/constants/cards";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trackJournalEntryCreated } from "@/lib/analytics";

export default function NewJournalEntryScreen() {
  const colors = useColors();
  const router = useRouter();
  const [card, setCard] = useState<Card | null>(null);
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTodaysCard();
  }, []);

  async function loadTodaysCard() {
    try {
      const result = await getTodaysCard();
      setCard(result.card);
    } catch (error) {
      console.error("Error loading today's card:", error);
    }
  }

  async function handleSave() {
    if (!card) return;

    if (reflection.trim().length === 0) {
      Alert.alert("Empty Reflection", "Please write something before saving.", [{ text: "OK" }]);
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setSaving(true);
    try {
      await createJournalEntry(card.id, card.title, reflection.trim());
      
      // Track journal entry creation
      trackJournalEntryCreated(card.id, card.title);
      
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      router.back();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      Alert.alert("Save Failed", "There was an error saving your entry. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (reflection.trim().length > 0) {
      Alert.alert(
        "Discard Entry?",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Keep Writing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  }

  if (!card) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-muted">Loading...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1">
          {/* Header */}
          <View className="px-6 pt-4 pb-3 flex-row items-center justify-between border-b border-border">
            <TouchableOpacity
              onPress={handleCancel}
              className="flex-row items-center gap-2 active:opacity-70"
            >
              <IconSymbol name="chevron.left" size={20} color={colors.primary} />
              <Text className="text-primary font-medium">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={saving || reflection.trim().length === 0}
              className="bg-primary rounded-full py-2 px-6 active:opacity-80"
              style={{
                opacity: saving || reflection.trim().length === 0 ? 0.5 : 1,
              }}
            >
              <Text className="text-white font-semibold">
                {saving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
            <View className="gap-4">
              {/* Card Info */}
              <View className="bg-surface rounded-xl p-4">
                <Text className="text-xs text-muted uppercase tracking-wide mb-1">
                  Reflecting on
                </Text>
                <Text className="text-xl font-bold text-foreground">{card.title}</Text>
                <Text className="text-sm text-muted mt-1">{card.domain}</Text>
              </View>

              {/* Reflection Input */}
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">Your Reflection</Text>
                <TextInput
                  value={reflection}
                  onChangeText={setReflection}
                  placeholder="What insights did this card bring you today? How does it relate to your current journey?"
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={12}
                  textAlignVertical="top"
                  returnKeyType="default"
                  className="bg-surface rounded-xl p-4 text-foreground min-h-[200px]"
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                  }}
                />
              </View>

              {/* Tips */}
              <View className="bg-surface rounded-xl p-4">
                <Text className="text-xs font-semibold text-foreground mb-2">
                  Journaling Tips
                </Text>
                <Text className="text-xs text-muted leading-relaxed">
                  • Be honest and authentic with yourself{"\n"}
                  • Focus on feelings, not just events{"\n"}
                  • Ask yourself: "What can I learn from this?"{"\n"}
                  • Remember: Be Kind & Curious
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
