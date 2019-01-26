export type Fn<R, T> = (t: T) => R;
export type BiFn<R, T, U> = (t: T, u: U) => R;

export type Producer<T> = () => T;
export type Consumer<T> = Fn<void, T>;
export type Predicate<T> = Fn<boolean, T>;
export type Mapper<T, U> = Fn<U, T>;
export type Reducer<Acc, Elem> = BiFn<Acc, Acc, Elem>;
export type Callback = () => void;