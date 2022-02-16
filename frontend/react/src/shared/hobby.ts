export enum Hobbies {
  "baseball",
  "basketball",
  "cooking",
  "gaming",
  "hiking",
  "knitting",
  "reading",
  "running",
  "soccer",
  "tennis",
}

export type Hobby = keyof typeof Hobbies;
