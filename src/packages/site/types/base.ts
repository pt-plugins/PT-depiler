// Error classes
export class NeedLoginError extends Error {}
export class NoTorrentsError extends Error {}

export type TSiteID = string; // should match regexp /[0-9a-z]+/
export type TSiteHost = string;

export type TSiteFullUrl = `${"http" | "https"}://${TSiteHost}/`;
export type TSiteFullUrlProtect = `aHR0c${string}`; // btoa('http') -> "aHR0cA=="
export type TSiteUrl = TSiteFullUrl | TSiteFullUrlProtect;
