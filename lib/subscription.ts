import AsyncStorage from "@react-native-async-storage/async-storage";

const SUBSCRIPTION_KEY = "@reinvention_cards:subscription";
const TRIAL_DURATION_DAYS = 3;

export interface SubscriptionStatus {
  isActive: boolean;
  isTrialActive: boolean;
  trialStartDate: string | null; // ISO date string
  trialEndDate: string | null; // ISO date string
  subscriptionStartDate: string | null; // ISO date string
  hasCompletedPayment: boolean;
}

/**
 * Initialize subscription status for first-time users
 */
export async function initializeSubscription(): Promise<SubscriptionStatus> {
  const existing = await getSubscriptionStatus();
  
  // If already initialized, return existing status
  if (existing.trialStartDate) {
    return existing;
  }

  // Start trial for new users
  const now = new Date();
  const trialEnd = new Date(now);
  trialEnd.setDate(trialEnd.getDate() + TRIAL_DURATION_DAYS);

  const newStatus: SubscriptionStatus = {
    isActive: true,
    isTrialActive: true,
    trialStartDate: now.toISOString(),
    trialEndDate: trialEnd.toISOString(),
    subscriptionStartDate: null,
    hasCompletedPayment: false,
  };

  await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(newStatus));
  return newStatus;
}

/**
 * Get current subscription status
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    const stored = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
    
    if (!stored) {
      // New user - initialize trial
      return await initializeSubscription();
    }

    const status: SubscriptionStatus = JSON.parse(stored);
    
    // Check if trial has expired
    if (status.isTrialActive && status.trialEndDate) {
      const trialEnd = new Date(status.trialEndDate);
      const now = new Date();
      
      if (now > trialEnd) {
        // Trial expired
        status.isTrialActive = false;
        status.isActive = status.hasCompletedPayment;
        await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(status));
      }
    }

    return status;
  } catch (error) {
    console.error("Error getting subscription status:", error);
    return {
      isActive: false,
      isTrialActive: false,
      trialStartDate: null,
      trialEndDate: null,
      subscriptionStartDate: null,
      hasCompletedPayment: false,
    };
  }
}

/**
 * Mark subscription as paid (after successful Revolut payment)
 */
export async function activateSubscription(): Promise<void> {
  const status = await getSubscriptionStatus();
  
  status.hasCompletedPayment = true;
  status.isActive = true;
  status.subscriptionStartDate = new Date().toISOString();

  await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(status));
}

/**
 * Check if user has access to the app
 */
export async function hasAccess(): Promise<boolean> {
  const status = await getSubscriptionStatus();
  return status.isActive;
}

/**
 * Get days remaining in trial
 */
export async function getTrialDaysRemaining(): Promise<number> {
  const status = await getSubscriptionStatus();
  
  if (!status.isTrialActive || !status.trialEndDate) {
    return 0;
  }

  const trialEnd = new Date(status.trialEndDate);
  const now = new Date();
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

/**
 * Clear subscription data (for testing)
 */
export async function clearSubscription(): Promise<void> {
  await AsyncStorage.removeItem(SUBSCRIPTION_KEY);
}
