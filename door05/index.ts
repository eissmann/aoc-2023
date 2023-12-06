import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input';

const getSimpleSeeds = (line: string): number[] => {
    const [, seedsLine] = line.split(':');

    return seedsLine
        .split(' ')
        .filter((seed) => seed !== '')
        .map((seed) => +seed)
        ;
}

function parseInput(values: string[]) {
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

    values.forEach((line: string) => {
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
        const [destination, source, len] = line.split(' ');
        const dest = +destination;
        const src = +source;
        const length = +len;

        mappedLines[type][mappedLines[type].length] = {dest, src, length};
    });
    return {supportedTypes, mappedLines};
}

const getLowestLocation = (values: string[], seeds: number[], supportedTypes:any, mappedLines:any): number => {
    let currentValues: any = [];
    let previousValues: any = [...seeds];

    supportedTypes.forEach((type: string) => {
        previousValues.forEach((val: number) => {
            let pushed = false;
            mappedLines[type].forEach((line: { dest: number, src: number, length: number }) => {
                // @ts-ignore
                if (val >= line.src && val <= line.src + line.length - 1) {
                    const offset = val as number - line.src;
                    currentValues[currentValues.length] = line.dest + offset;
                    pushed = true;
                }
            });

            if (!pushed) {
                currentValues[currentValues.length] = val;
            }

        })

        previousValues = [...currentValues];
        currentValues = [];
    });

    return Math.min(...previousValues);
}

const solvePart2 = (values: string[], supportedTypes:any, mappedLines:any): number => {
    let lowestLocation = -1;
    let locationNumber = 0;
    const seeds = getSimpleSeeds(values[0]);

    let range: number[] = [];
    for (let outerI = 0; outerI < seeds.length; outerI += 2) {
        let counter = 0;
        console.log('Processing ' + outerI + ' of ' + seeds.length);
        console.log('Found ' + seeds[outerI + 1] + ' new seeds');
        for (let i = seeds[outerI]; i < seeds[outerI] + seeds[outerI + 1]; i++) {
            range[range.length] = i;
            counter++;
            if ((counter % 1000) === 0) {
                locationNumber = getLowestLocation(values, range, supportedTypes, mappedLines)
                lowestLocation = lowestLocation > -1 ? Math.min(lowestLocation, locationNumber) : locationNumber;
                counter % 1000000 === 0 ? process.stdout.write('.') : null;

                range = [];
            }
        }
        console.log(lowestLocation);
    }

    if (range.length > 0) {
        lowestLocation = lowestLocation > -1 ? Math.min(lowestLocation, getLowestLocation(values, range, supportedTypes, mappedLines)) : getLowestLocation(values, range, supportedTypes, mappedLines);
    }

    return lowestLocation;

}


function solve() {
    const values = getFileContent(inputName).split('\n')

    const {supportedTypes, mappedLines} = parseInput(values);
    console.log('Part 1:', getLowestLocation(values, getSimpleSeeds(values[0]), supportedTypes, mappedLines)) // 551761867
    console.log('Part 2:', solvePart2(values, supportedTypes, mappedLines))
}

solve()