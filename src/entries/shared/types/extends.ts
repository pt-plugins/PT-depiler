export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type AugmentedRequired<T extends object, K extends keyof T = keyof T> = Omit<T, K> & Required<Pick<T, K>>;
