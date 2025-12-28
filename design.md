# Reinvention Cards - Mobile App Design

## Design Philosophy

A **minimalist, contemplative** mobile app for daily reflection cards inspired by Inner Compass. Designed for **Gen X users** (ages 44-59) who value simplicity, authenticity, and practical wisdom without spiritual fluff.

### Visual Identity
- **Aesthetic**: Clean, sophisticated geometric designs with generous white space
- **Color Palette**: Deep teal (#0a7ea4), warm gold (#C9A961), sage green, burnt orange, cream backgrounds
- **Typography**: Clean sans-serif, generous line height, excellent readability
- **Orientation**: Portrait (9:16) optimized for one-handed use

---

## Screen List & Functionality

### 1. **Today's Card Screen** (Home/Main)
**Primary Content:**
- Large, full-width card image display (landscape orientation card in portrait app)
- Card title prominently displayed below image
- Audio player controls (play/pause, progress bar)
- "Reflect" button to open journaling
- Date stamp showing when card was drawn

**Functionality:**
- Automatically draws a new card each day at midnight (local time)
- Plays audio insight when user taps play button
- Shows visual feedback during audio playback
- Allows user to save card as image for lock screen/wallpaper
- Swipe up to see previous cards from history

**Layout:**
- Card image takes up ~50% of screen height
- Clean spacing between elements
- Floating action button for "Draw New Card" (manual shuffle)

### 2. **Draw Card Screen** (Manual Selection)
**Primary Content:**
- Animated card deck visualization
- "Shuffle Deck" button with haptic feedback
- Card spread animation when shuffling
- Tap to select card from spread

**Functionality:**
- User can manually draw a card anytime (not just daily)
- Shuffle animation with realistic card movement
- Selected card transitions to Today's Card view
- Haptic feedback on shuffle and selection

**Layout:**
- Centered deck visualization
- Large, easy-to-tap shuffle button
- Cards fan out in arc pattern for selection

### 3. **Card Library Screen**
**Primary Content:**
- Grid view of all 21 cards (3 columns)
- Each card shows thumbnail image and title
- Filter by domain (Self-Knowledge, Resilience, Balance, etc.)
- Search functionality

**Functionality:**
- Browse all available cards
- Tap any card to view full details
- Play audio insight for any card
- See which cards have been drawn (subtle indicator)

**Layout:**
- 3-column grid with consistent spacing
- Filter chips at top
- Smooth scroll performance

### 4. **Card Detail Screen**
**Primary Content:**
- Full card image
- Card title and domain
- Audio player controls
- Written summary of card meaning (~100 words)
- "Save as Wallpaper" button
- Related cards suggestions

**Functionality:**
- View any card in detail
- Play audio insight
- Save card image for lock screen
- Navigate to related cards
- Share card (optional)

### 5. **Reflection Journal Screen**
**Primary Content:**
- List of journal entries by date
- Each entry shows: date, card drawn, journal text preview
- "New Entry" floating action button

**Functionality:**
- Create journal entries for daily reflections
- Associate entries with specific cards
- Simple text input (no formatting needed)
- Search/filter entries by date or card

**Layout:**
- Chronological list (newest first)
- Card thumbnail + date + text preview
- Tap to expand full entry

### 6. **Settings Screen**
**Primary Content:**
- Daily draw time setting (default: 6:00 AM)
- Audio autoplay toggle
- Dark/light mode toggle
- Notification preferences
- About section (credits, version)

**Functionality:**
- Customize when daily card is drawn
- Toggle audio autoplay when card appears
- Enable/disable daily reminder notifications
- View app information

---

## Key User Flows

### Flow 1: Daily Morning Ritual
1. User opens app (or receives notification)
2. Today's Card screen shows newly drawn card
3. User views card image
4. User taps play to hear audio insight (77 seconds)
5. User reflects during audio
6. User optionally taps "Reflect" to journal
7. User saves card as lock screen wallpaper

### Flow 2: Manual Card Draw
1. User taps "Draw Card" button from Today's Card screen
2. App navigates to Draw Card screen
3. User taps "Shuffle Deck" button
4. Cards animate in shuffle/spread
5. User taps to select a card
6. Selected card becomes new "Today's Card"
7. Audio begins playing (if autoplay enabled)

### Flow 3: Browse & Explore
1. User taps "Library" tab
2. Grid of all 21 cards displayed
3. User scrolls or filters by domain
4. User taps card for detail view
5. User plays audio insight
6. User navigates to related cards

### Flow 4: Lock Screen Setup
1. User draws or views a card
2. User taps "Save as Wallpaper"
3. App generates optimized lock screen image
4. System share sheet appears
5. User saves to Photos or sets as wallpaper
6. Card becomes daily visual reminder

---

## Color Choices (Brand-Specific)

**Primary Palette:**
- **Primary/Tint**: `#0a7ea4` (Deep teal - trust, wisdom, depth)
- **Background Light**: `#F5F5F0` (Warm cream - calm, organic)
- **Background Dark**: `#1A1A1A` (Soft black - sophistication)
- **Foreground Light**: `#2C2C2C` (Charcoal - readability)
- **Foreground Dark**: `#ECEDEE` (Soft white)
- **Accent Gold**: `#C9A961` (Warm gold - wisdom, value)
- **Accent Sage**: `#8B9D83` (Sage green - growth, balance)
- **Accent Coral**: `#D4816F` (Burnt orange - warmth, courage)

**Semantic Colors:**
- **Success**: Sage green
- **Warning**: Warm gold
- **Error**: Muted red `#C85A54`

---

## Typography

- **Headings**: SF Pro Display (iOS) / Roboto (Android) - Bold, 24-32pt
- **Body**: SF Pro Text (iOS) / Roboto (Android) - Regular, 16-18pt, line-height 1.5
- **Card Titles**: Medium weight, 20pt, letter-spacing: 0.5pt
- **Audio Duration**: Monospace, 14pt

---

## Interaction Patterns

**Haptic Feedback:**
- Light impact on button taps
- Medium impact on card shuffle
- Success haptic when card is drawn

**Animations:**
- Card shuffle: 800ms with spring physics
- Card flip: 400ms ease-in-out
- Audio play button: Scale 0.95 on press
- Screen transitions: 300ms slide

**Audio Behavior:**
- Plays in background (iOS silent mode enabled)
- Shows progress bar with time remaining
- Pause/resume capability
- Auto-stops when user navigates away (optional setting)

---

## Platform Considerations

**iOS:**
- Native SF Symbols for icons
- Haptic feedback throughout
- Lock screen widget support (future)
- Share sheet for wallpaper export

**Android:**
- Material Icons
- Vibration feedback
- Home screen widget support (future)
- Share intent for wallpaper export

**Both:**
- Offline-first (all cards/audio stored locally)
- No login required
- AsyncStorage for user preferences and journal
- Dark mode support

---

## Design Principles

1. **Simplicity First**: No clutter, no unnecessary features
2. **One-Handed Use**: All primary actions within thumb reach
3. **Respecting Time**: Quick load times, no forced waits
4. **Privacy**: All data local, no tracking, no accounts
5. **Accessibility**: High contrast, readable text, clear touch targets
6. **Authenticity**: Real wisdom, no corporate speak, no fake positivity

---

## Technical Notes

- All 21 cards stored as local assets
- All 21 audio files stored as local assets
- Journal entries stored in AsyncStorage
- Daily card draw triggered by local time check
- No backend required for MVP
- Future: Optional cloud sync for journal (if user wants)
