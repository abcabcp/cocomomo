import { isClient } from './device';

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

export const getCurrentTime = (): {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
} => {
  if (!isClient()) return { hour: 0, minute: 0, period: 'AM' };
  const now = new Date();
  return parseTimeString(`${now.getHours()}:${now.getMinutes()}`);
};

export const calculateTimeOffset = (selectedTime: {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}): number => {
  const now = new Date();
  const userHour =
    selectedTime.period === 'PM' && selectedTime.hour < 12
      ? selectedTime.hour + 12
      : selectedTime.period === 'AM' && selectedTime.hour === 12
        ? 0
        : selectedTime.hour;

  const userDate = new Date();
  userDate.setHours(userHour, selectedTime.minute, 0, 0);

  return Math.floor((userDate.getTime() - now.getTime()) / 1000);
};

export const adjustTimeByOffset = (
  offsetInSeconds: number,
): { hour: number; minute: number; period: 'AM' | 'PM' } => {
  const now = new Date();
  const offsetTime = new Date(now.getTime() + offsetInSeconds * 1000);
  return parseTimeString(`${offsetTime.getHours()}:${offsetTime.getMinutes()}`);
};
