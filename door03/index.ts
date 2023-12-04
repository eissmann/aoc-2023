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
    return 0;
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values))
}

solve()