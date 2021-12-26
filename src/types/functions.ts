import { Either } from "./helpers";

export type Fn<R, T> = (input: T) => R;
export type BiFn<R, T, U> = (firstArg: T, secondArg: U) => R;

export type Producer<T> = () => T;
export type Consumer<T> = Fn<void, T>;
export type Predicate<T> = Fn<boolean, T>;
export type Mapper<T, U> = Fn<U, T>;
export type Reducer<Acc, Elem> = BiFn<Acc, Acc, Elem>;
export type Callback = () => void;

export type GeneratorMapper<T, U> = (source: Generator<T>) => Generator<U>;
export type FlatMapper<T, U> = Mapper<T, Either<U, Iterable<U>>>;
export type Comparator<T, U = T> = (lhs: T, rhs: U) => number;
