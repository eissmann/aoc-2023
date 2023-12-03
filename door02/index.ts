import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const isImpossible = (line: string) => {
    return null !== line.match(/(1[3-9]|[2-9][0-9]|\d{3,})(?= red)|(1[4-9]|[2-9][0-9]|\d{3,})(?= green)|(1[5-9]|[2-9][0-9]|\d{3,})(?= blue)/gi)
}

const solvePart1 = (values: string[]): number => {
    return values.reduce((acc: number, line: string, idx: number) => {
        if (isImpossible(line)) {
            return acc;
        }
        return acc + (idx + 1);
    }, 0);
}

const solvePart2 = (values: string[]): number => {
    return values.reduce((acc: number, line: string, idx: number) => {

        const reds = Math.max(
            ...[...(
                line.match(/\d+(?= red)/gi) || [1]).map((val) => parseInt(val.toString(), 10)
            )]
        );
        const greens = Math.max(
            ...[...(
                line.match(/\d+(?= green)/gi) || [1]).map((val) => parseInt(val.toString(), 10)
            )]
        );
        const blues = Math.max(
            ...[...(
                line.match(/\d+(?= blue)/gi) || [1]).map((val) => parseInt(val.toString(), 10)
            )]
        );
        return acc + (reds * greens * blues);
    }, 0);
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values))
}

solve()