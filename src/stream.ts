import { BaseStreamIterator } from "./abstractions/BaseStreamIterator"
import { Mapper, Predicate, Consumer, Reducer } from "./types/functions"

import { ArrayIterator } from "./creators/ArrayIterator"
import { ObjectIterator } from "./creators/ObjectIterator"
import { RangeIterator } from "./creators/RangeIterator"

import { MapIterator } from "./intermediary/MapIterator"
import { TakeIterator } from "./intermediary/indexManipulation/TakeIterator"
import { FilterIterator } from "./intermediary/FilterIterator"
import { PeekIterator } from "./intermediary/PeekIterator"
import { UniqueIterator } from "./intermediary/UniqueIterator";
import { UniqueByIterator } from "./intermediary/UniqueByIterator";
import { ChunkIterator } from "./intermediary/ChunkIterator";

import { SkipIterator } from "./intermediary/indexManipulation/SkipIterator";
// import { BetweenIterator } from "./intermediary/indexManipulation/BetweenIterator";

import { ForEachIterator } from "./terminators/ForEachIterator"
import { ReduceIterator } from "./terminators/ReduceIterator"
import { CountIterator } from "./terminators/CountIterator";
import { AllIterator } from "./terminators/predicateTests/AllIterator";
import { AnyIterator } from "./terminators/predicateTests/AnyIterator";
import { NoneIterator } from "./terminators/predicateTests/NoneIterator";
import { AtIndexIterator } from "./terminators/indexBased/AtIndexIterator";

import { Packer } from "./packer"

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
     * @param obj - The object to create a stream from
     * @return {Stream}
     */
    public static fromObject(obj: object): Stream<[string, any]>{
        return this.make<[string, any]>(
            new ObjectIterator(obj)
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
}