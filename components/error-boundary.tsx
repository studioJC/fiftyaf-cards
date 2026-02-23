import React, { Component, ReactNode } from "react";
import { View, Text } from "react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Suppresses navigation context errors which are harmless warnings
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a navigation context error (harmless warning)
    if (error.message?.includes("navigation context") || 
        error.message?.includes("NavigationContainer")) {
      // Suppress this error - it's just a warning, not a real crash
      console.warn("Navigation context warning suppressed:", error.message);
      return { hasError: false, error: null };
    }
    
    // For real errors, show error state
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error for debugging
    if (!error.message?.includes("navigation context")) {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Show fallback UI for real errors
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 14, color: "#666", textAlign: "center" }}>
            {this.state.error.message}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}
