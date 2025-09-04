import _ from "lodash";

/**
 * Shellow because if you need to do a deep diff, you should use recursive function.
 * @param a
 * @param b
 * @returns
 */
function shallowDiffObjects<T extends object>(a: T, b: T): Partial<T> {
    return _.omitBy(b, (val, key) => _.isEqual(val, a[key as keyof T]));
}

export default shallowDiffObjects;
