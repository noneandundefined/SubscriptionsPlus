import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

type NotificationItemProps = {
    name: string;
    price: number;
    date_pay: string;
    date_notify_one: string | null;
    date_notify_two: string | null;
    date_notify_three: string | null;
    onMenuPress?: () => void;
};

export const SubscriptionItem: React.FC<NotificationItemProps> = ({
    name,
    price,
    date_pay,
    date_notify_one,
    date_notify_two,
    date_notify_three,
    onMenuPress,
}) => {
    return (
        <ThemedView style={styles.row}>
            <View style={styles.row_left}>
                <View style={styles.date_notify}>
                    <ThemedText style={styles.date_notify_text}>{date_notify_one?.split('.')[0]}</ThemedText>
                </View>

                <View>
                    <ThemedText>{name}</ThemedText>
                    <ThemedText style={styles.text_mini}>{date_pay} - {price}</ThemedText>
                </View>
            </View>

            <TouchableOpacity onPress={onMenuPress}>
                <IconSymbol size={22} name="menu" color="#888" />
            </TouchableOpacity>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 25,
        paddingHorizontal: 15,
        margin: 4,
        borderRadius: 10
    },
    row_left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    text_mini: {
        fontSize: 13,
        color: "#888"
    },
    date_notify: {
        backgroundColor: "#555",
        padding: 12,
        borderRadius: 100,
        cursor: 'pointer',
    },
    date_notify_text: {
        fontWeight: 700
    }
})
