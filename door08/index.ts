import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const map: {[p:string]:{L: string, R:string}} = {};

const solvePart1 = (values: string[], start: string): number => {
    const instructions = values[0].split('');
    values.slice(2).map((value, valueIndex) => {
        const [idx, left, right] = value.replaceAll(/ |\(|\)/gi, '').replace('=', ',').split(',');
        map[idx] = {L:left, R:right};

    });

    let current = start;
    let steps = 0;

    while(current !== 'ZZZ') {
        if (current === 'ZZZ') {
            return steps;
        }
        // @ts-ignore
        current = map[current][instructions[steps % instructions.length]];
        steps++;
        steps % 1000000 === 0 ? console.log(steps) : null;
    }

    return steps;
}

const solvePart2 = (values: string[]): number => {
    return 0;
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values, 'AAA'))
    console.log('Part 2:', solvePart2(values))
}

solve()