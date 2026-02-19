import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform, Linking } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { getSubscriptionStatus, getTrialDaysRemaining, type SubscriptionStatus } from "@/lib/subscription";
import { useColors } from "@/hooks/use-colors";

const REVOLUT_WEEKLY_LINK = "https://checkout.revolut.com/pay/b77a8136-7bc0-4176-a6ad-7430f9b3f6e3";
const REVOLUT_ANNUAL_LINK = ""; // TODO: Add annual payment link when provided by user

type PricingOption = "weekly" | "annual";

export default function PaywallScreen() {
  const colors = useColors();
  const router = useRouter();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<PricingOption>("weekly");

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

    const paymentLink = selectedPlan === "weekly" ? REVOLUT_WEEKLY_LINK : REVOLUT_ANNUAL_LINK;

    if (!paymentLink) {
      console.error("Payment link not configured for selected plan");
      return;
    }

    try {
      const supported = await Linking.canOpenURL(paymentLink);
      
      if (supported) {
        await Linking.openURL(paymentLink);
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

  function handleSelectPlan(plan: PricingOption) {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPlan(plan);
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

        {/* Pricing Options */}
        <View className="w-full max-w-sm gap-3">
          {/* Weekly Option */}
          <TouchableOpacity
            onPress={() => handleSelectPlan("weekly")}
            className="rounded-2xl p-4 border-2"
            style={{
              backgroundColor: selectedPlan === "weekly" ? colors.primary + "20" : colors.surface,
              borderColor: selectedPlan === "weekly" ? colors.primary : colors.border,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">Weekly</Text>
                <Text className="text-sm text-muted">Flexible, cancel anytime</Text>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-bold text-foreground">99¢</Text>
                <Text className="text-xs text-muted">per week</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Annual Option */}
          <TouchableOpacity
            onPress={() => handleSelectPlan("annual")}
            className="rounded-2xl p-4 border-2"
            style={{
              backgroundColor: selectedPlan === "annual" ? colors.primary + "20" : colors.surface,
              borderColor: selectedPlan === "annual" ? colors.primary : colors.border,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">Annual</Text>
                <Text className="text-sm text-muted">Best value - save 6%</Text>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-bold text-foreground">$49</Text>
                <Text className="text-xs text-muted">per year</Text>
              </View>
            </View>
          </TouchableOpacity>
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
              <Text className="text-white font-semibold text-lg">
                Subscribe {selectedPlan === "weekly" ? "Weekly" : "Annually"}
              </Text>
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
