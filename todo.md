# Reinvention Cards - Project TODO

## Core Features

- [x] Copy all 21 card images to assets folder
- [x] Copy all 21 audio files to assets folder
- [x] Create card data structure with metadata
- [x] Implement daily card draw logic with local storage
- [x] Build Today's Card screen with card display
- [x] Implement audio player with play/pause controls
- [ ] Add progress bar for audio playback
- [ ] Build Draw Card screen with shuffle animation
- [ ] Implement manual card selection flow
- [x] Create Card Library screen with grid layout
- [x] Build Card Detail screen
- [ ] Implement save card as image functionality
- [ ] Create Reflection Journal screen
- [ ] Implement journal entry creation and storage
- [ ] Build Settings screen
- [ ] Add daily notification reminder
- [x] Implement dark mode support
- [x] Update app branding (name, logo, colors)
- [x] Generate custom app icon
- [ ] Test all user flows end-to-end
- [ ] Create first checkpoint for user testing

## New Features (User Requested)

- [x] Implement animated shuffle for manual card draw
- [ ] Add save card to camera roll functionality (placeholder added, needs expo-media-library)
- [x] Build Reflection Journal screen with note-taking
- [x] Implement journal entry list and detail views
- [x] Add push notification system for daily reminders
- [x] Create Settings screen with notification time picker
- [x] Implement 3-day free trial system
- [x] Build subscription management (99¢/week)
- [x] Integrate Revolut payment link
- [x] Add subscription status checking
- [x] Create paywall screen for trial expiry
- [ ] Test all new features end-to-end

## Branding Update

- [x] Update app name to "FiftyAF Minute Moment"
- [x] Update app.config.ts with new app name
- [x] Create onboarding screen with benefits and tips
- [x] Implement first-launch detection for onboarding
- [x] Add journaling tips to onboarding
- [x] Add habit formation guidance to onboarding
- [ ] Test onboarding flow
- [ ] Create final checkpoint

## Social Sharing & Streak Tracking

- [x] Create social sharing functionality for cards
- [x] Add share button to Today's Card screen
- [x] Add share button to Card Detail screen
- [x] Generate shareable card text with branding
- [x] Implement streak tracking system
- [x] Create streak storage with AsyncStorage
- [x] Add streak counter to home screen
- [x] Add milestone messages (7, 30, 66 days)
- [ ] Build streak calendar view (optional enhancement)
- [ ] Test social sharing on iOS/Android
- [ ] Test streak tracking logic
- [ ] Create checkpoint with new features

## Publishing Error Fixes

- [ ] Fix dependency version mismatches in package.json
- [ ] Ensure all package versions are compatible
- [ ] Test build process
- [ ] Create checkpoint after fixes

## Publishing Error Fixes

- [x] Fix dependency version mismatches in package.json
- [x] Remove lockfile and regenerate with correct versions
- [ ] Test build process
- [ ] Create checkpoint after fixes

## User Feedback - Design Updates

- [x] Change blue color theme to berry/burgundy palette
- [x] Update theme.config.js with new berry colors
- [x] Convert onboarding to multi-page swipeable experience (4 pages)
- [x] Add more breathing room to onboarding content
- [x] Integrate compass icon more throughout the app (icon in onboarding)
- [x] Make notification settings more prominent/visible (Settings tab with clear UI)
- [x] Verify notification time picker is working (displays time, change coming soon)
- [x] Test payment flow and paywall screen (accessible from Settings)
- [ ] Create checkpoint with design updates

## Additional Features

- [x] Implement native time picker in Settings for notification customization
- [ ] Generate remaining 28 card designs (cards 22-49)
- [ ] Create audio insights for new 28 cards
- [ ] Update cards.ts with new card metadata
- [x] Implement favorites feature with AsyncStorage
- [x] Add favorite toggle button to card screens
- [x] Create Favorites filter in Library
- [ ] Test time picker on iOS/Android
- [ ] Test favorites functionality
- [ ] Create checkpoint with all new features

## Analytics & Beta Testing

- [x] Install Mixpanel SDK
- [ ] Set up Mixpanel project and get API key (user needs to create account)
- [x] Create analytics utility with event tracking
- [x] Track app opens and daily active users
- [x] Track card draws (daily/manual)
- [x] Track audio insight plays
- [x] Track favorites added/removed
- [x] Track journal entries created
- [x] Track streak milestones
- [x] Track notification scheduling
- [x] Track onboarding completion and trial start
- [x] Create beta testing guide document
- [x] Document how to install via Expo Go
- [x] Document how to provide feedback
- [ ] Create checkpoint with analytics


## Referral System & Mixpanel Configuration

- [x] Configure Mixpanel token via secrets
- [x] Create referral code generation system
- [x] Build referral tracking with AsyncStorage
- [x] Implement reward tier logic (1 referral = 1 week, 3 = 1 month)
- [x] Add floating share button on home screen
- [x] Hide share button until user subscribes (paywall enforcement)
- [x] Track referral events in Mixpanel
- [x] Display referral stats in Settings
- [x] Test complete referral flow (server restarted successfully)
- [ ] Create checkpoint with referral system
