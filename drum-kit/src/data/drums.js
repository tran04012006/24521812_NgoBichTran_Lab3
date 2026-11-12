
export const DRUMS = [
  {
    id: "kick",
    name: "Kick",
    key: "W",
    code: "KeyW",
    color: "teal",
  },
  {
    id: "snare",
    name: "Snare",
    key: "A",
    code: "KeyA",
    color: "blue",
  },
  {
    id: "closed-hat",
    name: "Hi-Hat",
    key: "S",
    code: "KeyS",
    color: "amber",
  },
  {
    id: "open-hat",
    name: "Open Hat",
    key: "D",
    code: "KeyD",
    color: "violet",
  },
  {
    id: "tom",
    name: "Tom",
    key: "J",
    code: "KeyJ",
    color: "rose",
  },
  {
    id: "clap",
    name: "Clap",
    key: "K",
    code: "KeyK",
    color: "green",
  },
  {
    id: "crash",
    name: "Crash",
    key: "L",
    code: "KeyL",
    color: "pink",
  },
];

export const PAD_BY_CODE = Object.fromEntries(
  DRUMS.map((drum) => [drum.code, drum.id])
);
