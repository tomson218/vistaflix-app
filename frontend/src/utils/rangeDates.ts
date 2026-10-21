export const rangeDates = (): Date[] => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const twoWeeksLater = new Date(today);
	twoWeeksLater.setDate(today.getDate() + 14);

	return [today, twoWeeksLater];
};
