import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const charCalculation = (subject: string): number => {
    let result = 0;
    for (let i=0; i<subject.length; i++) {
        result = ((result + subject.charCodeAt(i)) * 17) % 256;
    }
    return result;
}

const solvePart1 = (values: string[]): number => {
    return values[0].split(',').reduce((acc, curr) => {
        return acc + charCalculation(curr);
    }, 0);
}

const solvePart2 = (values: string[]): number => {
    let hashMap:{[p:string]: {
            label: string;
            focalLenght: number;
            boxIdx: number;
        }} = {}
    values[0].split(',').map((curr) => {
        if (curr.match(/=/gi)?.length === 1) {
            const [label, focalLength] = curr.split('=');
            const boxIdx = charCalculation(label);

            hashMap[label] = {
                label: label,
                focalLenght: +focalLength,
                boxIdx: boxIdx,
            }
        } else {
            const [label, focalLength] = curr.split('-');
            const boxIdx = charCalculation(label);

            if (hashMap.hasOwnProperty(label)) {
                delete hashMap[label];
            }
        }
    });

    let boxIndexes: number[] = [];
    boxIndexes.length = 256;
    boxIndexes.fill(0, 0, 256);

    let result = 0;
    for (const [_, boxItem] of Object.entries(hashMap)) {
        result += (boxItem.boxIdx+1)* ++boxIndexes[boxItem.boxIdx] * boxItem.focalLenght;
    }
    return result;
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values))
}

solve()