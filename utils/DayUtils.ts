export const getNextNotifyDays = (date_notify_one?: string | null, date_notify_two?: string | null, date_notify_three?: string | null) => {
	const today = new Date();

	const notifyDates = [date_notify_one, date_notify_two, date_notify_three].filter((d): d is string => d !== null);

	const futureDates = notifyDates
		.map((d) => new Date(d))
		.filter((d) => d.getTime() >= today.getTime())
		.sort((a, b) => a.getTime() - b.getTime());

	if (futureDates.length === 0) return null;

	const next = futureDates[0];
	const diffMs = next.getTime() - today.getTime();
	const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

	return diffDays;
};

export const formatDateUS = (dateString?: string | null): string => {
	if (!dateString || dateString.startsWith('0001')) return '-';

	const date = new Date(dateString);

	const options: Intl.DateTimeFormatOptions = {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	};

	return date.toLocaleDateString('en-US', options).replace(',', ' -');
};

export const getNextPaymentDate = (datePay: string): string => {
	const payDate = new Date(datePay);
	const now = new Date();

	if (payDate < now) {
		const nextMonth = new Date(payDate);
		nextMonth.setMonth(payDate.getMonth() + 1);
		return nextMonth.toISOString();
	}

	return datePay;
};
