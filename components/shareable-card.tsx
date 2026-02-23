import { View, Text, Image } from "react-native";
import { Card } from "@/constants/cards";

interface ShareableCardProps {
  card: Card;
}

/**
 * Component that renders a shareable card image
 * This will be captured as an image using react-native-view-shot
 */
export function ShareableCard({ card }: ShareableCardProps) {
  return (
    <View
      style={{
        width: 1080,
        height: 1080,
        backgroundColor: "#F5F1E8",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
      }}
    >
      {/* Card Image Container */}
      <View
        style={{
          width: 800,
          height: 800,
          borderRadius: 24,
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <Image
          source={card.image}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      {/* Card Title */}
      <View
        style={{
          position: "absolute",
          bottom: 120,
          left: 60,
          right: 60,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 48,
            fontWeight: "700",
            color: "#2C3E50",
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          {card.title.toUpperCase()}
        </Text>
      </View>

      {/* Branding */}
      <View
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          alignItems: "flex-end",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            color: "#95A5A6",
            letterSpacing: 1,
          }}
        >
          REINVENTION CARDS
        </Text>
      </View>
    </View>
  );
}
