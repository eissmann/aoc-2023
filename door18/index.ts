import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const solvePart1 = (values: string[]): number => {
    let pos = [0,0];
    let contour: any = [];
    let result = 0;
    let cResult = 0;

    values.map((val: string) => {
        const [dir, deep, color] = val.split(' ');

        // for (let i = 0; i< +deep; i++) {
            switch (dir) {
                case 'U':
                    pos = [pos[0],pos[1]-(+deep)];
                    break;
                case 'R':
                    pos = [pos[0]+(+deep),pos[1]];
                    break;
                case 'D':
                    pos = [pos[0],pos[1]+(+deep)];
                    break;
                case 'L':
                    pos = [pos[0]-(+deep),pos[1]];
                    break;
            }

            cResult += +deep;
            contour.push({
                pos
            });
        // }
    })


    const numberOfPoints = contour.length;
    const [startx, starty] = contour[0].pos;
    let prevx = startx;
    let prevy = starty;
    let nextx = 0;
    let nexty = 0;
    for (let i = 1; i < numberOfPoints; i++) {
        [nextx, nexty] = contour[i].pos;
        result += prevx * nexty - prevy * nextx;
        prevx = nextx;
        prevy = nexty;
    }

    result += startx * nexty - starty * nextx;

    return Math.abs(result)/2 + 1 + cResult / 2;
}

const solvePart2 = (values: string[]): number => {
    let pos = [0,0];
    let contour: any = [];
    let result = 0;
    let cResult = 0;

    values.map((val: string) => {
        const [, , color] = val.split(' ');
        const deep = parseInt(color.substring(2, color.length-2), 16);
        const dir = color.substring(color.length-2, color.length-1);

            switch (dir) {
                case '0':
                    pos = [pos[0],pos[1]-deep];
                    break;
                case '1':
                    pos = [pos[0]+deep,pos[1]];
                    break;
                case '2':
                    pos = [pos[0],pos[1]+deep];
                    break;
                case '3':
                    pos = [pos[0]-deep,pos[1]];
                    break;
            }

        cResult += +deep;
            contour.push(pos);

    })

    const numberOfPoints = contour.length;
    const [startx, starty] = contour[0];
    let prevx = startx;
    let prevy = starty;
    let nextx = 0;
    let nexty = 0;
    for (let i = 1; i < numberOfPoints; i++) {
        [nextx, nexty] = contour[i];
        result += prevx * nexty - prevy * nextx;
        prevx = nextx;
        prevy = nexty;
    }

    result += startx * nexty - starty * nextx;

    return Math.abs(result)/2 + 1  + cResult / 2;
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    console.log('Part 1:', solvePart1(values))
    console.log('Part 2:', solvePart2(values))
}

solve()