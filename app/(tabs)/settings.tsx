import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch, ScrollView, Platform, Alert, Modal } from "react-native";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ScreenContainer } from "@/components/screen-container";
import { getSubscriptionStatus, getTrialDaysRemaining } from "@/lib/subscription";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { trackNotificationScheduled } from "@/lib/analytics";
import { getReferralStats, type ReferralStats } from "@/lib/referral";
import { Share } from "react-native";

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
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);

  useEffect(() => {
    loadSettings();
    loadSubscriptionInfo();
    loadReferralStats();
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

  async function loadReferralStats() {
    try {
      const stats = await getReferralStats();
      setReferralStats(stats);
    } catch (error) {
      console.error("Error loading referral stats:", error);
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

          {/* Referral Section (Subscribers Only) */}
          {hasSubscription && referralStats && (
            <View className="bg-surface rounded-2xl p-4 gap-4">
              <Text className="text-lg font-semibold text-foreground">Invite Friends</Text>
              
              <View className="gap-3">
                <View className="flex-row items-center justify-between py-2">
                  <Text className="text-sm text-muted">Your Referral Code</Text>
                  <Text className="text-xl font-bold text-primary">{referralStats.myCode}</Text>
                </View>
                
                <View className="flex-row items-center justify-between py-2">
                  <Text className="text-sm text-muted">Friends Joined</Text>
                  <Text className="text-lg font-semibold text-foreground">{referralStats.subscribedReferrals}</Text>
                </View>
                
                <View className="flex-row items-center justify-between py-2">
                  <Text className="text-sm text-muted">Free Weeks Earned</Text>
                  <Text className="text-lg font-semibold text-foreground">{referralStats.freeWeeksEarned}</Text>
                </View>
                
                {referralStats.currentMonthReferrals > 0 && (
                  <View className="flex-row items-center justify-between py-2">
                    <Text className="text-sm text-muted">This Month</Text>
                    <Text className="text-lg font-semibold text-foreground">
                      {referralStats.currentMonthReferrals}/3 {referralStats.currentMonthReferrals >= 3 ? "🎉" : ""}
                    </Text>
                  </View>
                )}
              </View>
              
              <View className="bg-primary/10 rounded-xl p-3">
                <Text className="text-xs text-foreground leading-relaxed">
                  • 1 friend subscribes = 1 free week{"\n"}
                  • 3 friends in a month = 1 free month bonus
                </Text>
              </View>
            </View>
          )}

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
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  className="mt-3 bg-primary/10 rounded-full py-2 px-4 self-start active:opacity-70"
                >
                  <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                    Change Time
                  </Text>
                </TouchableOpacity>
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

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="bg-background rounded-3xl p-6 mx-6 w-80" style={{ maxWidth: '90%' }}>
            <Text className="text-2xl font-bold text-foreground mb-6 text-center">Set Reminder Time</Text>
            
            {/* Hour Picker */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-muted mb-3">Hour</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-2"
                contentContainerStyle={{ paddingHorizontal: 8 }}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      if (Platform.OS !== 'web') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      setNotificationSettings({ ...notificationSettings, hour: i });
                    }}
                    className="rounded-xl py-3 px-4 min-w-[60px] items-center active:opacity-70"
                    style={{
                      backgroundColor: notificationSettings.hour === i ? colors.primary : colors.surface,
                    }}
                  >
                    <Text
                      className="text-lg font-semibold"
                      style={{ color: notificationSettings.hour === i ? '#FFFFFF' : colors.foreground }}
                    >
                      {i.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Minute Picker */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-muted mb-3">Minute</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-2"
                contentContainerStyle={{ paddingHorizontal: 8 }}
              >
                {[0, 15, 30, 45].map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    onPress={() => {
                      if (Platform.OS !== 'web') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      setNotificationSettings({ ...notificationSettings, minute });
                    }}
                    className="rounded-xl py-3 px-4 min-w-[60px] items-center active:opacity-70"
                    style={{
                      backgroundColor: notificationSettings.minute === minute ? colors.primary : colors.surface,
                    }}
                  >
                    <Text
                      className="text-lg font-semibold"
                      style={{ color: notificationSettings.minute === minute ? '#FFFFFF' : colors.foreground }}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Preview */}
            <View className="bg-surface rounded-2xl p-4 mb-6">
              <Text className="text-sm text-muted text-center mb-1">Selected Time</Text>
              <Text className="text-3xl font-bold text-foreground text-center">
                {formatTime(notificationSettings.hour, notificationSettings.minute)}
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setShowTimePicker(false);
                }}
                className="flex-1 border-2 rounded-full py-3 items-center active:opacity-70"
                style={{ borderColor: colors.border }}
              >
                <Text className="font-semibold text-foreground">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={async () => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                  await saveSettings(notificationSettings);
                  if (notificationSettings.enabled) {
                    await scheduleNotification(notificationSettings.hour, notificationSettings.minute);
                    // Track notification scheduling
                    trackNotificationScheduled(notificationSettings.hour, notificationSettings.minute);
                  }
                  setShowTimePicker(false);
                }}
                className="flex-1 rounded-full py-3 items-center active:opacity-80"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="font-semibold text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
