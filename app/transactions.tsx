import { ThemedText } from "@/components/themed-text";
import TransactionEmpty from "@/components/transaction-empty";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { basicTransactionsHistory, TransactionResponse } from "@/rest/transactionAPI";
import { formatDateUS } from "@/utils/DayUtils";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionsScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();

    const [loading, setLoading] = useState<boolean>(true);
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);

    const handle = async () => {
        try {
            const res = await basicTransactionsHistory();
            setTransactions(res);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handle();
    }, []);

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
                }}
            >
                <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
            <View style={styles.container}>
                <View style={styles.topRow}>
                    <TouchableOpacity
                        style={[styles.backCircle, { backgroundColor: colorScheme === 'dark' ? '#1c1f21' : '#eee' }]}
                        onPress={() => router.back()}
                    >
                        <IconSymbol size={25} name="chevron-left" color={colorScheme === 'dark' ? '#525252ff' : '#b4b4b4ff'} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Transactions</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <FlatList
                    data={transactions}
                    keyExtractor={(item: TransactionResponse) => String(item.id)}
                    renderItem={({ item }) => <TransactionItem item={item} />}
                    contentContainerStyle={{ paddingVertical: 10 }}
                    ListEmptyComponent={<TransactionEmpty />}
                    refreshing={loading}
                    onRefresh={handle}
                />
            </View>
        </SafeAreaView>
    )
}

const TransactionItem = ({ item }: { item: TransactionResponse }) => {
    const colorScheme = useColorScheme();

    return (
        <TouchableOpacity activeOpacity={0.7} style={[styles.item, {
            backgroundColor: colorScheme === 'dark' ? '#1d1d1dff' : '#f9f9f9',
            borderWidth: 1,
            borderColor: colorScheme === 'dark' ? '#444' : '#dfdfdfff',
        }]}>
            <View style={{ flex: 1, marginLeft: 10 }}>
                <ThemedText style={styles.token}>{item.x_token}</ThemedText>
                <Text style={styles.status}>{item.status}</Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.amount, { color: item.status === 'success' ? "#0e920eff" : item.status === "failed" ? "#920e0eff" : "#ac610bff" }]}>
                    {item.amount} RUB
                </Text>
                <Text style={styles.date}>{formatDateUS(item.created_at)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 10
    },
    topRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
        marginBottom: 18,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    backCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 14,
        marginBottom: 10,
        width: '100%'
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f1f2f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    token: {
        fontWeight: 400,
        fontSize: 15,
    },
    status: {
        fontSize: 13,
        color: '#9ca3af',
    },
    amount: {
        fontWeight: '600',
        fontSize: 15,
    },
    date: {
        fontSize: 12,
        color: '#9ca3af',
    },

})
