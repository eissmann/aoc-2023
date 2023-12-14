import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const tiltNorth = (platform:any, iRows: number, iCols:number) => {
    // tilt north
    for (let row= 1; row < iRows; row++) {
        for (let col = 0; col < iCols; col++) {
            let stuck = platform[row-1][col] !== '.';
            let isRock = platform[row][col] === 'O';
            let currRow = row;
            while (isRock && !stuck && currRow > 0) {
                // console.log(row, currRow, col, 'move', );
                platform[currRow-1][col] = 'O';
                platform[currRow][col] = '.'
                currRow--;
                stuck = currRow <= 0 || platform[currRow-1][col] !== '.';
            }
        }
    }

    return platform;
}

const tiltWest = (platform:any, iRows: number, iCols:number) => {
    for (let col= 1; col < iCols; col++) {
        for (let row = 0; row < iRows; row++) {
            let stuck = platform[row][col-1] !== '.';
            let isRock = platform[row][col] === 'O';
            let currCol = col;
            while (isRock && !stuck && currCol > 0) {
                // console.log(row, currRow, col, 'move', );
                platform[row][currCol-1] = 'O';
                platform[row][currCol] = '.'
                currCol--;
                stuck = currCol <= 0 || platform[row][currCol-1] !== '.';
            }
        }
    }

    return platform;
}

const solvePart1 = (values: string[]): number => {
    let platform = values.map(el => el.split(''));
    const iRows = platform.length;
    const iCols = platform[0].length;

    let result = 0;

    // tilt north
    platform = tiltNorth(platform, iRows, iCols);

    // platform = tiltNorth(platform.reverse(), iRows, iCols).reverse()
    // console.log(platform.map(el => el.join('')).join('\n'))

    result = platform.reduce((acc, row, rowIdx) => {
        return acc + (row.join('').match(/O/gi)?.length || 0) * (iRows-rowIdx);
    }, 0);


    return result;
}

const solvePart2 = (values: string[], cycles: number): number => {
    let platform = values.map(el => el.split(''));
    const iRows = platform.length;
    const iCols = platform[0].length;

    let result = 0;

    let test: string[] = [];
    let results: number[] = [];
    let cycleStarted = false;
    let cycleEnded = false;
    let cycle = [];
    let refString = '';
    let r = 0;

    for (let i=0; i<cycles && !cycleEnded; i++) {
        platform = tiltNorth(platform, iRows, iCols);
        platform = tiltWest(platform, iRows, iCols);
        platform = tiltNorth(platform.reverse(), iRows, iCols).reverse();
        platform = tiltWest(platform.map(el => el.reverse()), iRows, iCols).map((el:any) => el.reverse());

        r = platform.reduce((acc, row, rowIdx) => {
            return acc + (row.join('').match(/O/gi)?.length || 0) * (iRows-rowIdx);
        }, 0);

        const rString = platform.map(el => el.join('')).join('');

        // find cycle and hope for the best
        if(test.includes(rString)) {
            if (!cycleEnded && (refString === '' || rString === refString)) {
                if (cycleStarted) {
                    cycleEnded = true
                    cycle.push(i)
                } else {
                    refString = rString;
                    cycleStarted = true;
                    cycle.push(i)
                }
            }
        } else {
            test.push(rString);
            results.push(r);
        }
    }

    const cycleLength = cycle[1] - cycle[0];
    const val = (cycles - (cycle[0]+1)) % cycleLength;
    // console.log(results[(cycle[0] + val)-cylceLength], val);

    return cycleEnded ? results[(cycle[0] + val)-cycleLength] : r;
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values,1000000000))
}


solve()