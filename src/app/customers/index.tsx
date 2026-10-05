import { ThemedText } from "@/components/themed-text";
import { useState } from "react";
import { ActivityIndicator, Button, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddCustomerModal } from "@/components/add-customer-modal";
import { CustomerRow } from "@/components/customer-row";
import { ThemedView } from "@/components/themed-view";
import { useCustomers } from "@/hooks/use-customers";
import { useProfile } from "@/hooks/use-profile";
import { useTheme } from "@/hooks/use-theme";
import { Href, useRouter } from "expo-router";

export default function CustomersScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { status, customers, problem, retry } = useCustomers();
  const profile = useProfile();
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");

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
        <Button title="Try Again" onPress={retry} />
      </ThemedView>
    );
  if (status === "empty")
    return (
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <ThemedText>No customers yet...</ThemedText>
      </ThemedView>
    );

  const shown = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );
  const total = shown.reduce((sum, c) => sum + c.balance, 0);

  return (
    <SafeAreaView style={{ flex: 1, padding: 24, gap: 12 }}>
      <ThemedText style={{ fontSize: 28, fontWeight: "600" }}>
        Customers
      </ThemedText>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search customers"
        placeholderTextColor={theme.textSecondary}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          color: theme.text,
          borderColor: theme.textSecondary,
        }}
      />
      <ThemedText style={{ fontSize: 18 }}>
        Total Owed: ₱ {total.toFixed(2)}
      </ThemedText>
      {profile?.role === "admin" && (
        <Button title="Add customer" onPress={() => setAdding(true)} />
      )}
      <FlatList
        data={shown}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <CustomerRow
            name={item.name}
            balance={item.balance}
            onPress={() => router.push(`/customers/${item.id}` as Href)}
          />
        )}
        ListEmptyComponent={
          <ThemedText>No customers match "{query}"...</ThemedText>
        }
      />
      <AddCustomerModal
        visible={adding}
        onClose={() => setAdding(false)}
        onAdded={retry}
      />
    </SafeAreaView>
  );
}
