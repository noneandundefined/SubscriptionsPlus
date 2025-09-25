import { FlatList, StyleSheet } from 'react-native';

import { SubscriptionItem } from '@/components/subscription-item';
import { Subscription } from '@/interfaces/SubscriptionInterface';

const SUB_DATA: Subscription[] = [
  { id: '1', name: 'Subscription A', price: 10, date_pay: '25.09.2025', date_notify_one: '22.09.2025', date_notify_two: null, date_notify_three: null },
  { id: '2', name: 'Subscription A', price: 10, date_pay: '25.09.2025', date_notify_one: '22.09.2025', date_notify_two: null, date_notify_three: null },
  { id: '3', name: 'Subscription A', price: 10, date_pay: '25.09.2025', date_notify_one: '22.09.2025', date_notify_two: null, date_notify_three: null },
  { id: '4', name: 'Subscription A', price: 10, date_pay: '25.09.2025', date_notify_one: '22.09.2025', date_notify_two: null, date_notify_three: null },
  { id: '5', name: 'Subscription A', price: 10, date_pay: '25.09.2025', date_notify_one: '22.09.2025', date_notify_two: null, date_notify_three: null },
  { id: '6', name: 'Subscription A', price: 10, date_pay: '25.09.2025', date_notify_one: '22.09.2025', date_notify_two: null, date_notify_three: null },
  { id: '7', name: 'Subscription A', price: 10, date_pay: '25.09.2025', date_notify_one: '22.09.2025', date_notify_two: null, date_notify_three: null },
  { id: '8', name: 'Subscription A', price: 10, date_pay: '25.09.2025', date_notify_one: '22.09.2025', date_notify_two: null, date_notify_three: null },
  { id: '9', name: 'Subscription A', price: 10, date_pay: '25.09.2025', date_notify_one: '22.09.2025', date_notify_two: null, date_notify_three: null },
]

export default function HomeScreen() {
  return (
    <FlatList
      data={SUB_DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SubscriptionItem name={item.name} price={item.price} date_pay={item.date_pay} date_notify_one={item.date_notify_one} date_notify_two={item.date_notify_two} date_notify_three={item.date_notify_three} onMenuPress={() => alert(`Menu pressed for ${item.name}`)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
