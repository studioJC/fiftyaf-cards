import AsyncStorage from "@react-native-async-storage/async-storage";
import { trackEvent, setUserProperties } from "./analytics";

const REFERRAL_CODE_KEY = "@fiftyaf:referral_code";
const REFERRALS_KEY = "@fiftyaf:referrals";
const REFERRED_BY_KEY = "@fiftyaf:referred_by";
const FREE_WEEKS_KEY = "@fiftyaf:free_weeks";

export interface Referral {
  code: string;
  name?: string;
  subscribedAt?: string;
  rewardGranted: boolean;
}

export interface ReferralStats {
  myCode: string;
  totalReferrals: number;
  subscribedReferrals: number;
  freeWeeksEarned: number;
  currentMonthReferrals: number;
}

/**
 * Generate a unique referral code for the user
 */
function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing characters
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Get or create the user's referral code
 */
export async function getMyReferralCode(): Promise<string> {
  try {
    let code = await AsyncStorage.getItem(REFERRAL_CODE_KEY);
    
    if (!code) {
      code = generateReferralCode();
      await AsyncStorage.setItem(REFERRAL_CODE_KEY, code);
      
      trackEvent("Referral Code Generated", { code });
      setUserProperties({ referral_code: code });
    }
    
    return code;
  } catch (error) {
    console.error("Failed to get referral code:", error);
    return "";
  }
}

/**
 * Record that this user was referred by someone
 */
export async function recordReferredBy(referralCode: string): Promise<boolean> {
  try {
    // Check if already referred
    const existing = await AsyncStorage.getItem(REFERRED_BY_KEY);
    if (existing) {
      return false; // Already referred by someone
    }
    
    await AsyncStorage.setItem(REFERRED_BY_KEY, referralCode);
    
    trackEvent("User Referred", { referred_by_code: referralCode });
    setUserProperties({ referred_by: referralCode });
    
    return true;
  } catch (error) {
    console.error("Failed to record referral:", error);
    return false;
  }
}

/**
 * Get the code of the person who referred this user
 */
export async function getReferredBy(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(REFERRED_BY_KEY);
  } catch (error) {
    console.error("Failed to get referred by:", error);
    return null;
  }
}

/**
 * Add a new referral (when someone uses your code)
 */
export async function addReferral(referralCode: string, referredUserName?: string): Promise<void> {
  try {
    const referralsJson = await AsyncStorage.getItem(REFERRALS_KEY);
    const referrals: Referral[] = referralsJson ? JSON.parse(referralsJson) : [];
    
    // Check if already exists
    const exists = referrals.some(r => r.code === referralCode);
    if (exists) {
      return;
    }
    
    referrals.push({
      code: referralCode,
      name: referredUserName,
      rewardGranted: false,
    });
    
    await AsyncStorage.setItem(REFERRALS_KEY, JSON.stringify(referrals));
    
    trackEvent("Referral Added", {
      referral_code: referralCode,
      total_referrals: referrals.length,
    });
  } catch (error) {
    console.error("Failed to add referral:", error);
  }
}

/**
 * Mark a referral as subscribed and grant rewards
 */
export async function markReferralSubscribed(referralCode: string): Promise<void> {
  try {
    const referralsJson = await AsyncStorage.getItem(REFERRALS_KEY);
    const referrals: Referral[] = referralsJson ? JSON.parse(referralsJson) : [];
    
    const referral = referrals.find(r => r.code === referralCode);
    if (!referral || referral.subscribedAt) {
      return; // Not found or already marked
    }
    
    referral.subscribedAt = new Date().toISOString();
    
    await AsyncStorage.setItem(REFERRALS_KEY, JSON.stringify(referrals));
    
    // Calculate and grant rewards
    await calculateAndGrantRewards(referrals);
    
    trackEvent("Referral Subscribed", {
      referral_code: referralCode,
      subscribed_referrals: referrals.filter(r => r.subscribedAt).length,
    });
  } catch (error) {
    console.error("Failed to mark referral as subscribed:", error);
  }
}

/**
 * Calculate rewards based on referrals
 * - 1 subscribed referral = 1 free week
 * - 3 subscribed referrals in a month = 1 free month
 */
async function calculateAndGrantRewards(referrals: Referral[]): Promise<void> {
  try {
    const subscribedReferrals = referrals.filter(r => r.subscribedAt && !r.rewardGranted);
    
    if (subscribedReferrals.length === 0) {
      return;
    }
    
    // Get current free weeks
    const freeWeeksJson = await AsyncStorage.getItem(FREE_WEEKS_KEY);
    let freeWeeks = freeWeeksJson ? parseInt(freeWeeksJson) : 0;
    
    // Grant 1 week per subscribed referral
    const newWeeks = subscribedReferrals.length;
    freeWeeks += newWeeks;
    
    // Mark referrals as rewarded
    subscribedReferrals.forEach(r => {
      r.rewardGranted = true;
    });
    
    await AsyncStorage.setItem(REFERRALS_KEY, JSON.stringify(referrals));
    await AsyncStorage.setItem(FREE_WEEKS_KEY, freeWeeks.toString());
    
    trackEvent("Referral Rewards Granted", {
      weeks_granted: newWeeks,
      total_free_weeks: freeWeeks,
    });
    
    setUserProperties({
      total_referral_rewards: freeWeeks,
    });
    
    // Check for monthly bonus (3 referrals in current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthReferrals = referrals.filter(r => {
      if (!r.subscribedAt) return false;
      const date = new Date(r.subscribedAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    if (thisMonthReferrals.length >= 3) {
      // Grant bonus month (4 weeks)
      freeWeeks += 4;
      await AsyncStorage.setItem(FREE_WEEKS_KEY, freeWeeks.toString());
      
      trackEvent("Monthly Referral Bonus Granted", {
        month_referrals: thisMonthReferrals.length,
        bonus_weeks: 4,
        total_free_weeks: freeWeeks,
      });
    }
  } catch (error) {
    console.error("Failed to calculate rewards:", error);
  }
}

/**
 * Get referral statistics
 */
export async function getReferralStats(): Promise<ReferralStats> {
  try {
    const myCode = await getMyReferralCode();
    const referralsJson = await AsyncStorage.getItem(REFERRALS_KEY);
    const referrals: Referral[] = referralsJson ? JSON.parse(referralsJson) : [];
    
    const subscribedReferrals = referrals.filter(r => r.subscribedAt);
    
    const freeWeeksJson = await AsyncStorage.getItem(FREE_WEEKS_KEY);
    const freeWeeksEarned = freeWeeksJson ? parseInt(freeWeeksJson) : 0;
    
    // Count current month referrals
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthReferrals = subscribedReferrals.filter(r => {
      if (!r.subscribedAt) return false;
      const date = new Date(r.subscribedAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
    
    return {
      myCode,
      totalReferrals: referrals.length,
      subscribedReferrals: subscribedReferrals.length,
      freeWeeksEarned,
      currentMonthReferrals,
    };
  } catch (error) {
    console.error("Failed to get referral stats:", error);
    return {
      myCode: "",
      totalReferrals: 0,
      subscribedReferrals: 0,
      freeWeeksEarned: 0,
      currentMonthReferrals: 0,
    };
  }
}

/**
 * Get number of free weeks remaining
 */
export async function getFreeWeeks(): Promise<number> {
  try {
    const freeWeeksJson = await AsyncStorage.getItem(FREE_WEEKS_KEY);
    return freeWeeksJson ? parseInt(freeWeeksJson) : 0;
  } catch (error) {
    console.error("Failed to get free weeks:", error);
    return 0;
  }
}

/**
 * Consume one free week (when extending subscription)
 */
export async function consumeFreeWeek(): Promise<boolean> {
  try {
    const freeWeeks = await getFreeWeeks();
    
    if (freeWeeks <= 0) {
      return false;
    }
    
    await AsyncStorage.setItem(FREE_WEEKS_KEY, (freeWeeks - 1).toString());
    
    trackEvent("Free Week Consumed", {
      remaining_weeks: freeWeeks - 1,
    });
    
    return true;
  } catch (error) {
    console.error("Failed to consume free week:", error);
    return false;
  }
}

/**
 * Generate shareable referral message
 */
export async function getReferralShareMessage(): Promise<string> {
  const code = await getMyReferralCode();
  
  return `🧭 Join me on FiftyAF Minute Moment - daily reflection cards for Gen X!

Take a minute each day for self-reflection, journaling, and mindful growth.

Use my code: ${code}

Download: [App Store/Play Store link will be here]

#FiftyAF #BeKindAndCurious`;
}
