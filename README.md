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



## Changes

A complete JSDoc will be provided once ready.

### v1.0.2

`extend` in `src/extend.ts` (also exported in `src/index.ts` and therefore in `dist/index.js`) :

* Installs global prototype extensions :
  * `Array#stream()` is `Stream.from(this)`
  * `Object#stream()` is `Stream.fromObject(this)`
  * `Set#stream()` is `Stream.fromSet(this)`
  * `Map#stream()` is `Stream.fromMap(this)`
* And class methods extensions
  * `Object.fromStreams` is `Stream.zipToObject`
  * `Number.range` is `Stream.range`
  * `Number.infiniteRange` is `Stream.infinite`



`Compare` in `src/utils.ts` (also exported in `src/index.ts` and therefore in `dist/index.js`) :

- `Compare.asc(lhs, rhs)` standard comparison function (ascending)
- `Compare.desc(lhs, rhs)` standard comparison function (descending)
- `Compare.mapped` "namespace" for mapped comparison functions
  - `Compare.mapped.asc(mapper)` crafts a `Compare#asc` where elements were mapped using `mapper`
  - `Compare.mapped.desc(mapper)` crafts a `Compare#desc` where elements were mapped using `mapper`



`Stream` initial operations :

* `Stream.fromMap(map)` creates a stream from a `Map`
* `Stream.fromSet(set)` creates a stream from a `Set`



`Stream` intermediate operations :

- Regular
  - `Stream#chunked(size = 3)` groups items in chunks whose size is at most `size`
- Zipping
  - `Stream#zip(stream)` combines this stream (makes a pair using one item from each stream)
  - `Stream.zip(lhs, rhs)` same as `lhs.zip(rhs)`
  - `Stream#zipBy(stream, mapper)` combines this stream using the mapper function to craft the new item
  - `Stream.zipBy(lhs, rhs, mapper)` same as `lhs.zipBy(rhs, mapper)`
- Filtering
  - `Stream#nonNull()` filters out any `null`
  - `Stream#nonFalsy()` filters out any falsy value (`0`, `null`, `undefined`, etc...)
  - `Stream#filterNot(predicate)` filters element that satisfy the predicate
  - `Stream#filterOut(predicate)` alias for `Stream#filterNot(predicate)`
  - `Stream#filterIsInstance(class)` filters out elements that are not instance of `class`
- Index manipulation
  - `Stream#takeWhile(predicate)` keeps item until `predicate` is not satisfied
  - `Stream#takeUntil(predicate)` keeps item while `predicate` is not satisfied



`Stream` terminal operations :

- Regular
  - `Stream#count(predicate = (_ => true))` counts the elements that satisfy the predicate
- Predicate tests
  - `Stream#contains(elem)` checks whether or not `elem` is an item of this stream
- Index based
  - `Stream#atIndex(index)` retrieves the element at the given index (or null if there is none)
  - `Stream#atIndexOr(index, default)` retrieves the element or get back `default`
  - `Stream#first()` retrieves the first element (or `null`)
  - `Stream#firstOr(default)` retrieves the first element (or `default`)
- Zipping
  - `Stream#zipToObject(stream)` zips into an object using `this` as keys and `stream` as values
  - `Stream.zipToObject(keys, values)` equivalent to `keys.zipToObject(values)`
  - `Stream#unzip()` unzips a stream of pairs into a pair of arrays
  - `Stream#unzipBy(firstGen, lastGen)` unzips a stream into a pair of arrays applying`firstGen` for the first element of the pair and `lastGen` for the last element of the pair
  - `Stream#unzipVia(mapper)` convenience method to unzip a stream of pairs into a pair of arrays using a single mapper function that returns a pair
- Sorting
  - `Stream#sortedWith(comparator)` packs to an array sorted using `comparator` as the comparison function
  - `Stream#sortedBy(mapper)` maps the objects and sort in ascending order via regular comparison operators
  - `Stream#sortedDescBy(mapper)` same as `sortedBy` but in descending order
  - `Stream#sorted()` same as `sortedBy` but without mapping
  - `Stream#sortedDesc()` same as `sorted` but in descending order

### v1.0.1 and inferior

#### Factories (creators)

Streamz is not a usual object, it doesn't really expect you to call its constructor, it provides a lot of static factory methods in order for you to get the most fluent experience possible :

- `Stream.of(...args)` takes any amount of parameters and makes a stream out of it
- `Stream.from(args)` takes an array and makes a stream out of it
- `Stream.fromObject(obj)` takes an object and makes a stream out of it
- `Stream.range(higher)` takes a number used as its lower bound makes the range [0 ; higher) as a stream
- `Stream.range(lower, higher, step = 1)` takes both bounds, the step and makes the range [lower ; higher) as a stream (uses `step` as increment instead of 1)
- `Stream.infinite(lower = 0)` makes a stream for the range [lower ; Infinity)



#### Intermediate computations (intermediary)

Streamz offers a lot of intermediate computations, these are not effective until a blocking computation is requested :

- `Stream#map(mapper)` maps each element using the provided mapper function
- `Stream#filter(predicate)` only gives back elements that satisfy the provided predicate
- `Stream#peek(functor)` applies the function on each element and passes it
- `Stream#unique()` removes duplicates (uses a `Set` behind the scenes to check for duplicates)
- `Stream#take(amount = 10)` only keeps the first `x ≤ amount` elements
- `Stream#skip(amount = 10)` skips the first `x ≤ amount ` elements
- `Stream#between(begin = 0, end = 10, excludeRight = false)` takes the element whose index is in the range [begin ; end] if `excludeRight == false` otherwise from [begin ; end)



#### Blocking computations (terminators)

##### Operations

###### Common

- `Stream#forEach(functor)` applies the provided function on each element
- `Stream#reduce(reducer, acc)` computes the reduced value by getting a new `acc` by applying the reducer function and the current `acc` and the current element



###### Predicative

- `Stream#all(predicate)` checks whether or not every element satisfies the given predicate
- `Stream#any(predicate)` checks whether or not any element satisfies the given predicate
- `Stream#none(predicate)` checks whether or not none of the elements satisfies the given predicate



##### Packing

`Stream#pack` is an instance of `Packer` and exposes the following :

- `Packer#toArray()` converts the stream into an array
- `Packer#toObjectBy(keyGen)` converts the stream into an object whose keys are generated using `keyGen` on the current element and whose values are the elements of the stream
- `Packer#toObject(keyGen, valueGen)` converts the stream into an object whose keys and values are generated using the current element on `keyGen` and `valueGen`
- `Packer#toSet()` converts the stream into a `Set`
- `Packer#toMapBy(keyGen)` converts the stream into a `Map` whose keys are generated using `keyGen` on the current element and whose values are the elements of the stream
- `Packer#toMap(keyGen, valueGen)` converts the stream into a `Map` whose keys and values are generated using the current element on `keyGen` and `valueGen`

