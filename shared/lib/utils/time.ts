export const formatTimeString = (
  hour: number,
  minute: number,
  period: 'AM' | 'PM',
): string => {
  let hour24 = hour;

  if (period === 'PM' && hour !== 12) hour24 += 12;
  if (period === 'AM' && hour === 12) hour24 = 0;

  const formattedHour = `${hour24}`.padStart(2, '0');
  const formattedMinute = `${minute}`.padStart(2, '0');

  return `${formattedHour}:${formattedMinute}`;
};

export const parseTimeString = (
  timeString: string,
): { hour: number; minute: number; period: 'AM' | 'PM' } => {
  const [hourStr, minuteStr] = timeString.split(':');
  const hour24 = Number.parseInt(hourStr, 10);
  const minute = Number.parseInt(minuteStr, 10);

  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return {
    hour: hour12,
    minute: Math.max(0, Math.min(59, minute || 0)),
    period,
  };
};
