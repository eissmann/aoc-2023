import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

let energized: string[] = [];
let seen : string[] = [];

const activeBeams: any = [];

const moveBeam = (pos: number[], direction: number, canvas: string[]) => {
    let newPos = pos;
    let newDirection = direction;

    const isBeamInCanvas = (newPos: number[]) => {
        //  @ts-ignore
        if (newPos[0] >= canvas[0].length || newPos[0] < 0 || newPos[1] >= canvas.length || newPos[1] < 0) {
            // finish beam
            return false;
        }

        return true;
    }

    while (true) {

        if (seen.indexOf(`${newPos[0]}_${newPos[1]}_${newDirection}`) >= 0) {
            return;
        }

        seen.push(`${newPos[0]}_${newPos[1]}_${newDirection}`);

        // determine possible new position
        switch (newDirection) {
            case 1:
                newPos = [newPos[0], newPos[1]-1];
                break;
            case 2:
                newPos = [newPos[0]+1, newPos[1]];
                break;
            case 3:
                newPos = [newPos[0], newPos[1]+1];
                break;
            case 4:
                newPos = [newPos[0]-1, newPos[1]];
                break;
        }

        if (!isBeamInCanvas(newPos)) {
            return;
        }

        // determine direction
        const action = canvas[newPos[1]][newPos[0]];


        switch (action) {
            case '\\':
                energized.push(`${newPos[0]}_${newPos[1]}`);
                switch(newDirection) {
                    case 1:
                        newDirection = 4;
                        break;
                    case 2:
                        newDirection = 3;
                        break;
                    case 3:
                        newDirection = 2;
                        break;
                    case 4:
                        newDirection = 1;
                        break;
                }
                // return;
                break;
            case '/':
                energized.push(`${newPos[0]}_${newPos[1]}`);
                switch(newDirection) {
                    case 1:
                        newDirection = 2;
                        break;
                    case 2:
                        newDirection = 1;
                        break;
                    case 3:
                        newDirection = 4;
                        break;
                    case 4:
                        newDirection = 3;
                        break;
                }
                // return;
                break;
            case '|':
                energized.push(`${newPos[0]}_${newPos[1]}`);

                if (![1,3].includes(newDirection)) {
                    activeBeams.push([newPos, 1]);
                    activeBeams.push([newPos, 3]);
                    return;
                }
                break;
            case '-':
                energized.push(`${newPos[0]}_${newPos[1]}`);

                if (![2,4].includes(newDirection)) {
                    activeBeams.push([newPos, 2]);
                    activeBeams.push([newPos, 4]);
                    return;
                }
                break;
            case '.': // keep direction
                energized.push(`${newPos[0]}_${newPos[1]}`);
                break;
        }
    }
}

const solvePart1 = (values: string[]): number => {
    // 1 up, 2 right, 3 down, 4 left

    let pos = [-1,0];
    let direction = 2;
    activeBeams.push([pos, direction]);

    while (activeBeams.length > 0) {
        const beam = activeBeams.pop();
        moveBeam(beam[0], beam[1], values);
    }

    return Array.from(new Set(energized)).length;
}

const solvePart2 = (values: string[]): number => {
    let res = 0;

    for (let i= 0; i < values[0].length; i++) {
        energized = [];
        seen = [];
        // top row down
        activeBeams.push([[i,-1], 3]);
        while (activeBeams.length > 0) {
            const beam = activeBeams.pop();
            moveBeam(beam[0], beam[1], values);
            res = Math.max(res, Array.from(new Set(energized)).length);
        }
    }

    for (let i= 0; i < values[0].length; i++) {
        energized = [];
        seen = [];
        // bottom row up
        activeBeams.push([[i,values.length], 1]);
        while (activeBeams.length > 0) {
            const beam = activeBeams.pop();
            moveBeam(beam[0], beam[1], values);
            res = Math.max(res, Array.from(new Set(energized)).length);
        }
    }

    for (let i= 0; i < values.length; i++) {
        energized = [];
        seen = [];
        // left column right
        activeBeams.push([[-1,i], 2]);
        while (activeBeams.length > 0) {
            const beam = activeBeams.pop();
            moveBeam(beam[0], beam[1], values);
            res = Math.max(res, Array.from(new Set(energized)).length);
        }
    }

    for (let i= 0; i < values.length; i++) {
        energized = [];
        seen = [];
        // right column left
        activeBeams.push([[values[0].length,i], 4]);
        while (activeBeams.length > 0) {
            const beam = activeBeams.pop();
            moveBeam(beam[0], beam[1], values);
            res = Math.max(res, Array.from(new Set(energized)).length);
        }
    }

    return res;
}


function solve() {
    const values = getFileContent(inputName).split('\n')
console.time();
    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values))
    console.timeEnd();
}

solve()