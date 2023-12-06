import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'


function findSolutionsForRace(raceLength: number, raceDistance: number) {
    let solutions = 0;
    for (let time = 1; time < raceLength; time++) {
        if (time * (raceLength - time) > raceDistance) {
            solutions++;
        }
    }

    return solutions;
}

const solvePart1 = (values: string[]): number => {
    const times = [...values[0].matchAll(/\d+/gi)].map((time) => parseInt(time[0], 10));
    const dists = [...values[1].matchAll(/\d+/gi)].map((dist) => parseInt(dist[0], 10));

    let result = 1;
    for(let race = 0; race < times.length; race++) {
        result *= findSolutionsForRace(times[race], dists[race]);
    }

    return result;
}

const solvePart2 = (values: string[]): number => {
    const times = [...values[0].matchAll(/\d+/gi)].map((time) => time[0]);
    const dists = [...values[1].matchAll(/\d+/gi)].map((dist) => dist[0]);

    const maxTime = parseInt(times.reduce((acc, curr) => acc + curr),10);
    const maxDist = parseInt(dists.reduce((acc, curr) => acc + curr), 10);

    return findSolutionsForRace(maxTime, maxDist);
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values))
}

solve()