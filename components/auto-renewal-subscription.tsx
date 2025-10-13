import { useColorScheme } from "@/hooks/use-color-scheme";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol";

const AutoRenewalSubscription = () => {
    const colorScheme = useColorScheme();

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            style={{
                position: 'absolute',
                width: '100%',
                bottom: 0,
                backgroundColor: colorScheme === 'dark' ? '#092341ff' : '#cbd9e9ff',
                borderWidth: 1,
                borderColor: colorScheme === 'dark' ? '#0077ffff' : '#abd1fdff',
                paddingHorizontal: 45,
                paddingVertical: 15,
                borderRadius: 25,
            }}
        >
            <View style={{ alignSelf: 'center', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                <IconSymbol size={28} name="auto-fix-high" color={colorScheme === "dark" ? "#fff" : "#555"} />

                <View style={{ width: 1, height: 57, backgroundColor: '#555', marginHorizontal: 7, marginLeft: 20 }} />

                <View>
                    <ThemedText style={{ fontSize: 14 }}>Start auto-renewal subscription</ThemedText>
                    <ThemedText style={{ fontSize: 11, maxWidth: '90%' }}>
                        Automatically track and renew your subscriptions.
                    </ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default AutoRenewalSubscription
