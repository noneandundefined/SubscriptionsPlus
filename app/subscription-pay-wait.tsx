import CardPay from '@/components/pay/card-pay';
import LinkPay from '@/components/pay/link-pay';
import QRCodePay from '@/components/pay/qrcode-pay';
import TimerTransaction from '@/components/timer-transaction';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { basicTransactionsSubscriptionGetByXToken, TransactionResponse } from '@/rest/transactionAPI';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubscriptionPayWaitScreen() {
    const router = useRouter();
    const params = useSearchParams();
    const colorScheme = useColorScheme();

    const [isTimeOver, setIsTimeOver] = useState<boolean>(false);
    const [varPay, setVarPay] = useState<string>('card'); // card, link, qr-code

    const [loading, setLoading] = useState<boolean>(true);
    const [transaction, setTransaction] = useState<TransactionResponse | null>(null);

    useEffect(() => {
        const handle = async () => {
            try {
                const res = await basicTransactionsSubscriptionGetByXToken(params.get('xtoken') ?? '');
                setTransaction(res);
            } finally {
                setLoading(false);
            }
        };

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

    if (!transaction) {
        router.push('/');
        return;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000000ff' : '#f9fbff', flex: 1 }]}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TimerTransaction
                        createdAt={transaction.created_at}
                        endedAt={transaction.ended_at}
                        color={colorScheme === 'dark' ? '#fff' : '#000'}
                        onTimerEnd={() => setIsTimeOver(true)}
                    />

                    <TouchableOpacity activeOpacity={0.6} style={styles.statusBadge}>
                        <View style={styles.dot} />
                        <Text style={styles.statusText}>{transaction.status}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.subtext}>Wait for the payment confirmation</Text>

                <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#18191dff' : '#fff' }]}>
                    <Text style={[styles.cardTitle, { color: colorScheme === 'dark' ? '#7aa4ffff' : '#111827' }]}>SUB PREMIUM</Text>
                    <Text style={styles.cardDescription}>Please pay for your subscription using the provided details to confirm.</Text>

                    <View style={[styles.alertBox, { gap: 2 }]}>
                        <Text style={styles.alertText}>Payment verification in progress</Text>
                        <Text style={styles.alertSubtext}>
                            Please wait for the timer to expire. The check usually takes only a few minutes.
                        </Text>
                    </View>

                    {isTimeOver ? (
                        <View style={{ marginTop: 30, alignItems: 'center' }}>
                            <Text
                                style={{
                                    color: colorScheme === 'dark' ? '#fff' : '#000',
                                    fontSize: 14,
                                    fontWeight: '500',
                                    textAlign: 'center',
                                    lineHeight: 22,
                                }}
                            >
                                Your subscription was created successfully. Please wait a few minutes for activation.
                            </Text>
                        </View>
                    ) : (
                        <>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <TouchableOpacity
                                    onPress={() => setVarPay('card')}
                                    style={{
                                        padding: 30,
                                        borderWidth: 1,
                                        borderColor:
                                            varPay === 'card'
                                                ? colorScheme === 'dark'
                                                    ? '#fff'
                                                    : '#000'
                                                : colorScheme === 'dark'
                                                    ? '#585858ff'
                                                    : '#c5c5c5ff',
                                        borderRadius: 6,
                                    }}
                                >
                                    <IconSymbol
                                        size={30}
                                        name="credit-card"
                                        color={
                                            varPay === 'card'
                                                ? colorScheme === 'dark'
                                                    ? '#fff'
                                                    : '#000'
                                                : colorScheme === 'dark'
                                                    ? '#585858ff'
                                                    : '#c5c5c5ff'
                                        }
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setVarPay('link')}
                                    style={{
                                        padding: 30,
                                        borderWidth: 1,
                                        borderColor:
                                            varPay === 'link'
                                                ? colorScheme === 'dark'
                                                    ? '#fff'
                                                    : '#000'
                                                : colorScheme === 'dark'
                                                    ? '#585858ff'
                                                    : '#c5c5c5ff',
                                        borderRadius: 6,
                                    }}
                                >
                                    <IconSymbol
                                        size={30}
                                        name="link"
                                        color={
                                            varPay === 'link'
                                                ? colorScheme === 'dark'
                                                    ? '#fff'
                                                    : '#000'
                                                : colorScheme === 'dark'
                                                    ? '#585858ff'
                                                    : '#c5c5c5ff'
                                        }
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setVarPay('qr-code')}
                                    style={{
                                        padding: 30,
                                        borderWidth: 1,
                                        borderColor:
                                            varPay === 'qr-code'
                                                ? colorScheme === 'dark'
                                                    ? '#fff'
                                                    : '#000'
                                                : colorScheme === 'dark'
                                                    ? '#585858ff'
                                                    : '#c5c5c5ff',
                                        borderRadius: 6,
                                    }}
                                >
                                    <IconSymbol
                                        size={30}
                                        name="qr-code"
                                        color={
                                            varPay === 'qr-code'
                                                ? colorScheme === 'dark'
                                                    ? '#fff'
                                                    : '#000'
                                                : colorScheme === 'dark'
                                                    ? '#585858ff'
                                                    : '#c5c5c5ff'
                                        }
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginTop: 7 }}>
                                {varPay === 'card' && <CardPay transaction={transaction} />}

                                {varPay === 'link' && <LinkPay transaction={transaction} />}

                                {varPay === 'qr-code' && <QRCodePay transaction={transaction} />}
                            </View></>
                    )}
                </View>
            </ScrollView >
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff7ed',
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 17,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#f59e0b',
        marginRight: 6,
    },
    statusText: {
        fontSize: 13,
        color: '#92400e',
        fontWeight: '600',
    },
    subtext: {
        color: '#6b7280',
        fontSize: 12,
        marginTop: 4,
        marginBottom: 14,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#e5e7eb',
        borderRadius: 10,
        padding: 4,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: '#2563eb',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#475569',
    },
    tabTextActive: {
        color: '#fff',
    },
    card: {
        borderRadius: 16,
        padding: 18,
        marginTop: 18,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    cardTitle: {
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 1,
    },
    cardDescription: {
        color: '#6b7280',
        marginTop: 8,
        marginBottom: 20,
        lineHeight: 20,
    },
    alertBox: {
        backgroundColor: '#fff7ed',
        borderRadius: 10,
        padding: 12,
    },
    alertText: {
        color: '#b45309',
        fontWeight: '700',
        marginBottom: 4,
    },
    alertSubtext: {
        color: '#92400e',
        fontSize: 13,
        lineHeight: 18,
    },
});
