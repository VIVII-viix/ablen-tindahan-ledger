import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Customer, fetchCustomer } from "@/data/customers";
import { problemFor, Status } from "@/data/problem";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function CustomerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [problem, setProblem] = useState("");

  useEffect(() => {
    let live = true;
    fetchCustomer(id)
      .then((row) => {
        if (live) {
          setCustomer(row);
          setStatus("content");
        }
      })
      .catch((e) => {
        if (live) {
          setProblem(problemFor(e));
          setStatus("error");
        }
      });
    return () => {
      live = false;
    };
  }, [id]);

  if (status === "loading")
    return (
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <ActivityIndicator />
      </ThemedView>
    );
  if (status === "error")
    return (
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <ThemedText>{problem}</ThemedText>
      </ThemedView>
    );
  return (
    <ThemedView style={{ flex: 1, padding: 24, gap: 12 }}>
      <Stack.Screen options={{ title: customer!.name }} />
      <ThemedText type="title">₱ {customer!.balance.toFixed(2)}</ThemedText>
      <ThemedText themeColor="textSecondary">
        Last paid: {customer!.lastPaid}
      </ThemedText>
    </ThemedView>
  );
}
