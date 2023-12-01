export const uniqueStringIntersections = (a: string, b: string): string => {

    return String.prototype.concat(
        ...new Set(
            (a.match(new RegExp('[' + b + ']', 'g')) || []).join('')
        )
    )
}