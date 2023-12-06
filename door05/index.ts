import {getFileContent} from "../utils/fileHandling";
import {setDefaultAutoSelectFamily} from "net";

const inputName = __dirname + '/puzzle-input';

const getSimpleSeeds = (line: string): number[] => {
    const [, seedsLine] = line.split(':');

    return seedsLine
        .split(' ')
        .filter((seed) => seed !== '')
        .map((seed) => parseInt(seed, 10))
    ;
}

const getLowestLocation = (values: string[], seeds: number[]): number => {
    let currentValues: any = [];
    let previousValues: any = [...seeds];

    // destinationId => sourceId
    const map: any = {
        soil: [],
        fertilizer: [],
        water: [],
        light: [],
        temperature: [],
        humidity: [],
        location: [],
    }
    let type = '';
    const supportedTypes: string[] = ['soil', 'fertilizer', 'water', 'light', 'temperature', 'humidity', 'location'];
    const mappedLines = map;

    values.map((line: string) => {
        // seeds
        if (line.startsWith('seeds:')) {
            return;
        }

        for (const curr of supportedTypes) {
            if (line.endsWith(`-to-${curr} map:`)) {
                type = curr;

                return;
            }
        }

        if (line === '') {
            return;
        }
        const [destination, source, len ] = line.split(' ');
        const dest = parseInt(destination, 10);
        const src = parseInt(source, 10);
        const length = parseInt(len, 10);

        mappedLines[type].push({ dest, src, length });
    });

    supportedTypes.map((type: string) => {
        previousValues.map((val:number) => {
            let pushed = false;
            mappedLines[type].map((line: { dest: number, src: number, length: number }) => {
                // @ts-ignore
                if (val >= line.src && val <= line.src+line.length-1) {
                    const offset = val as number - line.src;
                    currentValues.push(line.dest + offset);
                    pushed = true;
                }
            });

            if (!pushed) {
                currentValues.push(val);
            }

        })
        // console.log(type, previousValues, previousValues.length, currentValues.length);

        previousValues = [...currentValues];
        currentValues = [];
    });

    return Math.min(...previousValues);
}

const solvePart2 = (values: string[]): number => {
    let lowestLocation = -1;
    let locationNumber = 0;
    const seeds = getSimpleSeeds(values[0]);

    let range: number[] = [];
    for (let outerI = 0; outerI < seeds.length; outerI+=2) {
        let counter = 0;
        console.log('Processing ' + outerI + ' of ' + seeds.length);
        console.log('Found ' + seeds[outerI+1] + ' new seeds');
        for (let i = seeds[outerI]; i < seeds[outerI] + seeds[outerI+1]; i++) {
            range.push(i);
            counter++;
            if ((counter % 100) === 0) {
                locationNumber = getLowestLocation(values, range)
                lowestLocation = lowestLocation > -1 ? Math.min(lowestLocation, locationNumber) : locationNumber;
                counter % 1000000 === 0 ? console.log(lowestLocation, '.') : null;

                range = [];
            }
        }
    }

    if (range.length > 0) {
        lowestLocation = lowestLocation > -1 ? Math.min(lowestLocation, getLowestLocation(values, range)) : getLowestLocation(values, range);
    }

    return lowestLocation;

}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', getLowestLocation(values, getSimpleSeeds(values[0]))) // 551761867
    console.log('Part 2:', solvePart2(values))
}

solve()