import { Vector3 } from 'three';

type SeaPreset = {
  skyColor: Vector3;
  skyTopColor: Vector3;
  seaBaseColor: Vector3;
  seaWaterColor: Vector3;
  sunPosition: Vector3;
  moonPosition: Vector3;
  moonBrightness: number;
  starBrightness: number;
  waveHeight: number;
  waveSpeed: number;
  waveChoppy: number;
};

export const SEA_TIME_PRESETS = {
  dawn: {
    skyColor: new Vector3(0.28, 0.26, 0.25),
    skyTopColor: new Vector3(0.02, 0.07, 0.32),
    seaBaseColor: new Vector3(0.15, 0.1, 0.28),
    seaWaterColor: new Vector3(0.06, 0.06, 0.15),
    sunPosition: new Vector3(-0.8, -0.4, -0.2),
    moonPosition: new Vector3(0, 0.3, -0.5),
    moonBrightness: 0.8,
    starBrightness: 0.8,
    waveHeight: 0.35,
    waveSpeed: 0.6,
    waveChoppy: 1.35,
  },
  sunrise: {
    skyColor: new Vector3(0.8, 0.4, 0.3),
    skyTopColor: new Vector3(0.6, 0.3, 0.7),
    seaBaseColor: new Vector3(0.1, 0.1, 0.2),
    seaWaterColor: new Vector3(0.5, 0.3, 0.2),
    sunPosition: new Vector3(-0.2, 0, -0.8),
    moonPosition: new Vector3(-0.5, -0.2, 0),
    moonBrightness: 0.1,
    starBrightness: 0.1,
    waveHeight: 0.4,
    waveSpeed: 0.5,
    waveChoppy: 0.8,
  },
  morning: {
    skyColor: new Vector3(0.8, 0.69, 0.57),
    skyTopColor: new Vector3(0.19, 0.47, 1),
    seaBaseColor: new Vector3(0.05, 0.15, 0.3),
    seaWaterColor: new Vector3(0.2, 0.5, 0.7),
    sunPosition: new Vector3(0, 0.3, -0.83),
    moonPosition: new Vector3(-0.8, -0.3, 0),
    moonBrightness: 0,
    starBrightness: 0,
    waveHeight: 0.5,
    waveSpeed: 0.8,
    waveChoppy: 1,
  },
  afternoon: {
    skyColor: new Vector3(0.95, 1, 0.93),
    skyTopColor: new Vector3(0.4, 0.62, 0.93),
    seaBaseColor: new Vector3(0.1, 0.25, 0.45),
    seaWaterColor: new Vector3(0.4, 0.7, 0.9),
    sunPosition: new Vector3(0, 0.4, -0.8),
    moonPosition: new Vector3(-0.7, -0.4, 0),
    moonBrightness: 0,
    starBrightness: 0,
    waveHeight: 0.6,
    waveSpeed: 1,
    waveChoppy: 1.1,
  },
  sunset: {
    skyColor: new Vector3(0.9, 0.4, 0.2),
    skyTopColor: new Vector3(0.6, 0.2, 0.5),
    seaBaseColor: new Vector3(0.2, 0.1, 0.1),
    seaWaterColor: new Vector3(0.5, 0.3, 0.2),
    sunPosition: new Vector3(0.2, 0, -0.8),
    moonPosition: new Vector3(-0.2, 0.1, -0.83),
    moonBrightness: 0.5,
    starBrightness: 0.1,
    waveHeight: 0.4,
    waveSpeed: 0.6,
    waveChoppy: 0.9,
  },
  night: {
    skyColor: new Vector3(0, 0, 0),
    skyTopColor: new Vector3(0.1, 0.19, 0.36),
    seaBaseColor: new Vector3(0.31, 0.3, 0.33),
    seaWaterColor: new Vector3(0.06, 0.06, 0.15),
    sunPosition: new Vector3(-0.9, -0.5, -0.64),
    moonPosition: new Vector3(0, 0.3, -0.83),
    moonBrightness: 1,
    starBrightness: 0.8,
    waveHeight: 0.3,
    waveSpeed: 0.6,
    waveChoppy: 0.7,
  },
} satisfies Record<string, SeaPreset>;

export const ANIMATION_DURATION = 2;

export type PresetName = keyof typeof SEA_TIME_PRESETS;

const SCHEDULE: [number, PresetName][] = [
  [180, 'dawn'],
  [300, 'sunrise'],
  [420, 'morning'],
  [720, 'afternoon'],
  [1020, 'sunset'],
  [1140, 'night'],
];

export const presetForMinutes = (m: number): PresetName => {
  let name: PresetName = 'night';
  for (const [start, preset] of SCHEDULE) if (m >= start) name = preset;
  return name;
};
