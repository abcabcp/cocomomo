export type TimeOfDay = { hour: number; minute: number; period: 'AM' | 'PM' };

export const toMinutes = ({ hour, minute, period }: TimeOfDay) =>
  ((hour % 12) + (period === 'PM' ? 12 : 0)) * 60 + minute;

export const fromMinutes = (m: number): TimeOfDay => {
  const h24 = Math.floor(m / 60) % 24;
  return {
    hour: h24 % 12 || 12,
    minute: m % 60,
    period: h24 >= 12 ? 'PM' : 'AM',
  };
};

export const nowMinutes = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

export const pad = (n: number) => String(n).padStart(2, '0');
