import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

const ONBOARDING_KEY = "@fiftyaf:onboarding_completed";

export default function OnboardingScreen() {
  const colors = useColors();
  const router = useRouter();

  async function handleGetStarted() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Mark onboarding as completed
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    
    // Navigate to main app
    router.replace("/" as any);
  }

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        <View className="gap-8 pb-12">
          {/* Header */}
          <View className="items-center gap-4 pt-8">
            <View
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-5xl">🎴</Text>
            </View>
            <Text className="text-4xl font-bold text-foreground text-center">
              Welcome to{"\n"}FiftyAF Minute Moment
            </Text>
            <Text className="text-base text-muted text-center max-w-sm">
              Your daily practice for reflection, growth, and staying sharp
            </Text>
          </View>

          {/* Benefits Section */}
          <View className="bg-surface rounded-2xl p-6 gap-4">
            <Text className="text-xl font-bold text-foreground">
              Why Take Your Minute Moment?
            </Text>
            
            <View className="gap-3">
              <View className="flex-row gap-3">
                <Text className="text-primary text-xl">✓</Text>
                <Text className="text-foreground flex-1 leading-relaxed">
                  <Text className="font-semibold">Build self-awareness</Text> through daily reflection
                </Text>
              </View>

              <View className="flex-row gap-3">
                <Text className="text-primary text-xl">✓</Text>
                <Text className="text-foreground flex-1 leading-relaxed">
                  <Text className="font-semibold">Stay mentally sharp</Text> with intentional practice
                </Text>
              </View>

              <View className="flex-row gap-3">
                <Text className="text-primary text-xl">✓</Text>
                <Text className="text-foreground flex-1 leading-relaxed">
                  <Text className="font-semibold">Process emotions</Text> without judgment
                </Text>
              </View>

              <View className="flex-row gap-3">
                <Text className="text-primary text-xl">✓</Text>
                <Text className="text-foreground flex-1 leading-relaxed">
                  <Text className="font-semibold">Create space</Text> for what matters
                </Text>
              </View>
            </View>
          </View>

          {/* Journaling Tips */}
          <View className="bg-surface rounded-2xl p-6 gap-4">
            <Text className="text-xl font-bold text-foreground">
              Journaling Tips
            </Text>
            
            <View className="gap-3">
              <View>
                <Text className="text-foreground font-semibold mb-1">Be Honest</Text>
                <Text className="text-sm text-muted leading-relaxed">
                  This is your private space. Write what you really think and feel, not what you think you should say.
                </Text>
              </View>

              <View>
                <Text className="text-foreground font-semibold mb-1">Focus on Feelings</Text>
                <Text className="text-sm text-muted leading-relaxed">
                  Go beyond describing events. How did something make you feel? What did you learn about yourself?
                </Text>
              </View>

              <View>
                <Text className="text-foreground font-semibold mb-1">Ask Questions</Text>
                <Text className="text-sm text-muted leading-relaxed">
                  "What can I learn from this?" "How does this relate to my values?" "What would I tell a friend?"
                </Text>
              </View>

              <View>
                <Text className="text-foreground font-semibold mb-1">No Judgment</Text>
                <Text className="text-sm text-muted leading-relaxed">
                  There's no "right" way to journal. Some days you'll write paragraphs, other days a sentence. Both are perfect.
                </Text>
              </View>
            </View>
          </View>

          {/* Habit Formation */}
          <View className="bg-surface rounded-2xl p-6 gap-4">
            <Text className="text-xl font-bold text-foreground">
              Building Your Daily Practice
            </Text>
            
            <View className="gap-3">
              <View>
                <Text className="text-foreground font-semibold mb-1">Same Time, Every Day</Text>
                <Text className="text-sm text-muted leading-relaxed">
                  Pick a consistent time—morning coffee, lunch break, or before bed. Consistency builds the habit.
                </Text>
              </View>

              <View>
                <Text className="text-foreground font-semibold mb-1">Start Small</Text>
                <Text className="text-sm text-muted leading-relaxed">
                  Just one minute. That's it. Don't pressure yourself to journal every day at first. Draw your card, listen, reflect.
                </Text>
              </View>

              <View>
                <Text className="text-foreground font-semibold mb-1">Use Reminders</Text>
                <Text className="text-sm text-muted leading-relaxed">
                  Enable daily notifications in Settings to help you remember until it becomes automatic.
                </Text>
              </View>

              <View>
                <Text className="text-foreground font-semibold mb-1">Be Patient</Text>
                <Text className="text-sm text-muted leading-relaxed">
                  It takes about 66 days to form a habit. Miss a day? No problem. Just pick up tomorrow.
                </Text>
              </View>
            </View>
          </View>

          {/* How to Use */}
          <View className="bg-surface rounded-2xl p-6 gap-4">
            <Text className="text-xl font-bold text-foreground">
              How to Use the App
            </Text>
            
            <View className="gap-3">
              <View className="flex-row gap-3">
                <Text className="text-2xl">🏠</Text>
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Today</Text>
                  <Text className="text-sm text-muted">Your daily card with audio insight</Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <Text className="text-2xl">🔀</Text>
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Shuffle</Text>
                  <Text className="text-sm text-muted">Draw a card anytime you need guidance</Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <Text className="text-2xl">📚</Text>
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Library</Text>
                  <Text className="text-sm text-muted">Browse all cards by theme</Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <Text className="text-2xl">📝</Text>
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Journal</Text>
                  <Text className="text-sm text-muted">Write your reflections and track your growth</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Closing Message */}
          <View className="items-center gap-4 pt-4">
            <Text className="text-base text-foreground text-center max-w-sm leading-relaxed">
              Remember: This is your practice, your pace, your journey.
            </Text>
            <Text className="text-lg font-semibold text-primary">
              Be Kind & Curious
            </Text>
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            onPress={handleGetStarted}
            className="bg-primary rounded-full py-4 px-8 items-center active:opacity-80 mt-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text className="text-white font-semibold text-lg">Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
    return completed === "true";
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}
