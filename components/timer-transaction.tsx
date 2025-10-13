import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TimerTransactionProps {
	createdAt: string;
	color: string;
	onTimerEnd?: () => void;
}

const parseLocal = (isoString: string) => {
	const utcDate = new Date(isoString);
	return utcDate.getTime() + utcDate.getTimezoneOffset() * 60 * 1000 * -1;
};

const TimerTransaction = ({ createdAt, color, onTimerEnd }: TimerTransactionProps) => {
	const [timeLeft, setTimeLeft] = useState<number>(60 * 60);

	useEffect(() => {
		const endTime = parseLocal(createdAt) + 60 * 60 * 1000;

		const updateTimer = () => {
			const now = Date.now();
			const diff = Math.max(0, Math.floor((endTime - now) / 1000));
			setTimeLeft(diff);
			if (diff <= 0) {
				onTimerEnd?.();
			}
		};

		updateTimer();

		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	}, [createdAt]);

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
