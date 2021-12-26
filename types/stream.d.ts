import { Either, Nullable, Class, Maybe, JoinOptions, Comparator, Mapper, Predicate, Consumer, Reducer, FlatMapper, GeneratorMapper } from "./types/index";
import { RangeOptions } from "./types/helpers";
export declare class StreamElementNotFound extends Error {
}
export declare class Stream<T> implements Iterable<T> {
    protected gen: Generator<T>;
    /**
     * @inheritdoc
     */
    [Symbol.iterator](): Iterator<T, void, undefined>;
    /**
     * Wrap a {@link Generator} into a {@link Stream}
     * @param gen - The generator to wrap
     */
    private constructor();
    /**
     * Pipe a generator transform to the current stream
     * @param mapper - The generator mapper, it receives the current's stream generator as argument
     * @returns A {@link Stream} that wraps the mapped generator
     */
    protected pipe<U>(mapper: GeneratorMapper<T, U>): Stream<U>;
    /**
     * Create a {@link Stream} from an {@link Iterable}
     * @param iter - The iterable to wrap in a Stream
     * @tag [CREATOR]
     */
    static fromIterable<T>(iter: Iterable<T>): Stream<T>;
    /**
     * Create a {@link Stream} of {@link String} from the input string, split by the given separator
     * @param inputStr - The input string to split
     * @param separator - The separator to use in order to split {@link inputStr}
     * @param removeEmptyStrings - Whether or not empty strings should be removed (defaults to true)
     * @tag [CREATOR]
     */
    static splitBy(inputStr: string, separator?: string, removeEmptyStrings?: boolean): Stream<string>;
    /**
     * Create a {@link Stream} of {@link String} from the input string, split using the given regex
     * @param inputStr - The input string to split
     * @param regex - The {@link RegExp} to use in order to split {@link inputStr}
     * @param removeEmptyStrings - Whether or not empty strings should be removed (defaults to true)
     * @tag [CREATOR]
     */
    static splitByRegex(inputStr: string, regex: RegExp, removeEmptyStrings?: boolean): Stream<string>;
    /**
     * Create a range of numbers
     * @param options
     * @param options.start - The starting number of the range/interval
     * @param options.end - The end number of the range/interval (defaults to null to be infinite)
     * @param options.step - The step to increment by (can be positive even if start > end and it'll keep the semantics of a decreasing sequence)
     * @tag [CREATOR]
     */
    static range({ start, end, step, }?: Partial<RangeOptions>): Stream<number>;
    /**
     * Create an infinite range of numbers
     * @param options
     * @param options.start - The starting number of the range/interval
     * @param options.step - The step to increment by (can be positive even if start > end and it'll keep the semantics of a decreasing sequence)
     * @tag [CREATOR]
     */
    static infinite(start?: number, step?: number): Stream<number>;
    /**
     * Filter the stream to keep only items that satisfy the given predicate
     * @param predicate
     * @tag [OPERATOR: Stateless Operation]
     */
    filter(predicate: Predicate<T>): Stream<T>;
    /**
     * Filter the stream to keep only items that do not satisfy the given predicate
     * @param predicate
     * @tag [OPERATOR: Stateless Operation]
     */
    filterNot(predicate: Predicate<T>): Stream<T>;
    /**
     * Map each individual item of the stream
     * @param mapper - The mapper function used to transform each individual item
     * @tag [OPERATOR: Stateless Operation]
     */
    map<U>(mapper: Mapper<T, U>): Stream<U>;
    /**
     * Flatten this sequence of iterables to a sequence of item
     * @tag [OPERATOR: Stateless Operation]
     */
    flatten<E>(this: Stream<Either<E, Iterable<E>>>): Stream<E>;
    /**
     * Map then flatten
     * @param mapper - The function to use to transform each item into an iterable
     * @tag [OPERATOR: Stateless Operation]
     */
    flatMap<U>(mapper: FlatMapper<T, U>): Stream<U>;
    /**
     * Flatten the stream, then map
     * @param mapper - The mapper function used to transform each individual item
     * @tag [OPERATOR: Stateless Operation]
     */
    mapFlattened<E, U>(this: Stream<Either<E, Iterable<E>>>, mapper: Mapper<E, U>): Stream<U>;
    /**
     * Filter a sequence to objects that are instances of the given class
     * @param clazz - The class (or constructor function) to be an instance of
     * @tag [OPERATOR: Stateless Operation]
     */
    instanceOf<U>(clazz: Class<U>): Stream<T>;
    /**
     * Typescript utility that does the same job as {@link Stream#instanceOf} but also casts each item
     * @tag [OPERATOR: Stateless Operation]
     */
    asInstanceOf<U>(clazz: Class<U>): Stream<U>;
    /**
     * Filter a sequence to items that are not instances of the given class
     * @param clazz - The class (or constructor function) to not be an instance of
     * @tag [OPERATOR: Stateless Operation]
     */
    notInstanceOf<U>(clazz: Class<U>): Stream<T>;
    /**
     * Filter out the null values
     * @tag [OPERATOR: Stateless Operation]
     */
    notNull(this: Stream<Nullable<T>>): Stream<T>;
    /**
     * Filter out the nullish values (i.e. those affected by the ?? and ?. operators)
     * @tag [OPERATOR: Stateless Operation]
     */
    notNullish(this: Stream<Maybe<T>>): Stream<T>;
    /**
     * Execute a callback on each item before passing it along
     * @param callback - The function to call on each item
     * @tag [OPERATOR: Stateless Operation]
     */
    peek(callback: Consumer<T>): Stream<T>;
    /**
     * Skip items while they satisfy the given predicate
     * @param predicate - The predicate to not satisfy for an item to be kept
     * @tag [OPERATOR: Stateless Operation]
     */
    skipWhile(predicate: Predicate<T>): Stream<T>;
    /**
     * Skip items until the given predicate is satisfied
     * @param predicate - The predicate to satisfy
     * @tag [OPERATOR: Stateless Operation]
     */
    skipUntil(predicate: Predicate<T>): Stream<T>;
    /**
     * Skip at most {@link maxAmount} items
     * @param maxAmount - The maximum amount of items to skip
     * @tag [OPERATOR: Stateless Operation]
     */
    skip(maxAmount: number): Stream<T>;
    /**
     * Yield items while the given predicate is satisfied
     * @param predicate - The predicate to satisfy to keep yielding items
     * @tag [OPERATOR: Stateless Operation]
     */
    takeWhile(predicate: Predicate<T>): Stream<T>;
    /**
     * Yield items until the predicate is satisfied
     * @param predicate - The predicate to not satisfy to keep yielding items
     * @tag [OPERATOR: Stateless Operation]
     */
    takeUntil(predicate: Predicate<T>): Stream<T>;
    /**
     * Yield at most {@link maxAmount} items (makes infinite {@link Stream} finite)
     * @param maxAmount - The maximum amount of items to yield
     * @tag [OPERATOR: Stateless Operation]
     */
    take(maxAmount: number): Stream<T>;
    /**
     * Take a substream/window that starts at the given {@link startIndex} and ends at (or before) {@link maxEndIndex}
     * @param startIndex - The index of the first item to yield
     * @param maxEndIndex - The maximum index of the last item to yield
     * @tag [OPERATOR: Stateless Operation]
     */
    substream(startIndex: number, maxEndIndex: number): Stream<T>;
    /**
     * Yield all values from this {@link Stream} and then yield the values of the given {@link Iterable}
     * @param iter - The iterable to yield values from once the stream as yielded all its values
     * @tag [OPERATOR: Stateless Operation]
     */
    then(iter: Iterable<T>): Stream<T>;
    /**
     * Only keep the truthy values
     * @tag [OPERATOR: Stateless Operation]
     */
    truthy(): Stream<T>;
    /**
     * Only keep the falsy values
     * @tag [OPERATOR: Stateless Operation]
     */
    falsy(): Stream<T>;
    /**
     * Zip values of this {@link Stream} with values of the given {@link Iterable}
     * @param iter - The iterable to zip with
     * @returns A stream of pairs whose length is the length of the smallest between this stream and the provided {@link iter}
     * @tag [OPERATOR: Stateless Operation]
     */
    zipWith<U>(iter: Iterable<U>): Stream<[T, U]>;
    /**
     * Split the stream into chunks of at most {@link maxSize} items per chunk
     * @param maxSize - The maximum amount of item per chunk
     * @tag [OPERATOR: Stateless Operation]
     */
    chunks(maxSize: number): Stream<T[]>;
    /**
     * Reverse the stream's items' order (eager operation)
     * @tag [OPERATOR: Stateful Operation]
     */
    reverse(): Stream<T>;
    /**
     * Sort the stream with the given comparator (eager operation)
     * @param comparator - The comparator used for sorting items
     * @tag [OPERATOR: Stateful Operation]
     */
    sortWith(comparator: Comparator<T>): Stream<T>;
    /**
     * Sort (in ascending order) the stream by the order of the generated values (eager operation)
     * @param idExtractor - The function used to generate the value used to sort the stream
     * @tag [OPERATOR: Stateful Operation]
     */
    sortBy<U>(idExtractor: Mapper<T, U>): Stream<T>;
    /**
     * Sort (in ascending order) the stream (eager operation)
     * @tag [OPERATOR: Stateful Operation]
     */
    sort(): Stream<T>;
    /**
     * Sort (in descending order) the stream by the order of the generated values (eager operation)
     * @param idExtractor - The function used to generate the value used to sort the stream
     * @tag [OPERATOR: Stateful Operation]
     */
    sortByDescending<U>(idExtractor: Mapper<T, U>): Stream<T>;
    /**
     * Sort (in descending order) the stream (eager operation)
     * @tag [OPERATOR: Stateful Operation]
     */
    sortDescending(): Stream<T>;
    /**
     * Keep unique elements: unique according to their generated ID (eager operation)
     * @param idExtractor - The function used to generate IDs to check for duplicates
     * @tag [OPERATOR: Stateful Operation]
     */
    uniqueBy<U>(idExtractor: Mapper<T, U>): Stream<T>;
    /**
     * Keep unique elements (eager operation)
     * @tag [OPERATOR: Stateful Operation]
     */
    unique(): Stream<T>;
    /**
     * Reduce the stream to a single value (aka fold, foldl)
     * @param reducer - The reducer function to incrementally compute the final return value
     * @param init - The initial value of the return value (defaults to null, use null to use the very first item as the return value)
     * @tag [TERMINATOR]
     */
    reduce<Acc>(reducer: Reducer<Acc, T>, init?: Nullable<Acc>): Nullable<Acc>;
    /**
     * Create a {@link Map} by generating keys and values from items
     * @param keyExtractor - The function used to extract the key from the item
     * @param valueExtractor - The function used to extract the value from the item
     * @tag [TERMINATOR]
     */
    associateBy<Key, Value>(keyExtractor: Mapper<T, Key>, valueExtractor: Mapper<T, Value>): Map<Key, Value>;
    /**
     * Create a {@link Map} by generating entries from items
     * @param entryFactory - The function used to create an entry from an item
     * @tag [TERMINATOR]
     */
    associate<Key, Value>(entryFactory: Mapper<T, [Key, Value]>): Map<Key, Value>;
    /**
     * Create a {@link Map} from a {@link Stream} of entries
     * @param keyExtractor - The function used to extract the key from the entry
     * @param valueExtractor - The function used to extract the value from the entry
     * @tag [TERMINATOR]
     */
    associateUnzip<Key, Value>(this: Stream<[Key, Value]>, keyExtractor?: Mapper<[Key, Value], Key>, valueExtractor?: Mapper<[Key, Value], Value>): Map<Key, Value>;
    /**
     * Whether or not all items satisfy the given predicate
     * @param predicate - The predicate to satisfy
     * @tag [TERMINATOR]
     */
    all(predicate: Predicate<T>): boolean;
    /**
     * Whether or not none of the items satisfy the given predicate
     * @param predicate - The predicate to not satisfy
     * @tag [TERMINATOR]
     */
    none(predicate: Predicate<T>): boolean;
    /**
     * Whether or not any of the items satisfies the given predicate
     * @param predicate - The predicate to satisfy
     * @tag [TERMINATOR]
     */
    any(predicate: Predicate<T>): boolean;
    /**
     * Whether not all the items satisy the given predicate
     * @param predicate - The predicate to not satisfy
     * @tag [TERMINATOR]
     */
    notAll(predicate: Predicate<T>): boolean;
    /**
     * The amount of items in the stream that satisfy the given predicate
     * @param predicate - The predicate to satisfy (if none is provided it always returns true)
     * @tag [TERMINATOR]
     */
    count(predicate?: Predicate<T>): number;
    /**
     * Get the first item that satisfy predicate or null if there are none
     * @param predicate - The predicate to satisfy (if none is provided it always returns true)
     * @tag [TERMINATOR]
     */
    firstOrNull(predicate?: Predicate<T>): T | null;
    /**
     * Get the first item that satisfies the given predicate or get the provided default value
     * @param defaultValue - The value to return if none satisfies the given predicate
     * @param predicate - The predicate to satisfy (if none is provided, it always returns true)
     * @tag [TERMINATOR]
     */
    firstOr<U>(defaultValue: U, predicate?: Predicate<T>): NonNullable<T> | U;
    /**
     * Get the first item that satisfies the given predicate, or throw
     * @param predicate - The predicate to satisfy (if none is provided, it always returns true)
     * @throws {StreamElementNotFound}
     * @tag [TERMINATOR]
     */
    first(predicate?: Predicate<T>): T;
    /**
     * Get the item at the given index, or null it there is none
     * @param index
     * @tag [TERMINATOR]
     */
    atIndexOrNull(index: number): T | null;
    /**
     * Get the item at the given index, or the default value if there is none
     * @param index
     * @param defaultValue - The value to return if there's no value at the given index
     * @tag [TERMINATOR]
     */
    atIndexOr<U>(index: number, defaultValue: U): NonNullable<T> | U;
    /**
     * Get the item at the given index, or throw if there is none
     * @param index
     * @throws {StreamElementNotFound}
     * @tag [TERMINATOR]
     */
    atIndex(index: number): T;
    /**
     * Get the average of this {@link Stream} of numbers
     */
    average(this: Stream<number>): number;
    /**
     * Execute a callback on each item
     * @param callback - The function to call on each item
     * @tag [TERMINATOR]
     */
    forEach(callback: Consumer<T>): void;
    /**
     * Group items by key
     * @param keyExtractor - The function used to extract the key from an item
     * @tag [TERMINATOR]
     */
    groupBy<Key>(keyExtractor: Mapper<T, Key>): Map<Key, T[]>;
    /**
     * Get the index of the first element that satisfies the given predicate (or null if there is none)
     * @param predicate - The predicate to satisfy
     * @tag [TERMINATOR]
     */
    indexOfFirst(predicate: Predicate<T>): number | null;
    /**
     * Get the index of the given item
     * @param needle - The item to find the index of
     * @tag [TERMINATOR]
     */
    indexOf(needle: T): number | null;
    /**
     * Get the index of the last item that satisfies the given predicate
     * @param predicate - The predicate to satisfy
     * @tag [TERMINATOR]
     */
    indexOfLast(predicate: Predicate<T>): Nullable<number>;
    /**
     * Get the last index of the provided item
     * @param needle - The item to get the last index of
     * @tag [TERMINATOR]
     */
    lastIndexOf(needle: T): number | null;
    /**
     * Whether or not the stream contains the provided item
     * @param needle - The item to look for
     * @tag [TERMINATOR]
     */
    contains(needle: T): boolean;
    /**
     * Join the sequence to string
     * @param joinOptions - The options of the joining algorithm
     * @param joinOptions.prefix - What to prefix the joined string with
     * @param joinOptions.suffix - What to append at the end the joined string with
     * @param joinOptions.separator - What to append after each item
     * @param joinOptions.stringifier - The function used to convert an item into its string representation
     * @tag [TERMINATOR]
     */
    join({ prefix, suffix, separator, stringifier, }?: Partial<JoinOptions<T>>): string;
    /**
     * Alias for {@link Stream#join}
     * @param joinOptions - The options of the joining algorithm
     * @param joinOptions.prefix - What to prefix the joined string with
     * @param joinOptions.suffix - What to append at the end the joined string with
     * @param joinOptions.separator - What to append after each item
     * @param joinOptions.stringifier - The function used to convert an item into its string representation
     * @tag [TERMINATOR]
     */
    joinToString(joinOptions?: Partial<JoinOptions<T>>): string;
    /**
     * Get the last item that satisfy predicate or null if there are none
     * @param predicate - The predicate to satisfy (if none is provided it always returns true)
     * @tag [TERMINATOR]
     */
    lastOrNull(predicate?: Predicate<T>): Nullable<T>;
    /**
     * Get the last item that satisfies the given predicate or get the provided default value
     * @param defaultValue - The value to return if none satisfies the given predicate
     * @param predicate - The predicate to satisfy (if none is provided, it always returns true)
     * @tag [TERMINATOR]
     */
    lastOr<U>(defaultValue: U, predicate?: Predicate<T>): NonNullable<T> | U;
    /**
     * Get the last item that satisfies the given predicate, or throw
     * @param predicate - The predicate to satisfy (if none is provided, it always returns true)
     * @throws {StreamElementNotFound}
     * @tag [TERMINATOR]
     */
    last(predicate?: Predicate<T>): T;
    /**
     * Get the max item by the given function (i.e. item with the max value), or null if there is none
     * @param keyFactory - The function that gets the numeric value from the item to max by
     * @tag [TERMINATOR]
     */
    maxBy(keyFactory: Mapper<T, number>): Nullable<T>;
    /**
     * Get the max number, or null if there is none
     * @tag [TERMINATOR]
     */
    max(this: Stream<number>): Nullable<number>;
    /**
     * Get the max item using the given comparison function, or null if there is none
     * @param comparator - The comparison function to use
     * @tag [TERMINATOR]
     */
    maxWith(comparator: Comparator<T>): Nullable<T>;
    /**
     * Get the min item by the given function (i.e. item with the min value), or null if there is none
     * @param keyFactory - The function that gets the numeric value from the item to max by
     * @tag [TERMINATOR]
     */
    minBy(keyFactory: Mapper<T, number>): Nullable<T>;
    /**
     * Get the min number, or null if there is none
     * @tag [TERMINATOR]
     */
    min(this: Stream<number>): Nullable<number>;
    /**
     * Get the min item using the given comparison function, or null if there is none
     * @param comparator - The comparison function to use
     * @tag [TERMINATOR]
     */
    minWith(comparator: Comparator<T>): Nullable<T>;
    /**
     * Partition the stream into two arrays (left part is for the items that satisfy the predicate)
     * @param predicate - The predicate used to partition the stream
     * @tag [TERMINATOR]
     */
    partition(predicate: Predicate<T>): [yes: T[], no: T[]];
    /**
     * Transform and sum the resulting values
     * @param valueExtractor - The function used to extract the numeric value of an item
     * @param init - The initial value of the sum
     * @tag [TERMINATOR]
     */
    sumBy(valueExtractor: Mapper<T, number>, init?: number): Nullable<number>;
    /**
     * Sum the numbers
     * @param init
     * @tag [TERMINATOR]
     */
    sum(this: Stream<number>, init?: number): Nullable<number>;
    /**
     * Convert the stream into an {@link Array}
     * @param initialArray - The array to push values into (defaults to a new empty array)
     * @tag [TERMINATOR]
     */
    toArray(initialArray?: T[]): T[];
    /**
     * Get the single value from the stream that satisfies the predicate, or null if there is none or more
     * @param predicate - The predicate to satisfy (if none is provided, it always returns true)
     * @tag [TERMINATOR]
     */
    singleOrNull(predicate?: Predicate<T>): T | null;
    /**
     * Get the single value from the stream that satisfies the predicate, or the default value if there is none or more
     * @param defaultValue - The value to return if there's no item or multiple items that satisfy the predicate
     * @param predicate - The predicate to satisfy
     * @tag [TERMINATOR]
     */
    singleOr<U>(defaultValue: U, predicate?: Predicate<T>): NonNullable<T> | U;
    /**
     * Get the single value from the stream that satisfies the predicate, or throw
     * @param predicate - The predicate to satisfy
     * @throws {StreamElementNotFound}
     * @tag [TERMINATOR]
     */
    single(predicate?: Predicate<T>): T;
    /**
     * Unzip a stream of pairs into a pair of arrays
     * @tag [TERMINATOR]
     */
    unzip<A, B>(this: Stream<[A, B]>): [keys: A[], values: B[]];
    /**
     * Convert the stream into an object
     * @param keyExtractor - The function used to get the key from the item
     * @param valueExtractor - The function used to get the value from the item
     * @param initialObject - The object to add values to (defaults to a new empty object)
     * @tag [TERMINATOR]
     */
    toObject<Key extends PropertyKey, Value>(keyExtractor: Mapper<T, Key>, valueExtractor: Mapper<T, Value>, initialObject?: Record<Key, Value>): Record<Key, Value>;
    /**
     * Convert the stream into an object whose values are the items of the stream
     * @param keyExtractor - The function used to extract the key from an item
     * @param initialObject - The object to add values to (defaults to a new empty object)
     * @tag [TERMINATOR]
     */
    toObjectBy<Key extends PropertyKey>(keyExtractor: Mapper<T, Key>, initialObject?: Record<Key, T>): Record<Key, T>;
    /**
     * Convert the stream into a {@link Set}
     * @param initialSet - The set to add values to (defaults to a new empty set)
     * @returns
     */
    toSet(initialSet?: Set<T>): Set<T>;
    /**
     * Convert the stream into a {@link Map}
     * @param keyExtractor - The function used to get the key from the item
     * @param valueExtractor - The function used to get the value from the item
     * @param initialMap - The map to add values to (defaults to a new empty map)
     * @tag [TERMINATOR]
     */
    toMap<Key, Value>(keyExtractor: Mapper<T, Key>, valueExtractor: Mapper<T, Value>, initialMap?: Map<Key, Value>): Map<Key, Value>;
    /**
     * Convert the stream into a {@link Map} whose values are the items of the stream
     * @param keyExtractor - The function used to extract the key from an item
     * @param initialObject - The map to add values to (defaults to a new empty map)
     * @tag [TERMINATOR]
     */
    toMapBy<Key>(keyExtractor: Mapper<T, Key>, initialMap?: Map<Key, T>): Map<Key, T>;
}
