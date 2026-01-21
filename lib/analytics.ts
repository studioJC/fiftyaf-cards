import { Mixpanel } from "mixpanel-react-native";

// Mixpanel token - replace with your actual token from mixpanel.com
// For beta testing, you can use a test token or disable tracking
const MIXPANEL_TOKEN = "YOUR_MIXPANEL_TOKEN_HERE";
const ENABLE_ANALYTICS = false; // Set to true when you have a Mixpanel token

let mixpanel: Mixpanel | null = null;

/**
 * Initialize Mixpanel analytics
 * Call this once when the app starts
 */
export async function initAnalytics() {
  if (!ENABLE_ANALYTICS || !MIXPANEL_TOKEN || MIXPANEL_TOKEN === "YOUR_MIXPANEL_TOKEN_HERE") {
    console.log("[Analytics] Disabled - no token configured");
    return;
  }

  try {
    mixpanel = new Mixpanel(MIXPANEL_TOKEN, true);
    await mixpanel.init();
    console.log("[Analytics] Initialized successfully");
  } catch (error) {
    console.error("[Analytics] Failed to initialize:", error);
  }
}

/**
 * Track an event
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (!ENABLE_ANALYTICS || !mixpanel) return;

  try {
    mixpanel.track(eventName, properties);
    console.log(`[Analytics] Event: ${eventName}`, properties);
  } catch (error) {
    console.error(`[Analytics] Failed to track event ${eventName}:`, error);
  }
}

/**
 * Identify a user (optional - for user-specific tracking)
 */
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (!ENABLE_ANALYTICS || !mixpanel) return;

  try {
    mixpanel.identify(userId);
    if (properties) {
      mixpanel.getPeople().set(properties);
    }
    console.log(`[Analytics] User identified: ${userId}`);
  } catch (error) {
    console.error("[Analytics] Failed to identify user:", error);
  }
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>) {
  if (!ENABLE_ANALYTICS || !mixpanel) return;

  try {
    mixpanel.getPeople().set(properties);
    console.log("[Analytics] User properties set:", properties);
  } catch (error) {
    console.error("[Analytics] Failed to set user properties:", error);
  }
}

/**
 * Increment a user property (e.g., total_cards_drawn)
 */
export function incrementUserProperty(property: string, by: number = 1) {
  if (!ENABLE_ANALYTICS || !mixpanel) return;

  try {
    mixpanel.getPeople().increment(property, by);
    console.log(`[Analytics] Incremented ${property} by ${by}`);
  } catch (error) {
    console.error(`[Analytics] Failed to increment ${property}:`, error);
  }
}

// Predefined event tracking functions for common actions

export function trackAppOpen() {
  trackEvent("App Opened");
}

export function trackCardDrawn(cardId: number, cardTitle: string, isDaily: boolean) {
  trackEvent("Card Drawn", {
    card_id: cardId,
    card_title: cardTitle,
    draw_type: isDaily ? "daily" : "manual",
  });
  incrementUserProperty("total_cards_drawn");
}

export function trackAudioPlayed(cardId: number, cardTitle: string) {
  trackEvent("Audio Played", {
    card_id: cardId,
    card_title: cardTitle,
  });
  incrementUserProperty("total_audio_plays");
}

export function trackFavoriteToggled(cardId: number, cardTitle: string, isFavorited: boolean) {
  trackEvent(isFavorited ? "Card Favorited" : "Card Unfavorited", {
    card_id: cardId,
    card_title: cardTitle,
  });
  
  if (isFavorited) {
    incrementUserProperty("total_favorites");
  }
}

export function trackJournalEntryCreated(cardId?: number, cardTitle?: string) {
  trackEvent("Journal Entry Created", {
    card_id: cardId,
    card_title: cardTitle,
    has_card: !!cardId,
  });
  incrementUserProperty("total_journal_entries");
}

export function trackStreakMilestone(streakDays: number) {
  trackEvent("Streak Milestone Reached", {
    streak_days: streakDays,
  });
  
  setUserProperties({
    current_streak: streakDays,
    longest_streak: streakDays, // This should be max of current and previous longest
  });
}

export function trackCardShared(cardId: number, cardTitle: string) {
  trackEvent("Card Shared", {
    card_id: cardId,
    card_title: cardTitle,
  });
  incrementUserProperty("total_shares");
}

export function trackNotificationScheduled(hour: number, minute: number) {
  trackEvent("Notification Scheduled", {
    hour,
    minute,
  });
  
  setUserProperties({
    notification_time: `${hour}:${minute.toString().padStart(2, "0")}`,
  });
}

export function trackSubscriptionStarted() {
  trackEvent("Subscription Started");
  setUserProperties({
    is_subscriber: true,
    subscription_start_date: new Date().toISOString(),
  });
}

export function trackTrialStarted() {
  trackEvent("Trial Started");
  setUserProperties({
    trial_start_date: new Date().toISOString(),
  });
}

export function trackPaywallViewed() {
  trackEvent("Paywall Viewed");
}

export function trackOnboardingCompleted() {
  trackEvent("Onboarding Completed");
  setUserProperties({
    onboarding_completed: true,
    onboarding_completed_date: new Date().toISOString(),
  });
}
