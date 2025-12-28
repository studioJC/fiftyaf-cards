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
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import {
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  type JournalEntry,
} from "@/lib/journal-storage";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function JournalEntryDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [reflection, setReflection] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadEntry();
    }
  }, [id]);

  async function loadEntry() {
    try {
      const journalEntry = await getJournalEntry(id!);
      if (journalEntry) {
        setEntry(journalEntry);
        setReflection(journalEntry.reflection);
      }
    } catch (error) {
      console.error("Error loading journal entry:", error);
    }
  }

  async function handleSave() {
    if (!entry) return;

    if (reflection.trim().length === 0) {
      Alert.alert("Empty Reflection", "Please write something before saving.", [{ text: "OK" }]);
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setSaving(true);
    try {
      const updated = await updateJournalEntry(entry.id, reflection.trim());
      if (updated) {
        setEntry(updated);
        setIsEditing(false);
        
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.error("Error updating journal entry:", error);
      Alert.alert("Update Failed", "There was an error updating your entry. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsEditing(true);
  }

  function handleCancelEdit() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (entry && reflection !== entry.reflection) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved changes. Are you sure you want to cancel?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              setReflection(entry.reflection);
              setIsEditing(false);
            },
          },
        ]
      );
    } else {
      setIsEditing(false);
    }
  }

  async function handleDelete() {
    if (!entry) return;

    Alert.alert("Delete Entry?", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }

          const success = await deleteJournalEntry(entry.id);
          if (success) {
            router.back();
          }
        },
      },
    ]);
  }

  function handleBack() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  if (!entry) {
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
              onPress={isEditing ? handleCancelEdit : handleBack}
              className="flex-row items-center gap-2 active:opacity-70"
            >
              <IconSymbol name="chevron.left" size={20} color={colors.primary} />
              <Text className="text-primary font-medium">{isEditing ? "Cancel" : "Back"}</Text>
            </TouchableOpacity>

            {isEditing ? (
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
            ) : (
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleEdit}
                  className="bg-surface rounded-full py-2 px-4 active:opacity-70"
                >
                  <Text className="text-foreground font-medium">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDelete}
                  className="bg-surface rounded-full py-2 px-4 active:opacity-70"
                >
                  <Text className="text-error font-medium">Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Content */}
          <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
            <View className="gap-4">
              {/* Card Info */}
              <View className="bg-surface rounded-xl p-4">
                <Text className="text-xl font-bold text-foreground mb-1">{entry.cardTitle}</Text>
                <Text className="text-sm text-muted">{formatDate(entry.date)}</Text>
              </View>

              {/* Reflection */}
              {isEditing ? (
                <View>
                  <Text className="text-sm font-medium text-foreground mb-2">Your Reflection</Text>
                  <TextInput
                    value={reflection}
                    onChangeText={setReflection}
                    placeholder="Write your reflection..."
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
              ) : (
                <View className="bg-surface rounded-xl p-4">
                  <Text className="text-base text-foreground leading-relaxed">
                    {entry.reflection}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
