export type CardDomain =
  | "Self-Knowledge"
  | "Resilience & Growth"
  | "Balance & Wellbeing"
  | "Relationships"
  | "Purpose & Meaning"
  | "Creativity & Expression";

export interface Card {
  id: number;
  title: string;
  domain: CardDomain;
  image: any; // require() return type
  audio: any; // require() return type
  summary: string;
}

export const CARDS: Card[] = [
  {
    id: 1,
    title: "Authenticity",
    domain: "Self-Knowledge",
    image: require("@/assets/cards/01_authenticity.png"),
    audio: require("@/assets/audio/01_authenticity.wav"),
    summary:
      "Authenticity is about showing up as you truly are, not performing a version of yourself you think others want to see. It's the courage to let your real self be seen, honoring what matters to you even when it's different from what matters to everyone else.",
  },
  {
    id: 2,
    title: "Courage",
    domain: "Resilience & Growth",
    image: require("@/assets/cards/02_courage.png"),
    audio: require("@/assets/audio/02_courage.wav"),
    summary:
      "Courage isn't the absence of fear—it's taking action even when fear is present. Real courage is quiet: the difficult conversation, the boundary set, the admission that you don't have all the answers. You don't have to feel ready. You just have to begin.",
  },
  {
    id: 3,
    title: "Presence",
    domain: "Balance & Wellbeing",
    image: require("@/assets/cards/03_presence.png"),
    audio: require("@/assets/audio/03_presence.wav"),
    summary:
      "Presence is the practice of being fully here, fully now. Not replaying yesterday or rehearsing tomorrow—just this moment, exactly as it is. The present moment is the only place where life actually happens. When you're fully here, you're fully alive.",
  },
  {
    id: 4,
    title: "Letting Go",
    domain: "Resilience & Growth",
    image: require("@/assets/cards/04_letting_go.png"),
    audio: require("@/assets/audio/04_letting_go.wav"),
    summary:
      "Letting go is the art of releasing what no longer serves you—old resentments, outdated identities, or the need to control outcomes. It's not about giving up; it's about making space. When your hands are full of the past, you can't reach for the future.",
  },
  {
    id: 5,
    title: "Flow",
    domain: "Creativity & Expression",
    image: require("@/assets/cards/05_flow.png"),
    audio: require("@/assets/audio/05_flow.wav"),
    summary:
      "Flow is that state of effortless engagement where time disappears and you're completely absorbed in what you're doing. It emerges when we find the sweet spot between challenge and skill. Life doesn't always have to be hard—sometimes the most fulfilling moments come when we stop pushing and start flowing.",
  },
  {
    id: 6,
    title: "Vulnerability",
    domain: "Relationships",
    image: require("@/assets/cards/06_vulnerability.png"),
    audio: require("@/assets/audio/06_vulnerability.wav"),
    summary:
      "Vulnerability is the birthplace of connection, creativity, and courage. It's the willingness to be seen without guarantees, to risk rejection in pursuit of genuine relationship. The armor that keeps us safe also keeps us isolated. Vulnerability isn't weakness—it's being brave enough to be real.",
  },
  {
    id: 7,
    title: "Purpose",
    domain: "Purpose & Meaning",
    image: require("@/assets/cards/07_purpose.png"),
    audio: require("@/assets/audio/07_purpose.wav"),
    summary:
      "Purpose isn't something you find once and check off your list. It evolves as you do, revealing itself through your choices and values. Purpose doesn't have to be grand—it can be as simple as raising kind humans or being a steady presence for those you love. Your purpose is already within you, waiting to be recognized.",
  },
  {
    id: 8,
    title: "Rest",
    domain: "Balance & Wellbeing",
    image: require("@/assets/cards/08_rest.png"),
    audio: require("@/assets/audio/08_rest.wav"),
    summary:
      "Rest is not a luxury—it's a necessity. It's where your body heals, your mind processes, and your creativity regenerates. Rest isn't just sleep; it's the pause between activities, the permission to be unproductive. Your worth isn't measured by your output. Give yourself permission to rest without guilt.",
  },
  {
    id: 9,
    title: "Transformation",
    domain: "Resilience & Growth",
    image: require("@/assets/cards/09_transformation.png"),
    audio: require("@/assets/audio/09_transformation.wav"),
    summary:
      "Transformation is the process of becoming something new while honoring what you've been. It's not about rejecting your past self, but evolving beyond it. The in-between space can feel disorienting, but it's where the magic happens. Transformation isn't about becoming someone else—it's about becoming more fully yourself.",
  },
  {
    id: 10,
    title: "Gratitude",
    domain: "Balance & Wellbeing",
    image: require("@/assets/cards/10_gratitude.png"),
    audio: require("@/assets/audio/10_gratitude.wav"),
    summary:
      "Gratitude is a practice of noticing and appreciating what's already here, even amid difficulty. It's training your attention to see abundance rather than scarcity. Gratitude shifts your perspective—when you focus on what you have rather than what you lack, you realize you're already rich in the ways that matter most.",
  },
  {
    id: 11,
    title: "Shadow Work",
    domain: "Self-Knowledge",
    image: require("@/assets/cards/11_shadow_work.png"),
    audio: require("@/assets/audio/11_shadow_work.wav"),
    summary:
      "Shadow work is acknowledging and integrating the parts of yourself you've hidden or rejected—your anger, jealousy, neediness, ambition. What we push into the shadow doesn't disappear; it operates unconsciously. Integration brings wholeness. When you can embrace all of who you are—light and dark—you become more authentic and free.",
  },
  {
    id: 12,
    title: "Boundaries",
    domain: "Relationships",
    image: require("@/assets/cards/12_boundaries.png"),
    audio: require("@/assets/audio/12_boundaries.wav"),
    summary:
      "Boundaries protect your energy, time, and wellbeing. They're not walls—they're gates you control. Healthy boundaries aren't selfish; they're essential. When you have clear boundaries, you can be more generous because you're not giving from an empty tank. You have the right to protect your peace.",
  },
  {
    id: 13,
    title: "Perseverance",
    domain: "Resilience & Growth",
    image: require("@/assets/cards/13_perseverance.png"),
    audio: require("@/assets/audio/13_perseverance.wav"),
    summary:
      "Perseverance is the quiet determination to keep going when things get hard. It's simply showing up, day after day, even when progress feels slow. You don't have to do it all at once—just take the next step, and then the next. Progress isn't always linear. All of it counts.",
  },
  {
    id: 14,
    title: "Authentic Connection",
    domain: "Relationships",
    image: require("@/assets/cards/14_authentic_connection.png"),
    audio: require("@/assets/audio/14_authentic_connection.wav"),
    summary:
      "Authentic connection happens when two people show up as they really are, without pretense. It requires vulnerability—risking rejection by showing your real self. You don't need dozens of connections; even one or two relationships where you can be fully real can sustain you through anything.",
  },
  {
    id: 15,
    title: "Reciprocity",
    domain: "Relationships",
    image: require("@/assets/cards/15_reciprocity.png"),
    audio: require("@/assets/audio/15_reciprocity.wav"),
    summary:
      "Reciprocity is the balance of giving and receiving in relationships. Healthy connections require mutual care, effort, and respect. When you always give and never receive, you create imbalance and eventually burn out. Balanced relationships sustain us. Imbalanced ones deplete us. You deserve balance.",
  },
  {
    id: 16,
    title: "Calling",
    domain: "Purpose & Meaning",
    image: require("@/assets/cards/16_calling.png"),
    audio: require("@/assets/audio/16_calling.wav"),
    summary:
      "A calling is that persistent pull toward something that matters to you. It's not always loud or clear—sometimes it's a whisper, a curiosity. Your calling doesn't have to be your whole life. It can be something you explore on the side. You don't need permission or a plan. You just need to begin.",
  },
  {
    id: 17,
    title: "Alignment",
    domain: "Purpose & Meaning",
    image: require("@/assets/cards/17_alignment.png"),
    audio: require("@/assets/audio/17_alignment.wav"),
    summary:
      "Alignment is when your actions match your values, when how you're living reflects what matters most. Misalignment is exhausting. Alignment brings ease—not because life becomes easy, but because you're no longer fighting yourself. When you live in alignment, you have internal integrity. That's a kind of freedom.",
  },
  {
    id: 18,
    title: "Joy",
    domain: "Balance & Wellbeing",
    image: require("@/assets/cards/18_joy.png"),
    audio: require("@/assets/audio/18_joy.wav"),
    summary:
      "Joy is different from happiness. It's a sense of delight and aliveness that can exist even in difficult times. Joy is in small moments—a good song, a genuine laugh, the way sunlight hits your counter. You don't have to wait for everything to be perfect to experience joy. You can choose it right now.",
  },
  {
    id: 19,
    title: "Movement",
    domain: "Balance & Wellbeing",
    image: require("@/assets/cards/19_movement.png"),
    audio: require("@/assets/audio/19_movement.wav"),
    summary:
      "Movement is life. Your body is designed to move, and when it does, everything improves—your mood, energy, clarity, health. Movement doesn't have to mean intense workouts. It can be a walk, stretching, dancing in your kitchen. Your body has carried you through everything. Honor it. Move it. Thank it.",
  },
  {
    id: 20,
    title: "Imagination",
    domain: "Creativity & Expression",
    image: require("@/assets/cards/20_imagination.png"),
    audio: require("@/assets/audio/20_imagination.wav"),
    summary:
      "Imagination is your capacity to envision what doesn't yet exist. It's how you dream, create, and solve problems. Every positive change in your life started with someone imagining something different. Give yourself permission to wonder, to play with ideas. What you can conceive, you can often achieve.",
  },
  {
    id: 21,
    title: "Acceptance",
    domain: "Self-Knowledge",
    image: require("@/assets/cards/21_acceptance.png"),
    audio: require("@/assets/audio/21_acceptance.wav"),
    summary:
      "Acceptance means acknowledging reality as it is, right now, without resistance. It doesn't mean resignation—it means stopping the fight with what is. Acceptance is the starting point for change. You can't transform what you won't acknowledge. Acceptance brings peace because you're no longer at war with reality.",
  },
];

// Helper functions
export function getCardById(id: number): Card | undefined {
  return CARDS.find((card) => card.id === id);
}

export function getRandomCard(): Card {
  const randomIndex = Math.floor(Math.random() * CARDS.length);
  return CARDS[randomIndex];
}

export function getCardsByDomain(domain: CardDomain): Card[] {
  return CARDS.filter((card) => card.domain === domain);
}

export const DOMAINS: CardDomain[] = [
  "Self-Knowledge",
  "Resilience & Growth",
  "Balance & Wellbeing",
  "Relationships",
  "Purpose & Meaning",
  "Creativity & Expression",
];
