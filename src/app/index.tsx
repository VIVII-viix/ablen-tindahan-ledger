import { ThemedText } from "@/components/themed-text";
import {
  ActivityIndicator,
  Button,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ShareBar } from "@/components/share-bar";
import { Stat } from "@/components/stat";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { summarise } from "@/data/summary";
import { useCustomers } from "@/hooks/use-customers";
import { Link } from "expo-router";

export default function HomeScreen() {
  const { status, customers, problem, retry } = useCustomers();
  const summary = summarise(customers);

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
        <ThemedText themeColor="textSecondary">
          Loading statistics...
        </ThemedText>
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

  {
    summary.ranked.map((c) => (
      <ShareBar key={c.id} name={c.name} balance={c.balance} share={c.share} />
    ));
  }

  return (
    <ThemedView style={{ flex: 1, gap: 12 }}>
      <SafeAreaView
        style={{ flex: 1, maxWidth: MaxContentWidth, width: "100%" }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: Spacing.four,
            paddingTop:
              Platform.OS === "web"
                ? Spacing.six + Spacing.three
                : Spacing.four,
            paddingBottom: BottomTabInset + Spacing.four,
            gap: Spacing.four,
          }}
        >
          <ThemedView style={{ gap: Spacing.two }}>
            <ThemedText style={{ fontSize: 12 }}>
              Harvey Tyson Ablen | MobComp 2
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 64,
                fontWeight: 600,
                lineHeight: 64,
              }}
            >
              Pautang Mo Diri
            </ThemedText>
          </ThemedView>
          <ThemedView
            type="backgroundElement"
            style={{
              borderRadius: Spacing.four,
              padding: Spacing.four,
              gap: Spacing.four,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stat
                label="Total Owed"
                value={`₱ ${summary.total.toFixed(2)}`}
              />
              <Stat
                label="Average Owed"
                value={`₱ ${summary.average.toFixed(2)}`}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stat
                label="Still Owing"
                value={`${summary.owing} of ${summary.count}`}
              />
              <Stat label="Settled" value={String(summary.settled)} />
            </View>
          </ThemedView>

          <ThemedView
            type="backgroundElement"
            style={{
              borderRadius: Spacing.four,
              padding: Spacing.four,
              gap: Spacing.four,
            }}
          >
            <ThemedText type="small" themeColor="textSecondary">
              Amount owed per customer
            </ThemedText>
            {summary.ranked.map((c) => (
              <ShareBar
                key={c.id}
                name={c.name}
                balance={c.balance}
                share={c.share}
              />
            ))}
            {summary.ranked.length === 0 && (
              <ThemedText themeColor="textSecondary">
                Everyone has paid up.
              </ThemedText>
            )}
          </ThemedView>

          <Link href="/customers" asChild>
            <Pressable
              style={{
                backgroundColor: "#3c87f7",
                borderRadius: Spacing.three,
                paddingVertical: Spacing.three,
                alignItems: "center",
              }}
            >
              <ThemedText style={{ fontSize: 18 }}>View Customers</ThemedText>
            </Pressable>
          </Link>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
