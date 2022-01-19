export enum Personalities {
  "introvert",
  "extrovert",
  "sensor",
  "intuitive",
  "thinker",
  "feeler",
  "judger",
  "perceiver",
}

export type Personality = keyof typeof Personalities;
