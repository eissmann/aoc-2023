import path from 'path';
import fs from 'fs/promises';
import { spawn } from 'child_process';

const [, , doorString] = process.argv;
const doorNumber = parseInt(doorString, 10);

if (Number.isNaN(doorNumber)) {
    console.error(
        'Please start with npm start <doorNumber>',
    );
    process.exit(1);
}

async function main() {

    spawn('nodemon', ['-x', 'ts-node', doorNumber < 10 ? `door0${doorNumber}` : `door${doorNumber.toString()}` + '/index.ts'], {
        stdio: 'inherit',
        shell: true,
        cwd: path.join(__dirname),
    });
}

try {
    main();
} catch (e) {
    console.error(e);
}