export function isCallable(thing) {
    return thing instanceof Function || typeof thing === 'function';
}
