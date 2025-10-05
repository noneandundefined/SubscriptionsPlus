import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TimerTransactionProps {
	createdAt: string;
	endedAt: string;
	color: string;
	onTimerEnd?: () => void;
}

const parseLocal = (isoString: string) => {
	return new Date(isoString.replace('Z', '')).getTime();
};

const TimerTransaction = ({ createdAt, endedAt, color, onTimerEnd }: TimerTransactionProps) => {
	const [timeLeft, setTimeLeft] = useState<number>(60 * 60);

	useEffect(() => {
		const endTime = parseLocal(endedAt);
		const now = Date.now();

		let diff = Math.max(0, Math.floor((endTime - now) / 1000));
		setTimeLeft(diff);

		const interval = setInterval(() => {
			diff -= 1;
			setTimeLeft(diff > 0 ? diff : 0);
			if (diff <= 0) {
				clearInterval(interval);
				onTimerEnd?.();
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [createdAt, endedAt]);

	const formatTime = (seconds: number) => {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;

		return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	};

	return (
		<View style={styles.container}>
			<Text style={[styles.timer, { color: color }]}>{formatTime(timeLeft)}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
	},
	timer: {
		fontWeight: 500,
		fontSize: 20,
	},
});

export default TimerTransaction;
