import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const solvePart1 = (values: string[]): number => {
    return values.reduce((acc: number, line: string) => {
        const [winning, numbers] = line.replace(/Card \d+: /gi, '').split('|');

        const winningNumbers = winning.split(' ');

        const matches = numbers.split(' ').filter((number) => {
            return number !== '' && winningNumbers.includes(number)
        });

        if (matches.length === 0) {
            return acc;
        }

        return acc + Math.pow(2, matches.length - 1);
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