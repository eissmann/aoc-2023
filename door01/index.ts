import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const solvePart1 = (values: string[]): number => {
    return values.reduce((result: number, value: string): number => {
        if (!value) {
            return 0;
        }

        const digits = value.split('').filter((letter) => letter.match(/[0-9]/));
        const calibrationValue = digits[0] + digits[digits.length - 1];

        return result + parseInt(calibrationValue, 10);
    }, 0)
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values))
    // console.log('Part 2:', solvePart2(values))
}

solve()