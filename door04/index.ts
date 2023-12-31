import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const getMatchesInLine = (line: string) => {
    const [winning, numbers] = line.replace(/Card \d+: /gi, '').split('|');

    const winningNumbers = winning.split(' ');

    return numbers.split(' ').filter((number) => {
        return number !== '' && winningNumbers.includes(number)
    });
}


const solvePart1 = (values: string[]): number => {
    return values.reduce((acc: number, line: string) => {
        const matches = getMatchesInLine(line);

        if (matches.length === 0) {
            return acc;
        }

        return acc + Math.pow(2, matches.length - 1);
    }, 0);
}

const solvePart2 = (values: string[]): number => {
    const cardIndex: number[] = [];
    cardIndex.length = values.length;
    cardIndex.fill(1, 0, values.length);

    values.map((line: string, idx: number) => {
        const matches = getMatchesInLine(line);

        if (matches.length === 0) {
            return;
        }

        const currentCardCount = cardIndex[idx];

        for (let i = 1; i <= matches.length; i++) {
            cardIndex[idx+i] += currentCardCount;
        }
    });

    return cardIndex.reduce((acc: number, value: number) => {
        return acc + value;
    }, 0);
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values))
}

solve()