import { isIterable, isNullish, Compare, KeyGen, ValueGen } from "./utils";
export class StreamElementNotFound extends Error {
}
export class Stream {
    /**
     * Wrap a {@link Generator} into a {@link Stream}
     * @param gen - The generator to wrap
     */
    constructor(gen) {
        this.gen = gen;
    }
    /**
     * @inheritdoc
     */
    [Symbol.iterator]() {
        throw new Error("Method not implemented.");
    }
    /**
     * Pipe a generator transform to the current stream
     * @param mapper - The generator mapper, it receives the current's stream generator as argument
     * @returns A {@link Stream} that wraps the mapped generator
     */
    pipe(mapper) {
        return new Stream(mapper(this.gen));
    }
    //// [Creators]
    /**
     * Create a {@link Stream} from an {@link Iterable}
     * @param iter - The iterable to wrap in a Stream
     * @tag [CREATOR]
     */
    static fromIterable(iter) {
        const generatorFactory = function* () {
            yield* iter;
        };
        const generator = generatorFactory();
        return new this(generator);
    }
    /**
     * Create a {@link Stream} of {@link String} from the input string, split by the given separator
     * @param inputStr - The input string to split
     * @param separator - The separator to use in order to split {@link inputStr}
     * @param removeEmptyStrings - Whether or not empty strings should be removed (defaults to true)
     * @tag [CREATOR]
     */
    static splitBy(inputStr, separator = "", removeEmptyStrings = true) {
        const splat = inputStr.split(separator);
        const predicate = removeEmptyStrings
            ? (str) => str !== ""
            : () => true;
        return this.fromIterable(splat).filter(predicate);
    }
    /**
     * Create a {@link Stream} of {@link String} from the input string, split using the given regex
     * @param inputStr - The input string to split
     * @param regex - The {@link RegExp} to use in order to split {@link inputStr}
     * @param removeEmptyStrings - Whether or not empty strings should be removed (defaults to true)
     * @tag [CREATOR]
     */
    static splitByRegex(inputStr, regex, removeEmptyStrings = true) {
        const splat = inputStr.split(regex);
        const predicate = removeEmptyStrings
            ? (str) => str !== ""
            : () => true;
        return this.fromIterable(splat).filter(predicate);
    }
    /**
     * Create a range of numbers
     * @param options
     * @param options.start - The starting number of the range/interval
     * @param options.end - The end number of the range/interval (defaults to null to be infinite)
     * @param options.step - The step to increment by (can be positive even if start > end and it'll keep the semantics of a decreasing sequence)
     * @tag [CREATOR]
     */
    static range({ start = 0, end = null, step = 1, } = {}) {
        const generatorFactory = function* () {
            if (end !== null) {
                let st = step;
                const cmp = start < end
                    ? (lhs, rhs) => lhs < rhs
                    : (lhs, rhs) => lhs > rhs;
                const increasingWithNegativeStep = start < end && st < 0;
                const decreasingWithPositiveStep = start > end && st > 0;
                if (increasingWithNegativeStep || decreasingWithPositiveStep) {
                    // Avoids using the wrong stepping + UX (can pass 1 instead of passing -1 to decrease by 1)
                    st *= -1;
                }
                for (let i = start; cmp(i, end); i += st) {
                    yield i;
                }
            }
            else {
                for (let i = start;; i += step) {
                    yield i;
                }
            }
        };
        const generator = generatorFactory();
        return new this(generator);
    }
    /**
     * Create an infinite range of numbers
     * @param options
     * @param options.start - The starting number of the range/interval
     * @param options.step - The step to increment by (can be positive even if start > end and it'll keep the semantics of a decreasing sequence)
     * @tag [CREATOR]
     */
    static infinite(start = 0, step = 1) {
        return this.range({
            start,
            step,
        });
    }
    //// [/Creators]
    //// [Stateless Operations]
    /**
     * Filter the stream to keep only items that satisfy the given predicate
     * @param predicate
     * @tag [OPERATOR: Stateless Operation]
     */
    filter(predicate) {
        return this.pipe(function* (source) {
            for (const value of source) {
                const shouldYield = predicate(value);
                if (shouldYield) {
                    yield value;
                }
            }
        });
    }
    /**
     * Filter the stream to keep only items that do not satisfy the given predicate
     * @param predicate
     * @tag [OPERATOR: Stateless Operation]
     */
    filterNot(predicate) {
        const negation = (value) => !predicate(value);
        return this.filter(negation);
    }
    /**
     * Map each individual item of the stream
     * @param mapper - The mapper function used to transform each individual item
     * @tag [OPERATOR: Stateless Operation]
     */
    map(mapper) {
        return this.pipe(function* (source) {
            for (const value of source) {
                yield mapper(value);
            }
        });
    }
    /**
     * Flatten this sequence of iterables to a sequence of item
     * @tag [OPERATOR: Stateless Operation]
     */
    flatten() {
        return this.pipe(function* (source) {
            for (const value of source) {
                if (isIterable(value)) {
                    yield* value;
                }
                else {
                    yield value;
                }
            }
        });
    }
    /**
     * Map then flatten
     * @param mapper - The function to use to transform each item into an iterable
     * @tag [OPERATOR: Stateless Operation]
     */
    flatMap(mapper) {
        return this.map(mapper).flatten();
    }
    /**
     * Flatten the stream, then map
     * @param mapper - The mapper function used to transform each individual item
     * @tag [OPERATOR: Stateless Operation]
     */
    mapFlattened(mapper) {
        return this.flatten().map(mapper);
    }
    /**
     * Filter a sequence to objects that are instances of the given class
     * @param clazz - The class (or constructor function) to be an instance of
     * @tag [OPERATOR: Stateless Operation]
     */
    instanceOf(clazz) {
        return this.filter((instance) => instance instanceof clazz);
    }
    /**
     * Typescript utility that does the same job as {@link Stream#instanceOf} but also casts each item
     * @tag [OPERATOR: Stateless Operation]
     */
    asInstanceOf(clazz) {
        return this.instanceOf(clazz);
    }
    /**
     * Filter a sequence to items that are not instances of the given class
     * @param clazz - The class (or constructor function) to not be an instance of
     * @tag [OPERATOR: Stateless Operation]
     */
    notInstanceOf(clazz) {
        return this.filter((instance) => !(instance instanceof clazz));
    }
    /**
     * Filter out the null values
     * @tag [OPERATOR: Stateless Operation]
     */
    notNull() {
        return this.filter((value) => value !== null);
    }
    /**
     * Filter out the nullish values (i.e. those affected by the ?? and ?. operators)
     * @tag [OPERATOR: Stateless Operation]
     */
    notNullish() {
        return this.filterNot(isNullish);
    }
    /**
     * Execute a callback on each item before passing it along
     * @param callback - The function to call on each item
     * @tag [OPERATOR: Stateless Operation]
     */
    peek(callback) {
        return this.pipe(function* (source) {
            for (const value of source) {
                callback(value);
                yield value;
            }
        });
    }
    /**
     * Skip items while they satisfy the given predicate
     * @param predicate - The predicate to not satisfy for an item to be kept
     * @tag [OPERATOR: Stateless Operation]
     */
    skipWhile(predicate) {
        return this.pipe(function* (source) {
            let skip = true;
            for (const value of source) {
                if (skip && predicate(value)) {
                    continue;
                }
                else {
                    skip = false;
                    yield value;
                }
            }
        });
    }
    /**
     * Skip items until the given predicate is satisfied
     * @param predicate - The predicate to satisfy
     * @tag [OPERATOR: Stateless Operation]
     */
    skipUntil(predicate) {
        return this.skipWhile((value) => !predicate(value));
    }
    /**
     * Skip at most {@link maxAmount} items
     * @param maxAmount - The maximum amount of items to skip
     * @tag [OPERATOR: Stateless Operation]
     */
    skip(maxAmount) {
        let count = 0;
        return this.skipWhile(() => count++ < maxAmount);
    }
    /**
     * Yield items while the given predicate is satisfied
     * @param predicate - The predicate to satisfy to keep yielding items
     * @tag [OPERATOR: Stateless Operation]
     */
    takeWhile(predicate) {
        return this.pipe(function* (source) {
            for (const value of source) {
                if (predicate(value)) {
                    yield value;
                }
                else {
                    break;
                }
            }
        });
    }
    /**
     * Yield items until the predicate is satisfied
     * @param predicate - The predicate to not satisfy to keep yielding items
     * @tag [OPERATOR: Stateless Operation]
     */
    takeUntil(predicate) {
        return this.takeWhile((value) => !predicate(value));
    }
    /**
     * Yield at most {@link maxAmount} items (makes infinite {@link Stream} finite)
     * @param maxAmount - The maximum amount of items to yield
     * @tag [OPERATOR: Stateless Operation]
     */
    take(maxAmount) {
        let count = 0;
        return this.takeWhile(() => count++ < maxAmount);
    }
    /**
     * Take a substream/window that starts at the given {@link startIndex} and ends at (or before) {@link maxEndIndex}
     * @param startIndex - The index of the first item to yield
     * @param maxEndIndex - The maximum index of the last item to yield
     * @tag [OPERATOR: Stateless Operation]
     */
    substream(startIndex, maxEndIndex) {
        const take = maxEndIndex - startIndex;
        return this.skip(startIndex).take(take);
    }
    /**
     * Yield all values from this {@link Stream} and then yield the values of the given {@link Iterable}
     * @param iter - The iterable to yield values from once the stream as yielded all its values
     * @tag [OPERATOR: Stateless Operation]
     */
    then(iter) {
        return this.pipe(function* (source) {
            yield* source;
            yield* iter;
        });
    }
    /**
     * Only keep the truthy values
     * @tag [OPERATOR: Stateless Operation]
     */
    truthy() {
        return this.filter((value) => !!value);
    }
    /**
     * Only keep the falsy values
     * @tag [OPERATOR: Stateless Operation]
     */
    falsy() {
        return this.filter((value) => !value);
    }
    /**
     * Zip values of this {@link Stream} with values of the given {@link Iterable}
     * @param iter - The iterable to zip with
     * @returns A stream of pairs whose length is the length of the smallest between this stream and the provided {@link iter}
     * @tag [OPERATOR: Stateless Operation]
     */
    zipWith(iter) {
        return this.pipe(function* (source) {
            const lhsIt = source;
            const rhsIt = iter[Symbol.iterator]();
            while (true) {
                const lhsRes = lhsIt.next();
                if (lhsRes.done) {
                    break;
                }
                const rhsRes = rhsIt.next();
                if (rhsRes.done) {
                    break;
                }
                yield [lhsRes.value, rhsRes.value];
            }
        });
    }
    /**
     * Split the stream into chunks of at most {@link maxSize} items per chunk
     * @param maxSize - The maximum amount of item per chunk
     * @tag [OPERATOR: Stateless Operation]
     */
    chunks(maxSize) {
        let chunk = [];
        return this.pipe(function* (source) {
            for (const value of source) {
                if (chunk.length < maxSize) {
                    chunk.push(value);
                }
                else {
                    yield chunk;
                    chunk = [value];
                }
            }
            // Do not forget cleanup for non-evened streams
            if (chunk.length > 0) {
                yield chunk;
            }
        });
    }
    //// [/Stateless Operations]
    //// [Stateful Operations]
    /**
     * Reverse the stream's items' order (eager operation)
     * @tag [OPERATOR: Stateful Operation]
     */
    reverse() {
        return this.pipe(function* (source) {
            const reversed = Array.from(source).reverse();
            yield* reversed;
        });
    }
    /**
     * Sort the stream with the given comparator (eager operation)
     * @param comparator - The comparator used for sorting items
     * @tag [OPERATOR: Stateful Operation]
     */
    sortWith(comparator) {
        return this.pipe(function* (source) {
            const arr = Array.from(source).sort(comparator);
            yield* arr;
        });
    }
    /**
     * Sort (in ascending order) the stream by the order of the generated values (eager operation)
     * @param idExtractor - The function used to generate the value used to sort the stream
     * @tag [OPERATOR: Stateful Operation]
     */
    sortBy(idExtractor) {
        return this.sortWith(Compare.mapped.asc(idExtractor));
    }
    /**
     * Sort (in ascending order) the stream (eager operation)
     * @tag [OPERATOR: Stateful Operation]
     */
    sort() {
        return this.pipe(function* (source) {
            const arr = Array.from(source).sort();
            yield* arr;
        });
    }
    /**
     * Sort (in descending order) the stream by the order of the generated values (eager operation)
     * @param idExtractor - The function used to generate the value used to sort the stream
     * @tag [OPERATOR: Stateful Operation]
     */
    sortByDescending(idExtractor) {
        return this.sortWith(Compare.mapped.desc(idExtractor));
    }
    /**
     * Sort (in descending order) the stream (eager operation)
     * @tag [OPERATOR: Stateful Operation]
     */
    sortDescending() {
        return this.sort().reverse();
    }
    /**
     * Keep unique elements: unique according to their generated ID (eager operation)
     * @param idExtractor - The function used to generate IDs to check for duplicates
     * @tag [OPERATOR: Stateful Operation]
     */
    uniqueBy(idExtractor) {
        return this.pipe(function* (source) {
            const yielded = new Set();
            for (const value of source) {
                const id = idExtractor(value);
                if (!yielded.has(id)) {
                    yielded.add(id);
                    yield value;
                }
            }
        });
    }
    /**
     * Keep unique elements (eager operation)
     * @tag [OPERATOR: Stateful Operation]
     */
    unique() {
        return this.uniqueBy((value) => value);
    }
    //// [/Stateful Operations]
    //// [Terminators]
    /**
     * Reduce the stream to a single value (aka fold, foldl)
     * @param reducer - The reducer function to incrementally compute the final return value
     * @param init - The initial value of the return value (defaults to null, use null to use the very first item as the return value)
     * @tag [TERMINATOR]
     */
    reduce(reducer, init = null) {
        let acc = init;
        let firstDone = acc !== null;
        for (const value of this) {
            if (!firstDone) {
                acc = value;
                firstDone = true;
            }
            else {
                acc = reducer(acc, value);
            }
        }
        return acc;
    }
    /**
     * Create a {@link Map} by generating keys and values from items
     * @param keyExtractor - The function used to extract the key from the item
     * @param valueExtractor - The function used to extract the value from the item
     * @tag [TERMINATOR]
     */
    associateBy(keyExtractor, valueExtractor) {
        return this.reduce(function (map, item) {
            map.set(keyExtractor(item), valueExtractor(item));
            return map;
        }, new Map());
    }
    /**
     * Create a {@link Map} by generating entries from items
     * @param entryFactory - The function used to create an entry from an item
     * @tag [TERMINATOR]
     */
    associate(entryFactory) {
        return this.reduce(function (map, item) {
            const [key, value] = entryFactory(item);
            map.set(key, value);
            return map;
        }, new Map());
    }
    /**
     * Create a {@link Map} from a {@link Stream} of entries
     * @param keyExtractor - The function used to extract the key from the entry
     * @param valueExtractor - The function used to extract the value from the entry
     * @tag [TERMINATOR]
     */
    associateUnzip(keyExtractor = KeyGen.entries, valueExtractor = ValueGen.entries) {
        return this.associateBy(keyExtractor, valueExtractor);
    }
    /**
     * Whether or not all items satisfy the given predicate
     * @param predicate - The predicate to satisfy
     * @tag [TERMINATOR]
     */
    all(predicate) {
        for (const value of this) {
            if (!predicate(value)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Whether or not none of the items satisfy the given predicate
     * @param predicate - The predicate to not satisfy
     * @tag [TERMINATOR]
     */
    none(predicate) {
        return this.all((value) => !predicate(value));
    }
    /**
     * Whether or not any of the items satisfies the given predicate
     * @param predicate - The predicate to satisfy
     * @tag [TERMINATOR]
     */
    any(predicate) {
        return !this.none(predicate);
    }
    /**
     * Whether not all the items satisy the given predicate
     * @param predicate - The predicate to not satisfy
     * @tag [TERMINATOR]
     */
    notAll(predicate) {
        return !this.all(predicate);
    }
    /**
     * The amount of items in the stream that satisfy the given predicate
     * @param predicate - The predicate to satisfy (if none is provided it always returns true)
     * @tag [TERMINATOR]
     */
    count(predicate = () => true) {
        return this.reduce(function (count, item) {
            const delta = predicate(item) ? 1 : 0;
            return count + delta;
        }, 0);
    }
    /**
     * Get the first item that satisfy predicate or null if there are none
     * @param predicate - The predicate to satisfy (if none is provided it always returns true)
     * @tag [TERMINATOR]
     */
    firstOrNull(predicate = () => true) {
        for (const value of this) {
            if (predicate(value)) {
                return value;
            }
        }
        return null;
    }
    /**
     * Get the first item that satisfies the given predicate or get the provided default value
     * @param defaultValue - The value to return if none satisfies the given predicate
     * @param predicate - The predicate to satisfy (if none is provided, it always returns true)
     * @tag [TERMINATOR]
     */
    firstOr(defaultValue, predicate = () => true) {
        var _a;
        return (_a = this.firstOrNull(predicate)) !== null && _a !== void 0 ? _a : defaultValue;
    }
    /**
     * Get the first item that satisfies the given predicate, or throw
     * @param predicate - The predicate to satisfy (if none is provided, it always returns true)
     * @throws {StreamElementNotFound}
     * @tag [TERMINATOR]
     */
    first(predicate = () => true) {
        const value = this.firstOrNull(predicate);
        if (value === null) {
            throw new StreamElementNotFound();
        }
        return value;
    }
    /**
     * Get the item at the given index, or null it there is none
     * @param index
     * @tag [TERMINATOR]
     */
    atIndexOrNull(index) {
        let cursor = 0;
        return this.firstOrNull(() => cursor++ === index);
    }
    /**
     * Get the item at the given index, or the default value if there is none
     * @param index
     * @param defaultValue - The value to return if there's no value at the given index
     * @tag [TERMINATOR]
     */
    atIndexOr(index, defaultValue) {
        var _a;
        return (_a = this.atIndexOrNull(index)) !== null && _a !== void 0 ? _a : defaultValue;
    }
    /**
     * Get the item at the given index, or throw if there is none
     * @param index
     * @throws {StreamElementNotFound}
     * @tag [TERMINATOR]
     */
    atIndex(index) {
        const value = this.atIndexOrNull(index);
        if (value === null) {
            throw new StreamElementNotFound();
        }
        return value;
    }
    /**
     * Get the average of this {@link Stream} of numbers
     */
    average() {
        let i = 0;
        return this.reduce(function (acc, elem) {
            //cf. https://stackoverflow.com/a/5984099/7316365
            const key = i++;
            return (acc * key + elem) / i;
        }, 0);
    }
    /**
     * Execute a callback on each item
     * @param callback - The function to call on each item
     * @tag [TERMINATOR]
     */
    forEach(callback) {
        for (const value of this) {
            callback(value);
        }
    }
    /**
     * Group items by key
     * @param keyExtractor - The function used to extract the key from an item
     * @tag [TERMINATOR]
     */
    groupBy(keyExtractor) {
        return this.reduce(function (map, item) {
            var _a;
            const key = keyExtractor(item);
            const values = (_a = map.get(key)) !== null && _a !== void 0 ? _a : [];
            values.push(item);
            map.set(key, values);
            return map;
        }, new Map());
    }
    /**
     * Get the index of the first element that satisfies the given predicate (or null if there is none)
     * @param predicate - The predicate to satisfy
     * @tag [TERMINATOR]
     */
    indexOfFirst(predicate) {
        let cursor = 0;
        for (const value of this) {
            if (predicate(value)) {
                return cursor;
            }
            cursor++;
        }
        return null;
    }
    /**
     * Get the index of the given item
     * @param needle - The item to find the index of
     * @tag [TERMINATOR]
     */
    indexOf(needle) {
        return this.indexOfFirst((value) => value === needle);
    }
    /**
     * Get the index of the last item that satisfies the given predicate
     * @param predicate - The predicate to satisfy
     * @tag [TERMINATOR]
     */
    indexOfLast(predicate) {
        let cursor = 0;
        let ret = null;
        for (const value of this) {
            if (predicate(value)) {
                ret = cursor;
            }
            cursor++;
        }
        return ret;
    }
    /**
     * Get the last index of the provided item
     * @param needle - The item to get the last index of
     * @tag [TERMINATOR]
     */
    lastIndexOf(needle) {
        return this.indexOfFirst((value) => value === needle);
    }
    /**
     * Whether or not the stream contains the provided item
     * @param needle - The item to look for
     * @tag [TERMINATOR]
     */
    contains(needle) {
        return this.indexOf(needle) !== null;
    }
    /**
     * Join the sequence to string
     * @param joinOptions - The options of the joining algorithm
     * @param joinOptions.prefix - What to prefix the joined string with
     * @param joinOptions.suffix - What to append at the end the joined string with
     * @param joinOptions.separator - What to append after each item
     * @param joinOptions.stringifier - The function used to convert an item into its string representation
     * @tag [TERMINATOR]
     */
    join({ prefix = "", suffix = "", separator = "", stringifier = (item) => `${item}`, } = {}) {
        let ret = prefix;
        let hasElems = false;
        for (const value of this) {
            let tmp = stringifier(value);
            ret += tmp + separator;
            hasElems = true;
        }
        const suffixLength = suffix.length;
        if (hasElems && suffixLength > 0) {
            ret = ret.substr(0, -suffixLength);
        }
        ret += suffix;
        return ret;
    }
    /**
     * Alias for {@link Stream#join}
     * @param joinOptions - The options of the joining algorithm
     * @param joinOptions.prefix - What to prefix the joined string with
     * @param joinOptions.suffix - What to append at the end the joined string with
     * @param joinOptions.separator - What to append after each item
     * @param joinOptions.stringifier - The function used to convert an item into its string representation
     * @tag [TERMINATOR]
     */
    joinToString(joinOptions = {}) {
        return this.join(joinOptions);
    }
    /**
     * Get the last item that satisfy predicate or null if there are none
     * @param predicate - The predicate to satisfy (if none is provided it always returns true)
     * @tag [TERMINATOR]
     */
    lastOrNull(predicate = () => true) {
        let last = null;
        for (const value of this) {
            if (predicate(value)) {
                last = value;
            }
        }
        return last;
    }
    /**
     * Get the last item that satisfies the given predicate or get the provided default value
     * @param defaultValue - The value to return if none satisfies the given predicate
     * @param predicate - The predicate to satisfy (if none is provided, it always returns true)
     * @tag [TERMINATOR]
     */
    lastOr(defaultValue, predicate = () => true) {
        var _a;
        return (_a = this.lastOrNull(predicate)) !== null && _a !== void 0 ? _a : defaultValue;
    }
    /**
     * Get the last item that satisfies the given predicate, or throw
     * @param predicate - The predicate to satisfy (if none is provided, it always returns true)
     * @throws {StreamElementNotFound}
     * @tag [TERMINATOR]
     */
    last(predicate = () => true) {
        const value = this.lastOrNull(predicate);
        if (value === null) {
            throw new StreamElementNotFound();
        }
        return value;
    }
    /**
     * Get the max item by the given function (i.e. item with the max value), or null if there is none
     * @param keyFactory - The function that gets the numeric value from the item to max by
     * @tag [TERMINATOR]
     */
    maxBy(keyFactory) {
        return this.maxWith(Compare.mapped.desc(keyFactory));
        /* return this.reduce<T>(function (maxItem, item) {
            const maxKey = keyFactory(maxItem);
            const key = keyFactory(item);
            return key > maxKey ? item : maxItem;
        }); */
    }
    /**
     * Get the max number, or null if there is none
     * @tag [TERMINATOR]
     */
    max() {
        return this.maxBy((x) => x);
    }
    /**
     * Get the max item using the given comparison function, or null if there is none
     * @param comparator - The comparison function to use
     * @tag [TERMINATOR]
     */
    maxWith(comparator) {
        return this.reduce(function (maxItem, item) {
            return comparator(item, maxItem) > 0 ? item : maxItem;
        });
    }
    /**
     * Get the min item by the given function (i.e. item with the min value), or null if there is none
     * @param keyFactory - The function that gets the numeric value from the item to max by
     * @tag [TERMINATOR]
     */
    minBy(keyFactory) {
        return this.minWith(Compare.mapped.asc(keyFactory));
        /* return this.reduce<T>(function (maxItem, item) {
            const maxKey = keyFactory(maxItem);
            const key = keyFactory(item);
            return key < maxKey ? item : maxItem;
        }); */
    }
    /**
     * Get the min number, or null if there is none
     * @tag [TERMINATOR]
     */
    min() {
        return this.minBy((x) => x);
    }
    /**
     * Get the min item using the given comparison function, or null if there is none
     * @param comparator - The comparison function to use
     * @tag [TERMINATOR]
     */
    minWith(comparator) {
        return this.reduce(function (maxItem, item) {
            return comparator(item, maxItem) < 0 ? item : maxItem;
        });
    }
    /**
     * Partition the stream into two arrays (left part is for the items that satisfy the predicate)
     * @param predicate - The predicate used to partition the stream
     * @tag [TERMINATOR]
     */
    partition(predicate) {
        return this.reduce(function (acc, item) {
            const index = predicate(item) ? 0 : 1;
            acc[index].push(item);
            return acc;
        }, [[], []]);
    }
    /**
     * Transform and sum the resulting values
     * @param valueExtractor - The function used to extract the numeric value of an item
     * @param init - The initial value of the sum
     * @tag [TERMINATOR]
     */
    sumBy(valueExtractor, init = 0) {
        return this.reduce((sum, item) => sum + valueExtractor(item), init);
    }
    /**
     * Sum the numbers
     * @param init
     * @tag [TERMINATOR]
     */
    sum(init = 0) {
        return this.sumBy((x) => x, init);
    }
    /**
     * Convert the stream into an {@link Array}
     * @param initialArray - The array to push values into (defaults to a new empty array)
     * @tag [TERMINATOR]
     */
    toArray(initialArray = []) {
        return this.reduce(function (arr, item) {
            arr.push(item);
            return arr;
        }, initialArray);
    }
    /**
     * Get the single value from the stream that satisfies the predicate, or null if there is none or more
     * @param predicate - The predicate to satisfy (if none is provided, it always returns true)
     * @tag [TERMINATOR]
     */
    singleOrNull(predicate = () => true) {
        const arr = this.filter(predicate).toArray();
        return arr.length === 1 ? arr[0] : null;
    }
    /**
     * Get the single value from the stream that satisfies the predicate, or the default value if there is none or more
     * @param defaultValue - The value to return if there's no item or multiple items that satisfy the predicate
     * @param predicate - The predicate to satisfy
     * @tag [TERMINATOR]
     */
    singleOr(defaultValue, predicate = () => true) {
        var _a;
        return (_a = this.singleOrNull(predicate)) !== null && _a !== void 0 ? _a : defaultValue;
    }
    /**
     * Get the single value from the stream that satisfies the predicate, or throw
     * @param predicate - The predicate to satisfy
     * @throws {StreamElementNotFound}
     * @tag [TERMINATOR]
     */
    single(predicate = () => true) {
        const value = this.singleOrNull(predicate);
        if (value === null) {
            throw new StreamElementNotFound();
        }
        return value;
    }
    /**
     * Unzip a stream of pairs into a pair of arrays
     * @tag [TERMINATOR]
     */
    unzip() {
        return this.reduce(function (acc, [lhs, rhs]) {
            acc[0].push(lhs);
            acc[1].push(rhs);
            return acc;
        }, [[], []]);
    }
    /**
     * Convert the stream into an object
     * @param keyExtractor - The function used to get the key from the item
     * @param valueExtractor - The function used to get the value from the item
     * @param initialObject - The object to add values to (defaults to a new empty object)
     * @tag [TERMINATOR]
     */
    toObject(keyExtractor, valueExtractor, initialObject = {}) {
        return this.reduce(function (obj, item) {
            const key = keyExtractor(item);
            obj[key] = valueExtractor(item);
            return obj;
        }, initialObject);
    }
    /**
     * Convert the stream into an object whose values are the items of the stream
     * @param keyExtractor - The function used to extract the key from an item
     * @param initialObject - The object to add values to (defaults to a new empty object)
     * @tag [TERMINATOR]
     */
    toObjectBy(keyExtractor, initialObject = {}) {
        return this.toObject(keyExtractor, (x) => x, initialObject);
    }
    /**
     * Convert the stream into a {@link Set}
     * @param initialSet - The set to add values to (defaults to a new empty set)
     * @returns
     */
    toSet(initialSet = new Set()) {
        return this.reduce(function (set, item) {
            set.add(item);
            return set;
        }, initialSet);
    }
    /**
     * Convert the stream into a {@link Map}
     * @param keyExtractor - The function used to get the key from the item
     * @param valueExtractor - The function used to get the value from the item
     * @param initialMap - The map to add values to (defaults to a new empty map)
     * @tag [TERMINATOR]
     */
    toMap(keyExtractor, valueExtractor, initialMap = new Map()) {
        return this.reduce(function (map, item) {
            const key = keyExtractor(item);
            const value = valueExtractor(item);
            map.set(key, value);
            return map;
        }, initialMap);
    }
    /**
     * Convert the stream into a {@link Map} whose values are the items of the stream
     * @param keyExtractor - The function used to extract the key from an item
     * @param initialObject - The map to add values to (defaults to a new empty map)
     * @tag [TERMINATOR]
     */
    toMapBy(keyExtractor, initialMap = new Map()) {
        return this.toMap(keyExtractor, (value) => value, initialMap);
    }
}
//# sourceMappingURL=stream.js.map