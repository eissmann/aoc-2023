import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const findNextInRange = (range: number[]): number => {
    const diff: number[] = [];

    for (let i=0; i < range.length-1; i++) {
        diff.push(range[i+1] - range[i]);
    }

    if (diff.every((x) => x === 0)) {
        return range[range.length -1];
    } else {
        return range[range.length -1] + findNextInRange(diff);
    }
}

const solvePart1 = (values: string[]): number => {
    let res = 0;

    values.map((line: string) => {
        const vals = line.split(' ').map((x) => +x);
        res += findNextInRange(vals);
    });

    return res;
}

const solvePart2 = (values: string[]): number => {
    let res = 0;

    values.map((line: string) => {
        const vals = line.split(' ').map((x) => +x);
        res += findNextInRange(vals.reverse());
    });

    return res;
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values))
}

solve()