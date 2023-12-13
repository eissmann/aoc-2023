import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

let tempResults:{[key:string]: number} = {};

const isValidSpringList = (springs:string, groups:number[]) => {
    let numberOfDamagedSprings = 0;
    const foundGroups = [];

    for(let i = 0; i < springs.length; i++) {
        if (springs[i] === '.') {
            if (numberOfDamagedSprings > 0) {
                foundGroups.push(numberOfDamagedSprings);
            }
            numberOfDamagedSprings = 0;
        } else if (springs[i] === '#') {
            numberOfDamagedSprings += 1;
        }
    }

    // in case of fire, emergency and # is the last character
    if (numberOfDamagedSprings > 0) {
        foundGroups.push(numberOfDamagedSprings);
    }

    return foundGroups.join() === groups.join();
}

const calcValidCombinationsBruteForce = (springs:string, groups:number[], idx:number): number => {
    if (idx === springs.length) { // if end of string reached, check if it actually is correct
        return isValidSpringList(springs, groups) ? 1 : 0;
    }

    if (springs[idx] === '?') {
        return (
            calcValidCombinationsBruteForce(springs.substring(0, idx) + '#' + springs.substring(idx+1), groups, idx+1)
            + calcValidCombinationsBruteForce(springs.substring(0, idx) + '.' + springs.substring(idx+1), groups, idx+1)
        );
    } else {
        return calcValidCombinationsBruteForce(springs, groups, idx+1);
    }
}

const calcValidCombinationsWithTempResultsCache = (springs:string, groups:number[], idx:number, groupIdx: number, currentGroupLen: number, totalNumberOfDamagedSprings: number, maxDamaged: number): number => {
    // if for the 4992839th time I want to know if there is a group at position idx with id groupIdx and a currentGroupLength of ...
    const dictKey = idx + '_' + groupIdx + '_' + currentGroupLen;
    let result = 0;

    // early exit, if number exceeds allowed number
    if (totalNumberOfDamagedSprings > maxDamaged) {
        // console.log(springs, groups, groups.reduce((sum, group) => sum + group, 0), totalNumberOfDamagedSprings, idx, groupIdx, currentGroupLen);
        // console.log('big')
        return result;


    }

    if (tempResults.hasOwnProperty(dictKey)) {
        return tempResults[dictKey];
    }

    if (idx === springs.length) {
        // console.log(springs, groups, groups.reduce((sum, group) => sum + group, 0), totalNumberOfDamagedSprings, idx, groupIdx, currentGroupLen);

        if (groupIdx === groups.length && currentGroupLen === 0) { // all groups found and resolved
            // console.log('ok')
            return 1;
        } else if (groupIdx === groups.length-1 && groups[groupIdx] === currentGroupLen) { // last group not yet resolved, but found
            // console.log('ok2')
            return 1;
        } else {
            // console.log('false')
            return 0;
        }
    }

    // treat as or handle . here
    if (springs[idx] === '.' || springs[idx] === '?') { // no new group member there or possibly no new group member there
        if (currentGroupLen === 0) { // currently no open group discovered, so just go on
            result += calcValidCombinationsWithTempResultsCache(springs, groups, idx+1, groupIdx, 0, totalNumberOfDamagedSprings, maxDamaged);
        } else if (currentGroupLen > 0 && groupIdx < groups.length && groups[groupIdx] === currentGroupLen) { // possible group-end discovered, so go on with next group
            result += calcValidCombinationsWithTempResultsCache(springs, groups, idx+1, groupIdx+1, 0, totalNumberOfDamagedSprings, maxDamaged);
        }
    }

    // treat as or handle # here
    if (springs[idx] === '#' || springs[idx] === '?') { // new group member found or possibly found a new group member
        result += calcValidCombinationsWithTempResultsCache(springs, groups, idx+1, groupIdx, currentGroupLen+1, totalNumberOfDamagedSprings+1, maxDamaged);
    }

    // save the result for later usage
    tempResults[dictKey] = result;
    return result;
}

const solvePart1 = (values: string[]): number => {
    let result = 0;
    values.map((val) => {
        const [springs, groups] = val.split(' ');
        const damagedGroups = groups.split(',').map((x) => +x);

        // const temp += calcValidCombinationsBruteForce(springs, damagedGroups, 0);
        const temp = calcValidCombinationsWithTempResultsCache(springs, damagedGroups, 0, 0, 0, 0, damagedGroups.reduce((sum, x) => sum+x,0));

        // console.log(springs, temp, springs.match(/#/gi)?.length || 0);

        result += temp;

        tempResults = {}
    })
    return result;
}

const solvePart2 = (values: string[]): number => {
    let result = 0;
    values.map((val) => {
        const [springs, groups] = val.split(' ');

        let multiSprings = springs;
        let multiGroups = groups;
        for (let i=0; i<4; i++) {
            multiSprings += '?' + springs;
            multiGroups += ',' + groups;
        }
        const damagedGroups = multiGroups.split(',').map((x) => +x);

        const tempResult = calcValidCombinationsWithTempResultsCache(multiSprings, damagedGroups, 0, 0, 0, 0, damagedGroups.reduce((sum, x) => sum+x,0));

        // console.log(springs, tempResult);

        result += tempResult;

        tempResults = {};
    })

    return result;
}


function solve() {
    const values = getFileContent(inputName).split('\n')
console.time()
    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values))
    console.timeEnd()
}

solve()