export function isIterable(obj) {
    // checks for null and undefined
    if (typeof obj === "undefined" || obj === null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === "function";
}
export const isNullish = (value) => typeof value === "undefined" || value === null;
export const KeyGen = {
    entries: ([k, _]) => k,
};
export const ValueGen = {
    entries: ([_, v]) => v,
};
export const Compare = {
    asc: (lhs, rhs) => {
        if (lhs == rhs)
            return 0;
        else
            return lhs < rhs ? -1 : 1;
    },
    desc: (lhs, rhs) => Compare.asc(rhs, lhs),
    mapped: {
        asc: (fn) => (lhs, rhs) => Compare.asc(fn(lhs), fn(rhs)),
        desc: (fn) => (lhs, rhs) => Compare.desc(fn(lhs), fn(rhs)),
    },
};
//# sourceMappingURL=utils.js.map