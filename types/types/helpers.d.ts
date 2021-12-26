export declare type Maybe<T> = T | null | undefined;
export declare type Either<Left, Right> = Left | Right;
export declare type Nullable<T> = T | null;
export declare type Class<T> = {
    new (...args: any[]): T;
};
export interface RangeOptions {
    start: number;
    end: Nullable<number>;
    step: number;
}
export interface JoinOptions<T> {
    /**
     * What to prefix the joined string with
     */
    prefix: string;
    /**
     * What to use between items
     */
    separator: string;
    /**
     * What to append at the end of the joined string
     */
    suffix: string;
    /**
     * The function that transforms the item into its string representation
     */
    stringifier: (item: T) => string;
}
