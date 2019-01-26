import { BaseStreamIterator } from "./abstractions/BaseStreamIterator"
import { StreamIterator } from "./abstractions/StreamIterator"
import { Mapper, Predicate, Consumer, Reducer } from "./types/functions"

import { ArrayIterator } from "./creators/ArrayIterator"
import { RangeIterator } from "./creators/RangeIterator"

import { MapIterator } from "./intermediary/MapIterator"
import { TakeIterator } from "./intermediary/indexManipulation/TakeIterator"
import { FilterIterator } from "./intermediary/FilterIterator"
import { PeekIterator } from "./intermediary/PeekIterator"
import { UniqueIterator } from "./intermediary/UniqueIterator";

import { SkipIterator } from "./intermediary/indexManipulation/SkipIterator";
// import { BetweenIterator } from "./intermediary/indexManipulation/BetweenIterator";

import { ForEachIterator } from "./terminators/ForEachIterator"
import { ReduceIterator } from "./terminators/ReduceIterator"
import { AllIterator } from "./terminators/predicateTests/AllIterator";
import { AnyIterator } from "./terminators/predicateTests/AnyIterator";
import { NoneIterator } from "./terminators/predicateTests/NoneIterator";

import { ArrayPackerIterator } from "./terminators/packers/ArrayPackerIterator";
import { ObjectPackerByIterator } from "./terminators/packers/ObjectPackerByIterator";
import { ObjectPackerIterator } from "./terminators/packers/ObjectPackerIterator";
import { SetPackerIterator } from "./terminators/packers/SetPackerIterator";
import { MapPackerByIterator } from "./terminators/packers/MapPackerByIterator";
import { MapPackerIterator } from "./terminators/packers/MapPackerIterator";

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
    private static make<T>(it: BaseStreamIterator<T>): Stream<T>{
        return new Stream<T>(it);
    }

    public static of<T>(...args: T[]): Stream<T>{
        return this.from<T>(args);
    }

    public static from<T>(args: T[]): Stream<T>{
        return this.make<T>(
            new ArrayIterator<T>(args)
        );
    }

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

    public static infinite(lower: number = 0, step: number = 1): Stream<number>{
        return this.range(lower, Infinity, step);
    }



    /************************************************************************\
     * UTILS
    \************************************************************************/
    public clone(): Stream<T>{
        return Stream.make<T>(this.it.clone());
    }



    /************************************************************************\
     * INTERMEDIATES
    \************************************************************************/
    public map<U>(mapper: Mapper<T, U>): Stream<U>{
        return Stream.make<U>(
            new MapIterator<T, U>(this.it, mapper)
        );
    }

    public filter(predicate: Predicate<T>){
        return Stream.make<T>(
            new FilterIterator<T>(this.it, predicate)
        );
    }

    public peek(functor: Consumer<T>){
        return Stream.make<T>(
            new PeekIterator<T>(this.it, functor)
        );
    }

    public unique(){
        return Stream.make<T>(
            new UniqueIterator<T>(this.it)
        );
    }

        /********************************************************************\
         * INDEX MANIPULATION
        \********************************************************************/
    public take(amount: number = 10){
        return Stream.make<T>(
            new TakeIterator<T>(this.it, amount)
        );
    }

    public skip(amount: number = 10){
        return Stream.make<T>(
            new SkipIterator<T>(this.it, amount)
        );
    }

    public between(begin: number = 0, end: number = 10, excludeRight: boolean = false){
        /* return Stream.make<T>(
            new BetweenIterator<T>(this.it, begin, end)
        ); */
        const takeAmount = excludeRight ? end - begin : end - begin + 1;
        return this.skip(begin-1).take(takeAmount);
    }



    /************************************************************************\
     * TERMINATORS
    \************************************************************************/
    public forEach(functor: Consumer<T>): void{
        new ForEachIterator<T>(this.it, functor);
    }

    public reduce<Acc>(reducer: Reducer<Acc, T>, acc: Acc): Acc{
        const it = new ReduceIterator<Acc, T>(this.it, reducer, acc);
        return it.process();
    }

        /********************************************************************\
         * PREDICATE TESTS
        \********************************************************************/
    public all(predicate: Predicate<T>): boolean{
        const it = new AllIterator<T>(this.it, predicate);
        return it.process();
    }

    public any(predicate: Predicate<T>): boolean{
        const it = new AnyIterator<T>(this.it, predicate);
        return it.process();
    }

    public none(predicate: Predicate<T>): boolean{
        const it = new NoneIterator<T>(this.it, predicate);
        return it.process();
    }

        /********************************************************************\
         * PACKERS
        \********************************************************************/
    public pack = {
        stream: this,
        it(): BaseStreamIterator<T>{
            return this.stream.it;
        },
        toArray(): T[]{
            const it = new ArrayPackerIterator<T>(this.it());
            return it.process();
        },
        toObjectBy(keyGen: Mapper<T, any>): object{
            const it = new ObjectPackerByIterator<T>(this.it(), keyGen);
            return it.process();
        },
        toObject<U>(keyGen: Mapper<T, any>, valueGen: Mapper<T, U>): object{
            const it = new ObjectPackerIterator<T, U>(this.it(), keyGen, valueGen);
            return it.process();
        },
        toSet(): Set<T>{
            const it = new SetPackerIterator<T>(this.it());
            return it.process();
        },
        toMapBy<K>(keyGen: Mapper<T, K>): Map<K, T>{
            const it = new MapPackerByIterator<K, T>(this.it(), keyGen);
            return it.process();
        },
        toMap<K, V>(keyGen: Mapper<T, K>, valueGen: Mapper<T, V>): Map<K, V>{
            const it = new MapPackerIterator<K, V, T>(this.it(), keyGen, valueGen);
            return it.process();
        }
    };
}