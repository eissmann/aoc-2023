// @ts-nocheck
import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const charPos = (str: string, char: string) => {
    return str
        .split('')
        .map(function (c: string, i: number) { if (c == char) return i; })
        .filter(function (v: number) { return v >= 0; });
}

const getDistancesSum = (values: string[], multiplier = 1): number => {


    let cols = [];
    let rows = [];
    let galaxies = [];

    for (let i = 0; i < values[0].length; i++) {
        let isEmpty = true;
        for (const idx in values) {
            if (values[idx][i] === '#') {
                isEmpty = false;
            }
        }

        if (isEmpty) {
            cols.push(i);
        }
    }

    for (const [idx, val] of values.entries()) {
        let line = val.split('');

        // check col
        if (!line.includes('#')) {
            rows.push(idx);
        }

        const a = charPos(val, '#');

        a.forEach((col: number) => {
            galaxies.push([col, idx]);
        })
    }


    let min = 0;
    // now count
    for (let gal1 = 0; gal1 < galaxies.length-1; gal1++) {
        for (let gal2 = gal1+1; gal2 < galaxies.length; gal2++) {
            const summandX = Array.from(new Array(Math.abs(galaxies[gal1][0] - galaxies[gal2][0])), (x,i) => i + Math.min(galaxies[gal1][0], galaxies[gal2][0])).filter((el) => cols.includes(el)).length;
            const summandY = Array.from(new Array(Math.abs(galaxies[gal1][1] - galaxies[gal2][1])), (x,i) => i + Math.min(galaxies[gal1][1], galaxies[gal2][1])).filter((el) => rows.includes(el)).length;

            min+= Math.abs(galaxies[gal1][0] - galaxies[gal2][0]) + Math.abs(galaxies[gal1][1] - galaxies[gal2][1]) + (summandX+summandY)*(multiplier-1);
        }
    }

    return min;
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', getDistancesSum(values, 2))
    console.log('Part 2:', getDistancesSum(values, 1000000))
}

solve()