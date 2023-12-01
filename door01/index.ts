import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const solvePart1 = (values: string[]): number => {
    return values.reduce((result: number, value: string): number => {
        if (!value) {
            return result;
        }

        const digits = value.split('').filter((letter) => letter.match(/[0-9]/));
        if (digits.length < 1) {
            return result;
        }
        const calibrationValue = digits[0] + digits[digits.length - 1];

        return result + parseInt(calibrationValue, 10);
    }, 0)
}

const solvePart2 = (values: string[]): number => {
    const map:{ [key: string]:string }  = {
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9',
    }

    return values.reduce((result: number, value: string): number => {
        if (!value) {
            return result;
        }

        // identify "pxreightwo7" as [8,2,7] ... positive lookAhead regex
        const regex = new RegExp('(?=(' + Object.keys(map).join(")|(") + ')|([0-9]))',"gi");
        const digits =[...value.matchAll(regex)].map((match) => {
            const matchedString = match.filter((value) => value?.length > 0)[0];
            return map[matchedString] || matchedString;
        });

        if (digits.length < 1) {
            return result;
        }

        const calibrationValue = digits[0] + digits[digits.length - 1];

        return result + parseInt(calibrationValue, 10);
    }, 0)
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values))
}

solve()