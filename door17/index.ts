// @ts-nocheck
import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const solvePart1 = (values: string[], isPart1 = true): number => {

    const posInRange = (pos:[number, number]): boolean => {
        return pos[0] < values[0].length && pos[0] >= 0 && pos[1] < values.length && pos[1] >= 0;
    }

    const worker: [
        [number, number], number, number, number
    ][] = [];

    const lookup: Map<string, boolean> = new Map()

    let costs = 100000000000000000000000;

    const walk = (pos: [number, number], dir: number, cdir: number, result: number, isPart1 = true): boolean => {
        if (pos[0] === values[0].length-1 && pos[1] === values.length-1) {
            if (isPart1 || cdir >= 4) {
                costs = Math.min(costs, result);
            }
            return;
        }

        for (let newDir = 1; newDir <=4; newDir++ ) {
            let newPos = [...pos];

            switch (newDir) {
                case 1: // up
                    newPos[1] -= 1;
                    break;
                case 2: // right
                    newPos[0] += 1;
                    break;
                case 3: // down
                    newPos[1] += 1;
                    break;
                case 4:
                    newPos[0] -= 1;
                    break;
            }


            const newCDir = newDir === dir ? cdir+1 : 1;
            const movesReverse = (dir === 1 && newDir === 3) ||
                (dir === 2 && newDir === 4) ||
                (dir === 3 && newDir === 1) ||
                (dir === 4 && newDir === 2);
                const isValid = isPart1 && newCDir <= 3 || (!isPart1 && (newCDir <= 10 && (newDir === dir || cdir >= 4)));

            if (posInRange(newPos) && isValid && !movesReverse) {

                if (lookup.get(`${newPos[0]}_${newPos[1]}_${newDir}_${newCDir}`)) {
                    continue;
                }


                worker.push([newPos, newDir, newCDir, result + +values[newPos[1]][newPos[0]]]);
            }
        }

        return true;
    }

    worker.push([[0,0],2,0,0]);
    worker.push([[0,0],3,0,0]);
    while ( worker.length > 0) {
        const [pos, dir, cdir, value] = worker.pop();
        const k = `${pos[0]}_${pos[1]}_${dir}_${cdir}`;

        if (lookup.get(k)) {
            continue;
        }

        lookup.set(k, true);

        // @ts-ignore
        walk(pos, dir, cdir, value, isPart1);

        // priority queue hickhack
        worker.sort((a,b) => {
            return b[3] - a[3];
        });
    }

    return costs;
}

function solve() {
    const values = getFileContent(inputName).split('\n')
console.time();
    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart1(values, false))
    console.timeEnd();
}

solve()