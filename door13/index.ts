import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const solvePart1 = (values: string[]): number => {
    // it seems a mirror is only valid, if it reaches at least one side of the picture
    let result = 0;

    values.map((val, blockIdx) => {
        const lines = val.split('\n');
        let validHorizontal = false;
        for ( let i=0; i<lines.length-1; i++) {
            if (!validHorizontal && lines[i] === lines[i+1]) {
                // is connected to right ?
                if (lines.slice(i+1).join('').includes(lines.slice(0, i+1).reverse().join(''))) {
                    validHorizontal = true;
                }

                // is connected to left ?
                if (lines.slice(0, i+1).join('').includes(lines.slice(i+1).reverse().join(''))) {
                    validHorizontal = true;
                }

                if (validHorizontal) {
                    // console.log(i, 'lines')
                    result += 100*(i+1);
                }
            }
        }

        const cols = lines[0].split('').map((_, colIndex) => lines.map(row => row[colIndex])).map(el => el.join(''));
        let validVertical = false;
        for ( let i=0; i<cols.length-1; i++) {
            if (!validVertical && cols[i] === cols[i+1]) {
                // is connected to right (bottom) ?
                if (cols.slice(0,i+1).join('').endsWith(cols.slice(i+1).reverse().join(''))) {
                    // console.log(cols.slice(0, i+1).join('\n'), ' -> ', cols.slice(i+1).reverse().join('\n'));

                    validVertical = true;
                }
                // console.log('-----')

                // is connected to left (top)?
                if (cols.slice(i+1).join('').startsWith(cols.slice(0, i+1).reverse().join(''))) {
                    // console.log(cols.slice(i+1).join('\n'), ' -> ', cols.slice(0, i+1).reverse().join('\n'));

                    validVertical = true;
                }

                if (validVertical) {
                    // console.log(i, 'cols')
                    result += i+1;
                }
            }
        }
        // console.log(blockIdx, result);
    });
    return result;
}

const solvePart2 = (values: string[]): number => {
    // somehow only mirrors caused by the smudge shall be part of the solution `\_ö_/´
    let result = 0;
    values.map((val, blockIdx) => {
        const matrix = val.split('\n').map((el) => el.split(''));
        const iRows = matrix.length;
        const iCols = matrix[0].length;

        // horizontal
        for(let row=0; row < iRows-1; row++) {
            let mismatches = 0;
            for (let rowCheck=0; rowCheck < iRows; rowCheck++) {
                const before = row - rowCheck;
                const after = row + 1 + rowCheck;
                if (before >= 0 && after < iRows) {
                    for (let col=0; col < iCols; col++) {
                        if (matrix[before][col] !== matrix[after][col]) {
                            mismatches++;
                        }
                    }
                }
            }
            if (mismatches === 1) {
                result += (row+1)*100;
            }
        }

        // vertical
        for(let col=0; col < iCols-1; col++) {
            let mismatches = 0;
            for (let colCheck=0; colCheck < iCols; colCheck++) {
                const before = col - colCheck;
                const after = col + 1 + colCheck;
                if (before >= 0 && after < iCols) {
                    for (let row=0; row < iRows; row++) {
                        if (matrix[row][before] !== matrix[row][after]) {
                            mismatches++;
                        }
                    }
                }
            }
            if (mismatches === 1) {
                result += col+1;
            }
        }

    });

    return result;
}


function solve() {
    const values = getFileContent(inputName).split('\n\n')

    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values))
}

solve()