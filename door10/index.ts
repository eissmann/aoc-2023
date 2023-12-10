// @ts-nocheck
import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const getNextMove = (current: string, previousMove): [number, number] | boolean => {
    switch (current) {
        case 'S':
            return true;
        case '.':
            return false;
        case '|':
            return previousMove[0] !== 0 ? false : previousMove;
        case '-':
            return previousMove[1] !== 0 ? false : previousMove;
        case 'L':
            if (previousMove[0] === 0) {
                return previousMove[1] === -1 ? false : [1, 0];
            } else {
                return previousMove[0] === 1 ? false : [0, -1];
            }
        case 'J':
            if (previousMove[0] === 0) {
                return previousMove[1] === -1 ? false : [-1, 0];
            } else {
                return previousMove[0] === -1 ? false : [0, -1];
            }
        case '7':
            if (previousMove[0] === 0) {
                return previousMove[1] === 1 ? false : [-1, 0];
            } else {
                return previousMove[0] === -1 ? false : [0, 1];
            }
        case 'F':
            if (previousMove[0] === 0) {
                return previousMove[1] === 1 ? false : [1, 0];
            } else {
                return previousMove[0] === 1 ? false : [0, 1];
            }
        default:
            return false;
    }
};

const solvePart1 = (values: string[]): number => {
    let start = [0,0];
    values.map((line: string, idx) => {
        if (line.indexOf('S') >= 0) {
            start = [line.indexOf('S'), idx]
        }
    })

    let current = start;
    let startDirections = [];
    let loopFound = false;

    if (current[0] >= 0 && current[0] < values[current[1]].length-1) {
        // only left
        console.log('l')
        startDirections.push([1, 0]);
    }

    if (current[0] <= values[current[1]].length-1 && current[0] > 0) {
        // only right
        console.log('r')
        startDirections.push([-1, 0]);
    }

    if (current[1] >= 0 && current[1] < values.length -1) {
        // only down
        console.log('d')
        startDirections.push([0, 1]);
    }

    if (current[1] <= values.length -1 && current[1] > 0) {
        // only top
        console.log('t')
        startDirections.push([0, -1]);
    }
    let steps = 0;

    let isLoop = []

    while ( startDirections.length > 0 && !loopFound ) {
        isLoop = [start];
        let direction = startDirections.pop();
        let stuck = false;
        steps = 0;
        current = [start[0]+direction[0], start[1]+direction[1]];
        isLoop.push(current);
        while (!loopFound && !stuck) {
            const x = current[0] +  direction[0];
            const y = current[1] + direction[1];

            if (x > values[0].length || y > values.length) {
                stuck = true;
                steps = 0;
                continue;
            }
            //check next move
            direction = getNextMove(values[current[1]][current[0]], direction!);
            if (direction === true) {
                loopFound = true;
            } else if (direction === false) {
                stuck = true;
                steps = 0;
                continue;
            } else {
                current = [current[0]+direction![0], current[1]+direction[1]];
                isLoop.push(current);
            }
            steps++;
        }
    }

    isLoop = isLoop.filter((el, idx) => isLoop.indexOf(el) === idx);
    isLoop.pop(); // somehow this element was not removed

    let insideLoop = 0;

    // console.log(isLoop);
    values.map((val, idx) => {
        let x = idx + '';
        for (let i = 0; i<val.length-1; i++) {
            let h = 0;
            let v = 0;
            x += values[idx][i];

            const isContour = isLoop.filter((el) => el[0] === i && el[1] === idx).length > 0;

            // let a = 0;
            if (!isContour && idx > 0 && i > 0 && idx < values.length-1 && i <= val.length-1) {
                h = isLoop.filter((el) => {
                    // S might be of importance here as well ?!
                    return el[1] === idx && el[0] < i && ['|','L','J'].includes(values[el[1]][el[0]]);
                }).length;
            }

            if (h % 2 !== 0) {
                insideLoop++;
            }
        }

        })

    console.log('Part 2:', insideLoop);


    return steps / 2;
}

const solvePart2 = (values: string[]): number => {
    return 0;
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values))
}

solve()