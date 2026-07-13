export type Memory = {
  id: string;
  image: string;
  title: string;
  text: string;
  radius: number;
  angle: number;
  speed: number;
  y: number;
  size: number;
};

export type NeonText = {
  text: string;
  radius: number;
  angle: number;
  y: number;
  size: number;
};

export const loveConfig = {
  recipientName: "Ботагоз",
  shortName: "Боташка",
  title: "Galaxy Gallery",
  subtitle: "CLICK TO START",
  startButton: "START",
  musicSrc: "/music/love.mp3",
};

export const memories: Memory[] = [
  {
    id: "m1",
    image: "/images/love/photo1.jpg",
    title: "Самая милая улыбка",
    text: "Этот момент хочется сохранить навсегда.",
    radius: 5.15,
    angle: 0.1,
    speed: 0.08,
    y: 1.28,
    size: 0.82,
  },
  {
    id: "m2",
    image: "/images/love/photo2.jpg",
    title: "Моя Боташка",
    text: "Ты умеешь делать обычный день теплее.",
    radius: 6.35,
    angle: 0.9,
    speed: 0.065,
    y: 1.55,
    size: 0.62,
  },
  {
    id: "m3",
    image: "/images/love/photo3.jpg",
    title: "Особенный момент",
    text: "Некоторые воспоминания становятся маленьким светом внутри.",
    radius: 4.85,
    angle: 1.8,
    speed: 0.09,
    y: 1.2,
    size: 1.02,
  },
  {
    id: "m4",
    image: "/images/love/photo4.jpg",
    title: "Твоя нежность",
    text: "В тебе есть что-то очень доброе и настоящее.",
    radius: 7.35,
    angle: 2.6,
    speed: 0.055,
    y: 1.85,
    size: 0.72,
  },
  {
    id: "m5",
    image: "/images/love/photo5.jpg",
    title: "Сен ерекше жансың",
    text: "Бұл кішкентай әлем — тек сен үшін.",
    radius: 5.75,
    angle: 3.5,
    speed: 0.075,
    y: 1.38,
    size: 0.64,
  },
  {
    id: "m6",
    image: "/images/love/photo6.jpg",
    title: "Причина улыбки",
    text: "Пусть у тебя всегда будет повод улыбаться.",
    radius: 7.9,
    angle: 4.2,
    speed: 0.06,
    y: 1.26,
    size: 0.88,
  },
  {
    id: "m7",
    image: "/images/love/photo7.jpg",
    title: "Маленькое счастье",
    text: "Пусть рядом всегда будет тепло.",
    radius: 8.45,
    angle: 5.1,
    speed: 0.05,
    y: 1.72,
    size: 0.66,
  },
  {
    id: "m8",
    image: "/images/love/photo8.jpg",
    title: "Тек сен үшін",
    text: "Этот маленький мир создан только для тебя.",
    radius: 6.8,
    angle: 5.8,
    speed: 0.085,
    y: 1.14,
    size: 0.78,
  },
];

export const neonTexts: NeonText[] = [
  { text: "ALWAYS WITH YOU", radius: 6.7, angle: 0.25, y: 0.62, size: 0.46 },
  { text: "INFINITE ∞", radius: 7.8, angle: 1.35, y: 0.58, size: 0.52 },
  { text: "ETERNAL LOVE ✦", radius: 5.8, angle: 2.55, y: 0.66, size: 0.48 },
  { text: "MY HEART IS YOURS", radius: 8.4, angle: 3.55, y: 0.6, size: 0.5 },
  { text: "FOREVER", radius: 6.2, angle: 4.45, y: 0.7, size: 0.42 },
  { text: "BOTASHKA", radius: 7.3, angle: 5.35, y: 0.64, size: 0.46 },
];
