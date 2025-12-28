import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { getSubscriptionStatus, getTrialDaysRemaining } from "@/lib/subscription";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

const NOTIFICATION_SETTINGS_KEY = "@reinvention_cards:notification_settings";

interface NotificationSettings {
  enabled: boolean;
  hour: number; // 0-23
  minute: number; // 0-59
}

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: false,
    hour: 9,
    minute: 0,
  });
  const [trialDays, setTrialDays] = useState(0);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    loadSettings();
    loadSubscriptionInfo();
  }, []);

  async function loadSettings() {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (stored) {
        setNotificationSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  }

  async function loadSubscriptionInfo() {
    const status = await getSubscriptionStatus();
    const days = await getTrialDaysRemaining();
    
    setHasSubscription(status.hasCompletedPayment);
    setTrialDays(days);
  }

  async function saveSettings(settings: NotificationSettings) {
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
      setNotificationSettings(settings);
    } catch (error) {
      console.error("Error saving notification settings:", error);
    }
  }

  async function handleToggleNotifications(value: boolean) {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (value) {
      // Request permission
      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your device settings to receive daily reminders.",
          [{ text: "OK" }]
        );
        return;
      }

      // Schedule notification
      await scheduleNotification(notificationSettings.hour, notificationSettings.minute);
    } else {
      // Cancel all notifications
      await Notifications.cancelAllScheduledNotificationsAsync();
    }

    await saveSettings({ ...notificationSettings, enabled: value });
  }

  async function scheduleNotification(hour: number, minute: number) {
    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule daily notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Your Daily Card Awaits 🎴",
        body: "Take a moment for reflection. Draw your card for today.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  }

  function handleManageSubscription() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/paywall" as any);
  }

  function formatTime(hour: number, minute: number): string {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    const displayMinute = minute.toString().padStart(2, "0");
    return `${displayHour}:${displayMinute} ${period}`;
  }

  return (
    <ScreenContainer>
      <ScrollView className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">Settings</Text>
          </View>

          {/* Subscription Section */}
          <View className="bg-surface rounded-2xl p-4 gap-3">
            <Text className="text-lg font-semibold text-foreground">Subscription</Text>
            
            {hasSubscription ? (
              <View>
                <Text className="text-foreground">✓ Active Subscription</Text>
                <Text className="text-sm text-muted mt-1">99¢ per week</Text>
              </View>
            ) : trialDays > 0 ? (
              <View>
                <Text className="text-foreground">Free Trial Active</Text>
                <Text className="text-sm text-muted mt-1">
                  {trialDays} {trialDays === 1 ? "day" : "days"} remaining
                </Text>
              </View>
            ) : (
              <View>
                <Text className="text-foreground">Trial Expired</Text>
                <Text className="text-sm text-muted mt-1">Subscribe to continue using the app</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleManageSubscription}
              className="bg-primary rounded-full py-3 px-6 items-center active:opacity-80 mt-2"
            >
              <Text className="text-white font-semibold">
                {hasSubscription ? "Manage Subscription" : "Subscribe Now"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notifications Section */}
          <View className="bg-surface rounded-2xl p-4 gap-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">Daily Reminders</Text>
                <Text className="text-sm text-muted mt-1">
                  Get notified to draw your daily card
                </Text>
              </View>
              <Switch
                value={notificationSettings.enabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            {notificationSettings.enabled && (
              <View className="border-t border-border pt-4">
                <Text className="text-sm font-medium text-foreground mb-2">Reminder Time</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {formatTime(notificationSettings.hour, notificationSettings.minute)}
                </Text>
                <Text className="text-xs text-muted mt-2">
                  Tap to change time (coming soon)
                </Text>
              </View>
            )}
          </View>

          {/* App Info */}
          <View className="bg-surface rounded-2xl p-4 gap-2">
            <Text className="text-lg font-semibold text-foreground">About</Text>
            <Text className="text-sm text-muted">Reinvention Cards</Text>
            <Text className="text-sm text-muted">Version 1.0.0</Text>
            <Text className="text-xs text-muted mt-2">
              Daily reflection cards for personal growth and mindfulness.
            </Text>
          </View>

          {/* Spacer */}
          <View className="h-8" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
