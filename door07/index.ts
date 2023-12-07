import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const cardValues:{[key:string]:number} = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
    9: 9,
    8: 8,
    7: 7,
    6: 6,
    5: 5,
    4: 4,
    3: 3,
    2: 2,
}

const FIVE_OF_A_KIND = 1;
const FOUR_OF_A_KIND = 2;
const FULL_HOUSE = 3;
const THREE_OF_A_KIND = 4;
const TWO_PAIRS = 5;
const ONE_PAIR = 6;
const HIGH_CARD = 7;
const EMPTY = 0;

const solvePart1 = (values: string[]): number => {

    const results: {hand: string, bid: number, bucket: number}[] = values.map((value) => {
        const [hand, bid] = value.split(' ');

        const differentChars = Array.from(new Set(hand.split(''))).length;

        // five of a kind
        if (differentChars === 1) {
            return {
                hand,
                bid: +bid,
                bucket: FIVE_OF_A_KIND,
            }
        }
        // one pair
        if (differentChars === 4) {
            return {
                hand,
                bid: +bid,
                bucket: ONE_PAIR,
            }
        }
        // high card
        if (differentChars === 5) {
            return {
                hand,
                bid: +bid,
                bucket: HIGH_CARD,
            }
        }


        let result = {
            hand,
            bid: +bid,
            bucket: EMPTY,
        }


        // check the rest
        for (const char of cards) {
            const numberOfOccurrences = (hand.match(new RegExp(char, 'gi')) || []).length;
            // console.log(char, numberOfOccurrences);

            if (numberOfOccurrences === 0) {
                continue;
            }

            if (numberOfOccurrences === 4) {
                result.bucket = FOUR_OF_A_KIND;
                return result;
            }

            if (numberOfOccurrences === 3) {
                if (differentChars === 2) {
                    result.bucket = FULL_HOUSE;
                } else {
                    result.bucket = THREE_OF_A_KIND;
                }
                return result;
            }

            if (numberOfOccurrences === 2) {
                if (differentChars === 2) {
                    result.bucket = FULL_HOUSE;
                } else {
                    result.bucket = TWO_PAIRS;
                }
                return result;
            }
        }
        return result;
    });

    const sorted = results.sort((a, b) => {
        //(a > b ? -1 : 0)
        if (a.bucket > b.bucket) {
            return -1;
        }

        if (a.bucket === b.bucket) {
            // sort by highcard
            let counter = 0;
            while (counter < 5) {
                const aCard = cardValues[a.hand[counter].toUpperCase()];
                const bCard = cardValues[b.hand[counter].toUpperCase()];

                if (aCard > bCard) {
                    return 0;
                }
                if (aCard < bCard) {
                    return -1;
                }
                counter++;
            }

        }

        return 0;
    });

    return sorted.reduce((acc, curr, currentIndex) => {
        return acc + (curr.bid * (currentIndex+1));
    }, 0);
}

const solvePart2 = (values: string[]): number => {
    return 0;
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values))
}

solve()