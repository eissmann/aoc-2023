import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const isDotOrNumber = (char: string, includeNumbers = true) => {
    return (includeNumbers && Number.isInteger(char)) || char === '.';
}

const lineHasOnlyDotsOrNumbers = (line: string, idxStart: number, idxEnd: number) => {
    const subLine = line.slice(idxStart, idxEnd+1).split('');
    return subLine.filter((char) => !isDotOrNumber(char, false)).length === 0;

}
const solvePart1 = (values: string[]): number => {
    const lineCount = values.length;
    return values.reduce((acc: number, line: string, idx: number) => {
        const numbers = [...line.matchAll(/\d+/gi)] || [];
        const sum = numbers.reduce((acc: number, match: RegExpMatchArray) => {
            const len = match[0].toString().length;
            const charIdx: number = match['index'] === undefined ? -1 : match['index'];

            if (charIdx === -1) {
                return acc;
            }

            // first
            if (charIdx > 0 && !isDotOrNumber(values[idx][charIdx-1])) {
                return acc + parseInt(match[0], 10);
            }

            // last
            if (charIdx+len <= line.length-1 && !isDotOrNumber(values[idx][charIdx+len])) {
                return acc + parseInt(match[0], 10);
            }

            // line above
            if (idx > 0) {
                const lineAbove = values[idx-1];
                const startIndex = charIdx -1;
                const endIndex = charIdx+len;

                if (!lineHasOnlyDotsOrNumbers(lineAbove, startIndex < 0 ? 0 : startIndex, endIndex)) {
                    return acc + parseInt(match[0], 10);
                }
            }

            // line below
            if (idx < lineCount - 1) {
                const lineBelow = values[idx+1];
                const startIndex = charIdx -1;
                const endIndex = charIdx+len;


                if (!lineHasOnlyDotsOrNumbers(lineBelow, startIndex < 0 ? 0 : startIndex, endIndex)) {
                    return acc + parseInt(match[0], 10);
                }
            }
            return acc;
        }, 0);

        return acc + sum;
    }, 0);
}

const solvePart2 = (values: string[]): number => {
    return values.reduce((acc: number, line: string, idx: number) => {
        const possibleGears = [...line.matchAll(/\*/gi)] || [];

        if (possibleGears.length === 0) {
            return acc;
        }

        // find connecting numbers in same line
        const numbersSameLine = [...line.matchAll(/\d+/gi)] || [];

        // in line above
        const numbersLineAbove = idx > 0 ? [...values[idx-1].matchAll(/\d+/gi)] || [] : [];

        // in line below
        const numbersLineBelow = idx < values.length - 1 ? [...values[idx+1].matchAll(/\d+/gi)] || [] : [];

        let result: number = 0;

        possibleGears.forEach((gear) => {
            const connectedNumbers: any[] = [];
            const gearIndex = gear['index'] === undefined ? -1 : gear['index'];

            if(gearIndex === -1) {
                return;
            }

            numbersSameLine.forEach((number) => {
                // does number connect to gear?
                const len = number[0].toString().length;
                const charIdx: number = number['index'] === undefined ? -1 : number['index'];

                if (charIdx === -1) {
                    return;
                }

                // number after
                if (charIdx === gearIndex+1) {
                    connectedNumbers.push(number);
                }

                if (charIdx+len === gearIndex) {
                    connectedNumbers.push(number);
                }
            });

            numbersLineAbove.forEach((number) => {
                // does number connect to gear?
                const len = number[0].toString().length;
                const charIdx: number = number['index'] === undefined ? -1 : number['index'];

                if (charIdx === -1) {
                    return false;
                }

                if (gearIndex <= charIdx+len && gearIndex >= charIdx-1) {
                    connectedNumbers.push(number);
                }
            });

            numbersLineBelow.forEach((number) => {
                // does number connect to gear?
                const len = number[0].toString().length;
                const charIdx: number = number['index'] === undefined ? -1 : number['index'];

                if (charIdx === -1) {
                    return false;
                }

                if (gearIndex <= charIdx+len && gearIndex >= charIdx-1) {
                    connectedNumbers.push(number);
                }
            });

            if (connectedNumbers.length > 1) {
                result += connectedNumbers.reduce((accInner: number, number: RegExpMatchArray) => {
                    return accInner * parseInt(number[0], 10);
                }, 1);
            }

        });

        return acc + result;
    }, 0);
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values))
}

solve()