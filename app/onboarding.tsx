import { View, Text, TouchableOpacity, ScrollView, Platform, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useRef } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trackOnboardingCompleted, trackTrialStarted } from "@/lib/analytics";

const ONBOARDING_KEY = "@fiftyaf:onboarding_completed";
const { width } = Dimensions.get("window");

const ONBOARDING_PAGES = [
  {
    id: 1,
    emoji: "🎴",
    title: "Welcome to\nFiftyAF Minute Moment",
    subtitle: "Your daily practice for reflection, growth, and staying sharp",
    content: [
      { icon: "✓", title: "Build self-awareness", text: "through daily reflection" },
      { icon: "✓", title: "Stay mentally sharp", text: "with intentional practice" },
      { icon: "✓", title: "Process emotions", text: "without judgment" },
      { icon: "✓", title: "Create space", text: "for what matters" },
    ],
  },
  {
    id: 2,
    emoji: "📝",
    title: "Journaling Tips",
    subtitle: "Make the most of your reflection practice",
    content: [
      {
        title: "Be Honest",
        text: "This is your private space. Write what you really think and feel, not what you think you should say.",
      },
      {
        title: "Focus on Feelings",
        text: "Go beyond describing events. How did something make you feel? What did you learn about yourself?",
      },
      {
        title: "Ask Questions",
        text: '"What can I learn from this?" "How does this relate to my values?" "What would I tell a friend?"',
      },
      {
        title: "No Judgment",
        text: "There's no \"right\" way to journal. Some days you'll write paragraphs, other days a sentence. Both are perfect.",
      },
    ],
  },
  {
    id: 3,
    emoji: "🔥",
    title: "Building Your\nDaily Practice",
    subtitle: "Consistency is the key to transformation",
    content: [
      {
        title: "Same Time, Every Day",
        text: "Pick a consistent time—morning coffee, lunch break, or before bed. Consistency builds the habit.",
      },
      {
        title: "Start Small",
        text: "Just one minute. That's it. Don't pressure yourself to journal every day at first. Draw your card, listen, reflect.",
      },
      {
        title: "Use Reminders",
        text: "Enable daily notifications in Settings to help you remember until it becomes automatic.",
      },
      {
        title: "Be Patient",
        text: "It takes about 66 days to form a habit. Miss a day? No problem. Just pick up tomorrow.",
      },
    ],
  },
  {
    id: 4,
    emoji: "🧭",
    title: "How to Use the App",
    subtitle: "Navigate your journey with ease",
    content: [
      { icon: "🏠", title: "Today", text: "Your daily card with audio insight" },
      { icon: "🔀", title: "Shuffle", text: "Draw a card anytime you need guidance" },
      { icon: "📚", title: "Library", text: "Browse all cards by theme" },
      { icon: "📝", title: "Journal", text: "Write your reflections and track your growth" },
      { icon: "⚙️", title: "Settings", text: "Customize notifications and manage subscription" },
    ],
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  async function handleGetStarted() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Mark onboarding as completed
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    
    // Track onboarding completion and trial start
    trackOnboardingCompleted();
    trackTrialStarted();
    
    // Navigate to main app
    router.replace("/" as any);
  }

  function handleNext() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (currentPage < ONBOARDING_PAGES.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      scrollViewRef.current?.scrollTo({ x: nextPage * width, animated: true });
    }
  }

  function handlePrevious() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      scrollViewRef.current?.scrollTo({ x: prevPage * width, animated: true });
    }
  }

  const isLastPage = currentPage === ONBOARDING_PAGES.length - 1;

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Page Indicator */}
        <View className="flex-row justify-center gap-2 pt-6 pb-4">
          {ONBOARDING_PAGES.map((_, index) => (
            <View
              key={index}
              className="h-2 rounded-full"
              style={{
                width: currentPage === index ? 24 : 8,
                backgroundColor: currentPage === index ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>

        {/* Scrollable Pages */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={{ flex: 1 }}
        >
          {ONBOARDING_PAGES.map((page) => (
            <View key={page.id} style={{ width }} className="flex-1">
              <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
              >
                {/* Header */}
                <View className="items-center gap-4 mb-8">
                  <View
                    className="w-24 h-24 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <Text className="text-5xl">{page.emoji}</Text>
                  </View>
                  <Text className="text-3xl font-bold text-foreground text-center">
                    {page.title}
                  </Text>
                  <Text className="text-base text-muted text-center max-w-sm">
                    {page.subtitle}
                  </Text>
                </View>

                {/* Content */}
                <View className="gap-6">
                  {page.content.map((item, index) => (
                    <View key={index} className="bg-surface rounded-2xl p-5">
                      {('icon' in item) ? (
                        <View className="flex-row items-start gap-3">
                          <Text className="text-xl mt-1">{item.icon}</Text>
                          <View className="flex-1">
                            <Text className="text-foreground font-semibold text-base mb-1">
                              {item.title}
                            </Text>
                            <Text className="text-sm text-muted leading-relaxed">
                              {item.text}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View>
                          <Text className="text-foreground font-semibold text-base mb-2">
                            {item.title}
                          </Text>
                          <Text className="text-sm text-muted leading-relaxed">
                            {item.text}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                {/* Closing Message (Last Page Only) */}
                {isLastPage && (
                  <View className="items-center gap-4 mt-8">
                    <Text className="text-base text-foreground text-center max-w-sm leading-relaxed">
                      Remember: This is your practice, your pace, your journey.
                    </Text>
                    <Text className="text-lg font-semibold" style={{ color: colors.primary }}>
                      Be Kind & Curious
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          ))}
        </ScrollView>

        {/* Navigation Buttons */}
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
          <View className="flex-row gap-3">
            {currentPage > 0 && (
              <TouchableOpacity
                onPress={handlePrevious}
                className="flex-1 border-2 rounded-full py-4 px-6 items-center active:opacity-70"
                style={{ borderColor: colors.primary }}
              >
                <Text className="font-semibold" style={{ color: colors.primary }}>
                  Back
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={isLastPage ? handleGetStarted : handleNext}
              className="flex-1 rounded-full py-4 px-6 items-center active:opacity-80"
              style={{
                backgroundColor: colors.primary,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text className="text-white font-semibold text-base">
                {isLastPage ? "Get Started" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
