![](logo_text.png)



## What is Streamz?

Streamz was a project made purely as a playground to look for ideas and ways to implement actual lazy evaluation of collection manipulations. It turns out this is a fairly usable implementation and could actually make a nice library.



Streamz is mainly inspired by [C#'s LINQ](https://docs.microsoft.com/dotnet/csharp/programming-guide/concepts/linq/introduction-to-linq-queries), [Java 8's Stream API](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html), [Rust's iter](https://doc.rust-lang.org/stable/std/iter/#laziness), [Kotlin's sequences](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html), [C++'s Range-v3](https://github.com/ericniebler/range-v3) and finally [sequency](https://www.npmjs.com/package/sequency).



## How to install Streamz?

First you need to install it via NPM : `npm i -S @voltra/streamz`

Streamz does not provide a direct "plug into browser" file yet so you'll be required to use a build system (if you are targeting browsers).



Once installed, you can simply require/import it :

```javascript
import { Stream } from "@voltra/streamz"
```



## What does Streamz provide?

Streamz was fully developed using typescript, therefore you have access to the entire source code in the `src` directory.



The entry point `dist/index.js` provides the following :

```javascript
import {
    Stream,
    Packer,
    KeyGen,
    ValueGen,
    emptyPayloadValue,
    isPayloadValueEmpty,
    streamIsValidValue,
    invalidStreamIteratorPayload
} from "@voltra/streamz"
```

* `Stream` is the class used for collection manipulation, it provides factories
* `Packer` is used to transform a `Stream` into a collection (e.g. an array, an object, a `Map`, a `Set`, etc...)
* `KeyGen` is an helper object that contains functions destined to be used in `Packer#toObject` and similar methods
* `ValueGen` is an helper object that contains functions destined to be used in `Packer#toObject` and similar methods
* `emptyPayloadValue` is a global `Symbol` use to mark invalid payloads
* `isPayloadValueEmpty` is a function that checks whether or not the given value is one of an invalid payload
* `streamIsValidValue` is a function that checks whether or not the given value is valid (not from an invalid payload)
* `invalidStreamIteratorPayload` is a factory for invalid payloads



`src/index.ts` provides the following :

```typescript
import {
    Stream,
    Packer,
    KeyGen,
    ValueGen,
    emptyPayloadValue,
    isPayloadValueEmpty,
    streamIsValidValue,
    invalidStreamIteratorPayload,
    BaseStreamIterator,
    EndStreamIterator,
    StreamIteratorPayload
} from "@voltra/streamz/src/index"
```

* `BaseStreamIterator` is an interface that represents both first and intermediate iterators in the iterator chain (i.e. operation chain)
* `EndStreamIterator` is an interface that represents the final iterator in the iterator chain (i.e. operation chain)
* `StreamIteratorPayload` is an interface that represents the payload retrieved when calling `next` on an iterator



Helper types are provided under `src/types` (`function.d.ts` and `helpers.d.ts`).



## Streamz in details

A complete JSDoc will be provided once ready.



### Factories (creators)

Streamz is not a usual object, it doesn't really expect you to call its constructor, it provides a lot of static factory methods in order for you to get the most fluent experience possible :

* `Stream.of(...args)` takes any amount of parameters and makes a stream out of it
* `Stream.from(args)` takes an array and makes a stream out of it
* `Stream.fromObject(obj)` takes an object and makes a stream out of it
* `Stream.range(higher)` takes a number used as its lower bound makes the range [0 ; higher) as a stream
* `Stream.range(lower, higher, step = 1)` takes both bounds, the step and makes the range [lower ; higher) as a stream (uses `step` as increment instead of 1)
* `Stream.infinite(lower = 0)` makes a stream for the range [lower ; Infinity)



### Intermediate computations (intermediary)

Streamz offers a lot of intermediate computations, these are not effective until a blocking computation is requested :

* `Stream#map(mapper)` maps each element using the provided mapper function
* `Stream#filter(predicate)` only gives back elements that satisfy the provided predicate
* `Stream#peek(functor)` applies the function on each element and passes it
* `Stream#unique()` removes duplicates (uses a `Set` behind the scenes to check for duplicates)
* `Stream#take(amount = 10)` only keeps the first `x ≤ amount` elements
* `Stream#skip(amount = 10)` skips the first `x ≤ amount ` elements
* `Stream#between(begin = 0, end = 10, excludeRight = false)` takes the element whose index is in the range [begin ; end] if `excludeRight == false` otherwise from [begin ; end)



### Blocking computations (terminators)

#### Operations

##### Common

* `Stream#forEach(functor)` applies the provided function on each element
* `Stream#reduce(reducer, acc)` computes the reduced value by getting a new `acc` by applying the reducer function and the current `acc` and the current element



##### Predicative

* `Stream#all(predicate)` checks whether or not every element satisfies the given predicate
* `Stream#any(predicate)` checks whether or not any element satisfies the given predicate
* `Stream#none(predicate)` checks whether or not none of the elements satisfies the given predicate



#### Packing

`Stream#pack` is an instance of `Packer` and exposes the following :

* `Packer#toArray()` converts the stream into an array
* `Packer#toObjectBy(keyGen)` converts the stream into an object whose keys are generated using `keyGen` on the current element and whose values are the elements of the stream
* `Packer#toObject(keyGen, valueGen)` converts the stream into an object whose keys and values are generated using the current element on `keyGen` and `valueGen`
* `Packer#toSet()` converts the stream into a `Set`
* `Packer#toMapBy(keyGen)` converts the stream into a `Map` whose keys are generated using `keyGen` on the current element and whose values are the elements of the stream
* `Packer#toMap(keyGen, valueGen)` converts the stream into a `Map` whose keys and values are generated using the current element on `keyGen` and `valueGen`



## Examples

```javascript
import { Stream, KeyGen, ValueGen } from "@voltra/streamz"

Stream.of(1, 2, 3, 4) //Stream{1, 2, 3, 4}
.map(x => x+1) //Stream{2, 3, 4, 5}
.filter(x => x%2) //Stream{3, 5}
.pack.toArray(); //[3, 5]


Stream.fromObject({hello: "world", wombo: "combo"})
.map(([k, v]) => ([`key(${k})`, `value(${v})`])) 
.pack.toObject(KeyGen.entries, ValueGen.entries); 
//Stream{["hello", "world"], ["wombo", "combo"]}
//Stream{["key(hello)", "value(world)"], ["key(wombo)", "value(combo)"]}
//{"key(wombo)": "value(combo)", "key(hello)": "value(world)"}


Stream.of(1, 2, 1, 1, 2, 1) //Stream{1, 2, 1, 1, 2, 1}
.map(x => x+1) //Stream{2, 3, 2, 2, 3, 2}
.unique() //Stream{2, 3}
.pack.toArray(); //[2, 3]


Stream.of(2, 4, 6, 8) //Stream{2, 4, 6, 8}
.map(x => x+1) //Stream{3, 5, 7, 9}
.all(x => x%2); //true
```



```javascript
import { Stream } from "@voltra/streamz"

const X = Stream.of(1, 2, 3, 4)
.map(x => x+1)
.filter(x => x%2)
.pack.toArray();
console.log(X);

//Is roughly equivalent to

const X = [];
for(const it in [1, 2, 3, 4]){
    const x = it+1;
    if(x % 2)
        X.push(x);
}
console.log(X);
```

