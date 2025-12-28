import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform, Linking } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { getSubscriptionStatus, getTrialDaysRemaining, type SubscriptionStatus } from "@/lib/subscription";
import { useColors } from "@/hooks/use-colors";

const REVOLUT_PAYMENT_LINK = "https://checkout.revolut.com/pay/b77a8136-7bc0-4176-a6ad-7430f9b3f6e3";

export default function PaywallScreen() {
  const colors = useColors();
  const router = useRouter();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    const subscriptionStatus = await getSubscriptionStatus();
    const days = await getTrialDaysRemaining();
    
    setStatus(subscriptionStatus);
    setDaysRemaining(days);

    // If user has access, redirect to home
    if (subscriptionStatus.isActive) {
      router.replace("/" as any);
    }
  }

  async function handleSubscribe() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      const supported = await Linking.canOpenURL(REVOLUT_PAYMENT_LINK);
      
      if (supported) {
        await Linking.openURL(REVOLUT_PAYMENT_LINK);
      } else {
        console.error("Cannot open payment link");
      }
    } catch (error) {
      console.error("Error opening payment link:", error);
    }
  }

  function handleRestore() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Reload status to check if payment was completed
    loadStatus();
  }

  if (!status) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-muted">Loading...</Text>
      </ScreenContainer>
    );
  }

  const isTrialActive = status.isTrialActive && daysRemaining > 0;

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center p-6 gap-8">
        {/* Icon */}
        <View
          className="w-32 h-32 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-6xl">🎴</Text>
        </View>

        {/* Title */}
        <View className="items-center gap-2">
          <Text className="text-3xl font-bold text-foreground text-center">
            {isTrialActive ? "Free Trial Active" : "Subscribe to Continue"}
          </Text>
          {isTrialActive ? (
            <Text className="text-base text-muted text-center">
              {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining in your free trial
            </Text>
          ) : (
            <Text className="text-base text-muted text-center">
              Your free trial has ended
            </Text>
          )}
        </View>

        {/* Features */}
        <View className="w-full max-w-sm bg-surface rounded-2xl p-6 gap-4">
          <Text className="text-lg font-semibold text-foreground mb-2">What You Get:</Text>
          
          <View className="flex-row gap-3">
            <Text className="text-primary text-xl">✓</Text>
            <Text className="text-foreground flex-1">Daily reflection cards with audio insights</Text>
          </View>

          <View className="flex-row gap-3">
            <Text className="text-primary text-xl">✓</Text>
            <Text className="text-foreground flex-1">21 beautifully designed cards</Text>
          </View>

          <View className="flex-row gap-3">
            <Text className="text-primary text-xl">✓</Text>
            <Text className="text-foreground flex-1">Personal reflection journal</Text>
          </View>

          <View className="flex-row gap-3">
            <Text className="text-primary text-xl">✓</Text>
            <Text className="text-foreground flex-1">Save cards to your photos</Text>
          </View>

          <View className="flex-row gap-3">
            <Text className="text-primary text-xl">✓</Text>
            <Text className="text-foreground flex-1">Daily reminders for mindful practice</Text>
          </View>
        </View>

        {/* Pricing */}
        <View className="items-center gap-2">
          <Text className="text-4xl font-bold text-foreground">99¢</Text>
          <Text className="text-sm text-muted">per week</Text>
          {isTrialActive && (
            <Text className="text-xs text-muted">Cancel anytime during trial</Text>
          )}
        </View>

        {/* Subscribe Button */}
        {!isTrialActive && (
          <View className="w-full gap-3">
            <TouchableOpacity
              onPress={handleSubscribe}
              className="bg-primary rounded-full py-4 px-8 items-center active:opacity-80"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text className="text-white font-semibold text-lg">Subscribe Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRestore}
              className="items-center py-2 active:opacity-70"
            >
              <Text className="text-muted text-sm">Already subscribed? Tap to restore</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Trial Info */}
        {isTrialActive && (
          <Text className="text-xs text-muted text-center max-w-sm">
            You can continue using the app for free during your trial period. Subscribe anytime to keep access after your trial ends.
          </Text>
        )}
      </View>
    </ScreenContainer>
  );
}
