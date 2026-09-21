import { ThemedText } from "./themed-text";

import { useState } from "react";
import { Pressable } from "react-native";

type CustomerRowProps = { name: string; balance: number; onPress: () => void };

export function CustomerRow({ name, balance, onPress }: CustomerRowProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      style={{ paddingVertical: 14, borderBottomWidth: 1, borderColor: "#ddd" }}
    >
      <ThemedText style={{ fontSize: 18 }}>{name}</ThemedText>
      <ThemedText>₱ {balance.toFixed(2)}</ThemedText>
    </Pressable>
  );
}
