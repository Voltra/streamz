import { BaseStreamIterator } from "./abstractions/BaseStreamIterator"
import { Mapper, Predicate, Consumer, Reducer, BiFn } from "./types/functions"

import { ArrayIterator } from "./creators/ArrayIterator"
import { ObjectIterator } from "./creators/ObjectIterator"
import { RangeIterator } from "./creators/RangeIterator"
import { MapIterator as MapCreatorIterator } from "./creators/MapIterator"
import { SetIterator } from "./creators/SetIterator"

import { MapIterator } from "./intermediary/MapIterator"
import { TakeIterator } from "./intermediary/indexManipulation/TakeIterator"
import { FilterIterator } from "./intermediary/FilterIterator"
import { PeekIterator } from "./intermediary/PeekIterator"
import { UniqueIterator } from "./intermediary/UniqueIterator";
import { UniqueByIterator } from "./intermediary/UniqueByIterator";
import { ChunkIterator } from "./intermediary/ChunkIterator";
import { ZipIterator } from "./intermediary/zipping/ZipIterator";
import { ZipByIterator } from "./intermediary/zipping/ZipByIterator";

import { SkipIterator } from "./intermediary/indexManipulation/SkipIterator";
// import { BetweenIterator } from "./intermediary/indexManipulation/BetweenIterator";
import { TakeWhileIterator } from "./intermediary/indexManipulation/TakeWhileIterator";

import { ForEachIterator } from "./terminators/ForEachIterator"
import { ReduceIterator } from "./terminators/ReduceIterator"
import { CountIterator } from "./terminators/CountIterator";
import { AllIterator } from "./terminators/predicateTests/AllIterator";
import { AnyIterator } from "./terminators/predicateTests/AnyIterator";
import { NoneIterator } from "./terminators/predicateTests/NoneIterator";
import { AtIndexIterator } from "./terminators/indexBased/AtIndexIterator";
import { UnzipIterator } from "./terminators/zipping/UnzipIterator";
import { UnzipByIterator } from "./terminators/zipping/UnzipByIterator";
import { UnzipViaIterator } from "./terminators/zipping/UnzipViaIterator";

import { Packer } from "./packer"
import { KeyGen, ValueGen, Compare } from "./utils";

/**
 * @class Stream
 * An object capable of lazily manipulating collections
 */
export class Stream<T>{
    /************************************************************************\
     * CONSTRUCTOR
    \************************************************************************/
    private constructor(
        protected it: BaseStreamIterator<T>
    ){}



    /************************************************************************\
     * FACTORIES
    \************************************************************************/
    /**
     * Create a stream from an iterator
     * @return {Stream}
     */
    private static make<T>(it: BaseStreamIterator<T>): Stream<T>{
        return new Stream<T>(it);
    }

    /**
     * Creates a stream from a comma separated list of arguments
     * @param args - variadic arguments
     */
    public static of<T>(...args: T[]): Stream<T>{
        return this.from<T>(args);
    }

    /**
     * Creates a stream from an array
     * @param {T[]} args - The array to create a stream from
     * @return {Stream}
     */
    public static from<T>(args: T[]): Stream<T>{
        return this.make<T>(
            new ArrayIterator<T>(args)
        );
    }

    /**
     * Creates a stream from the entries of the given object
     * @param {obj} obj - The object to create a stream from
     * @return {Stream}
     */
    public static fromObject(obj: object): Stream<[string, any]>{
        return this.make<[string, any]>(
            new ObjectIterator(obj)
        );
    }

    /**
     * Creates a stream from the entries of the given map
     * @param {Map} map - The map to create a stream from
     * @return {Stream}
     */
    public static fromMap<K, V>(map: Map<K, V>): Stream<(K|V)[]>{
        return this.make(
            new MapCreatorIterator(map)
        );
    }

    /**
     * Creates a stream from the values of the given set
     * @param {Set} set - The set to create a stream from
     * @return {Stream}
     */
    public static fromSet<T>(set: Set<T>): Stream<T>{
        return this.make(
            new SetIterator(set)
        );
    }

    /**
     * Creates a stream for a range of numbers
     * @param {number} lower - The lower bound (or higher bound of no other parameters)
     * @param {number|null} higher - The higher bound
     * @param {number} step - The increment value
     * @return {Stream}
     */
    public static range(
        lower: number = 0,
        higher: number|null = null,
        step: number = 1
    ): Stream<number>{
        const it = higher === null
        ? new RangeIterator(0, lower, step)
        : new RangeIterator(lower, higher, step);

        return this.make<number>(it);
    }

    /**
     * Creates an infinite stream of values from the lower bound to positive infinity
     * @param {number} lower - The lower bound
     * @param {number} step - The increment value
     * @return {Stream}
     */
    public static infinite(lower: number = 0, step: number = 1): Stream<number>{
        return this.range(lower, Infinity, step);
    }



    /************************************************************************\
     * UTILS
    \************************************************************************/
    /**
     * Creates a "clone" of this stream using the iterators' cloning semantics
     * @return {Stream}
     */
    public clone(): Stream<T>{
        return Stream.make<T>(this.it.clone());
    }



    /************************************************************************\
     * INTERMEDIATES
    \************************************************************************/
    /**
     * Maps a T to a U using the given mapper funciton
     * @param {Mapper<T, U>} mapper - The mapper function
     * @return {Stream}
     */
    public map<U>(mapper: Mapper<T, U>): Stream<U>{
        return Stream.make<U>(
            new MapIterator<T, U>(this.it, mapper)
        );
    }

    /**
     * Filters values according to the given predicate
     * @param {Predicate<T>} predicate - The predicate to match
     * @return {Stream}
     */
    public filter(predicate: Predicate<T>){
        return Stream.make<T>(
            new FilterIterator<T>(this.it, predicate)
        );
    }

    /**
     * Applies a function to each value and passes the value
     * @param {Consumer<T>} functor - The function to call
     * @return {Stream}
     */
    public peek(functor: Consumer<T>){
        return Stream.make<T>(
            new PeekIterator<T>(this.it, functor)
        );
    }

    /**
     * Removes duplicates from the stream
     * @return {Stream}
     */
    public unique(){
        return Stream.make<T>(
            new UniqueIterator<T>(this.it)
        );
    }

    /**
     * Removes duplicates based on a selector
     * @param {Mapper<T, U>} selector - The mapper function that generates the "key" for comparison
     * @return {Stream}
     */
    public uniqueBy<U>(selector: Mapper<T, U>){
        return Stream.make<T>(
            new UniqueByIterator<T, U>(this.it, selector)
        );
    }

    /**
     * Puts the items of the stream into chunks
     * @param {number} size - The max size of each chunk
     * @return {Stream}
     */
    public chunked(size: number = 3){
        return Stream.make<T[]>(
            new ChunkIterator<T>(this.it, size)
        );
    }

        /************************************************************************\
         * ZIPPING
        \************************************************************************/
    /**
     * Zips this stream with another
     * @param {Stream} stream - The stream to zip with
     * @return {Stream}
     */
    public zip<U>(stream: Stream<U>){
        return Stream.make<[T, U]>(
            new ZipIterator<T, U>(this.it, stream.it)
        );
    }

    /**
     * Zips this stream with another using the zipping function
     * @param {Stream} stream - The stream to zip with
     * @param {BiFn<V, T, U>} mapper - Maps both items into the new item
     * @return {Stream}
     */
    public zipBy<U, V>(stream: Stream<U>, mapper: BiFn<V, T, U>){
        return Stream.make<V>(
            new ZipByIterator<T, U, V>(this.it, stream.it, mapper)
        );
    }

    /**
     * Static helper for combining streams
     * @param {Stream} lhs - Ths LHS stream to zip with
     * @param {Stream} rhs - The RHS stream to zip with
     * @return {Stream}
     */
    public static zip<T, U>(lhs: Stream<T>, rhs: Stream<U>): Stream<[T, U]>{
        return lhs.zip<U>(rhs);
    }

    /**
     * Static helper for combining streams using a zipper function
     * @param {Stream} lhs - Ths LHS stream to zip with
     * @param {Stream} rhs - The RHS stream to zip with
     * @param {BiFn<V, T, U>} zipper - The zipper function
     * @return {Stream}
     */
    public static zipBy<T, U, V>(lhs: Stream<T>, rhs: Stream<U>, zipper: BiFn<V, T, U>): Stream<V>{
        return lhs.zipBy<U, V>(rhs, zipper);
    }

        /********************************************************************\
         * INDEX MANIPULATION
        \********************************************************************/
    /**
     * Keeps exactly the given amount of items in the stream (or less if it can't)
     * @param {number} amount - The maximum amount of items to keep
     * @return {Stream}
     */
    public take(amount: number = 10){
        return Stream.make<T>(
            new TakeIterator<T>(this.it, amount)
        );
    }

    /**
     * Skips exactly the given amount of items before passing its first value
     * @param {number} amount - The maximum amount of items to skip
     * @return {Stream}
     */
    public skip(amount: number = 10){
        return Stream.make<T>(
            new SkipIterator<T>(this.it, amount)
        );
    }

    /**
     * Keeps only the items within the range [begin;end] or [begin;end) depending on a flag
     * @param {number} begin - The index to begin from
     * @param {number} end - The index to end from
     * @param {boolean} excludeRight - Determines whether or not the end should be included or not
     * @return {Stream}
     */
    public between(begin: number = 0, end: number = 10, excludeRight: boolean = false){
        /* return Stream.make<T>(
            new BetweenIterator<T>(this.it, begin, end)
        ); */
        const takeAmount = excludeRight ? end - begin : end - begin + 1;
        return this.skip(begin-1).take(takeAmount);
    }

    /**
     * Keeps items that satisfy the predicate until one does not
     * @param {Predicate<T>} predicate - The predicate to satisfy
     * @return {Stream}
     */
    public takeWhile(predicate: Predicate<T>){
        return Stream.make<T>(
            new TakeWhileIterator(this.it, predicate)
        );
    }

    /**
     * Keeps items that do not satisfy the predicate until one does
     * @param {Predicate<T>} predicate - The predicate to not satisfy
     * @return {Stream}
     */
    public takeUntil(predicate: Predicate<T>){
        return this.takeWhile(v => !predicate(v));
    }

        /********************************************************************\
         * FILTERING
        \********************************************************************/
    /**
     * Only keeps non null items
     * @return  {Stream}
     */
    public nonNull = () => this.filter(v => v !== null);

    /**
     * Only keeps non falsy items
     * @return  {Stream}
     */
    public nonFalsy = () => this.filter(v => !!v);

    /**
     * Only keeps items that do not satisfy the given predicate
     * @param {Predicate<T>} predicate - The predicate that must not be satisfied
     * @return  {Stream}
     */
    public filterNot = (predicate: Predicate<T>) => this.filter(v => !predicate(v));

    /**
     * @alias filterOut
     * Alias for Stream#filterNot
     */
    public filterOut = (predicate: Predicate<T>) => this.filterNot(predicate);

    /**
     * Only keeps items that are instance of the provided class
     * @param {Function} _class - The class to test from
     * @return  {Stream}
     */
    public filterIsIntance = (_class: Function) => this.filter(v => v instanceof Function);



    /************************************************************************\
     * TERMINATORS
    \************************************************************************/
    /**
     * Consumes the stream and apply a function on each item
     * @param {Consumer<T>} functor - The function to apply
     */
    public forEach(functor: Consumer<T>): void{
        new ForEachIterator<T>(this.it, functor);
    }

    /**
     * Consumes the stream and reduces its values into a single result
     * @param {Reducer<Acc, T>} reducer - The reducer function
     * @param {Acc} acc - The initial value of the accumulator/result
     * @return {Acc}
     */
    public reduce<Acc>(reducer: Reducer<Acc, T>, acc: Acc): Acc{
        const it = new ReduceIterator<Acc, T>(this.it, reducer, acc);
        return it.process();
    }

    /**
     * Counts the amount of items (that satisfy the predicate if one is given)
     * @param {Predicate<T>} predicate - The predicate to match in order to be counted
     * @return {number}
     */
    public count(predicate: Predicate<T> = (_ => true)): number{
        const it = new CountIterator<T>(this.it, predicate);
        return it.process();
    }



        /********************************************************************\
         * PREDICATE TESTS
        \********************************************************************/
    /**
     * Consumes the stream and tests whether or not all items matches the given predicate
     * @param {Predicate<T>} predicate - The predicate to match
     * @return {boolean}
     */
    public all(predicate: Predicate<T>): boolean{
        const it = new AllIterator<T>(this.it, predicate);
        return it.process();
    }

    /**
     * Consumes the stream and tests whether or not any item matches the given predicate
     * @param {Predicate<T>} predicate - The predicate to match
     * @return {boolean}
     */
    public any(predicate: Predicate<T>): boolean{
        const it = new AnyIterator<T>(this.it, predicate);
        return it.process();
    }

    /**
     * Consumes the stream and tests whether or not none of the items matches the given predicate
     * @param {Predicate<T>} predicate - The predicate to match
     * @return {boolean}
     */
    public none(predicate: Predicate<T>): boolean{
        const it = new NoneIterator<T>(this.it, predicate);
        return it.process();
    }

    /**
     * Consumes the stream and tests whether or not it contains elem
     * @param {T} elem - The item to look for
     * @return {boolean}
     */
    public contains(elem: T): boolean{
        return this.any(v => v === elem);
    }



        /********************************************************************\
         * INDEX BASED
        \********************************************************************/
    public atIndex(index: number): T|null{
        const it = new AtIndexIterator<T>(this.it, index);
        return it.process();
    }

    public atIndexOr(index: number, fallback: T): T{
        return this.atIndex(index) || fallback;
    }

    public first(): T|null{
        return this.atIndex(0);
    }

    public firstOr(fallback: T): T{
        return this.atIndexOr(0, fallback);
    }



        /********************************************************************\
         * PACKERS
        \********************************************************************/
    /**
     * @var pack
     * The packer for this stream
     */
    public get pack(): Packer<T>{
        return new Packer(this.it);
    }

        /************************************************************************\
         * ZIPPING
        \************************************************************************/
    /**
     * Zips then pack to an object (using this as keys and the provided stream as values)
     * @param {Stream} stream - The stream to zip with
     * @return {object}
     */
    public zipToObject<U>(stream: Stream<U>){
        return this.zip(stream).pack.toObject(KeyGen.entries, ValueGen.entries);
    }

    /**
     * Static helper for zipping to an object
     * @param keys - The stream of keys
     * @param values - The stream of values
     * @return {object}
     */
    public static zipToObject<T, U>(keys: Stream<T>, values: Stream<U>){
        return keys.zipToObject(values);
    }

    /**
     * Consumes the stream and unzips it
     * @return {[X[], U[]]}
     */
    public unzip<X, U>(){
        const it = new UnzipIterator<X, U>(this.it as BaseStreamIterator<[X, U]>);
        return it.process();
    }

    /**
     * Consumes the stream and unzips using the mapper functions
     * @param {Mapper<T, X>} firstGen - Maps the item to the first value of the result
     * @param {Mapper<T, U>} lastGen - Maps the item to the last value of the result
     * @return {[X[], U[]]}
     */
    public unzipBy<X, U>(firstGen: Mapper<T, X>, lastGen: Mapper<T, U>){
        const it = new UnzipByIterator<X, U, T>(this.it, firstGen, lastGen);
        return it.process();
    }

    /**
     * Consumes the stream and unzips via the provided mapper functions
     * @param {Mapper<T, (X|U)[]>} mapper - Maps the item to a [X, U]
     * @return {[X[], U[]]}
     */
    public unzipVia<X, U>(mapper: Mapper<T, [X, U]>){
        const it = new UnzipViaIterator<X, U, T>(this.it, mapper);
        return it.process();
    }

        /************************************************************************\
         * SORTING
        \************************************************************************/
    public sortedWith(comparator: BiFn<number, T, T>){
        return this.pack.toArray().sort(comparator);
    }

    public sortedBy<U>(mapper: Mapper<T, U>){
        return this.sortedWith(Compare.mapped.asc<T, U>(mapper));
    }

    public sortedByDesc<U>(mapper: Mapper<T, U>){
        return this.sortedWith(Compare.mapped.desc<T, U>(mapper));
    }

    public sorted(){
        return this.sortedBy<T>(x => x);
    }

    public sortedDesc(){
        return this.sortedByDesc<T>(x => x);
    }
}