import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { basicAuthLoginRestore, basicAuthRestoreAccess } from '@/rest/authAPI';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserRestoreAccessScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();

    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingWin, setLoadingWin] = useState<boolean>(false);
    const [isSend, setIsSend] = useState<boolean>(false);

    const handleLoginRestore = async () => {
        try {
            setLoadingWin(true);
            await basicAuthLoginRestore();

            router.replace('/')
        } finally {
            setLoadingWin(false)
        }
    }

    useEffect(() => {
        handleLoginRestore();
    }, [])

    useFocusEffect(
        useCallback(() => {
            handleLoginRestore();
        }, [])
    )

    const handleRestore = async () => {
        try {
            setLoading(true);
            await basicAuthRestoreAccess(email);

            setIsSend(true);
        } finally {
            setLoading(false);
        }
    }

    if (loadingWin) {
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
        <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#eee' }]}>
            <View style={styles.inner}>
                {isSend ? (
                    <View style={{ flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <IconSymbol size={88} name="mark-email-unread" color={colorScheme === "dark" ? "#fff" : "#000"} />

                        <ThemedText type="title" style={[styles.title, { marginTop: 20 }]}>
                            Check your email
                        </ThemedText>

                        <Text style={[{ color: colorScheme === 'dark' ? '#999' : '#999', maxWidth: '85%', fontSize: 16, textAlign: 'center', lineHeight: 23 }]}>
                            We have sent you an email, check <Text style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}>{email}</Text>
                        </Text>

                        <TouchableOpacity
                            onPress={async () => await Linking.openURL('mailto:')}
                            style={[styles.button, { backgroundColor: colorScheme === 'dark' ? '#fff' : '#000', marginTop: 40 }]}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={colorScheme === 'dark' ? '#000' : '#fff'} />
                            ) : (
                                <Text style={[styles.buttonText, { color: colorScheme === 'dark' ? '#000' : '#fff' }]}>Open email app</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setIsSend(false)}>
                            <ThemedText style={{ fontSize: 14, marginTop: 20 }}>
                                Resend email
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                ) : (
                    <>
                        <Image source={require('@/assets/images/sub-icon-base.png')} style={{ maxWidth: 100, maxHeight: 100, marginBottom: 30, borderRadius: 25 }} />

                        <ThemedText type="title" style={styles.title}>
                            Restoring my account
                        </ThemedText>

                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            style={{
                                color: colorScheme === 'dark' ? '#fff' : '#000',
                                width: '100%',
                                backgroundColor: colorScheme === 'dark' ? '#1d1d1dff' : '#f9f9f9',
                                borderWidth: 1,
                                marginHorizontal: 10,
                                marginBottom: 15,
                                fontSize: 15,
                                borderRadius: 13,
                                height: 55,
                                paddingHorizontal: 15,
                                borderColor: colorScheme === 'dark' ? '#444' : '#dfdfdfff',
                            }}
                            placeholder="Write here your account email"
                            placeholderTextColor={colorScheme === 'dark' ? '#949494ff' : '#949494ff'}
                        />

                        <TouchableOpacity
                            onPress={handleRestore}
                            style={[styles.button, { backgroundColor: colorScheme === 'dark' ? '#fff' : '#000' }]}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color={colorScheme === 'dark' ? '#fff' : '#000'} />
                            ) : (
                                <Text style={[styles.buttonText, { color: colorScheme === 'dark' ? '#000' : '#fff' }]}>Receive an email</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/user-create')}>
                            <Text style={[{ color: colorScheme === 'dark' ? '#999' : '#999', marginTop: 20, fontSize: 16 }]}>Create new account</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 25,
        fontWeight: '600',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        height: 50,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        width: '100%',
        borderRadius: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
