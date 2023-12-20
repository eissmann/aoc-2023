import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

interface module {
    name: string;
    type: string;
    watcher: string[];
    state: number;
    lastPulse: { [p:string]: number };
}

interface modules {[p:string]:module}

interface workload {
    pulse: number;
    module: string;
    sender: string;
}

const worker:workload[]  = [];

const solvePart1 = (modules: modules, part1 = true): number => {
    let lows = 0;
    let highs = 0;

    let modsForMg: {[p:string]:number} = {};

    for (let i=0; i< (part1 ? 1000 : 10000); i++) {
        worker.push({pulse: 0, module: 'broadcaster', sender: 'button'});

        while (worker.length > 0) {
            const workload = worker.shift() as workload

            workload.pulse === 0 ? lows++ : highs++;

            const module = modules[workload.module]

            // for part 2
            if (!part1 && (workload.module === 'mg' && workload.pulse === 1)) {
                if (modsForMg[workload.sender] || modsForMg[workload.sender] > 0) {
                    modsForMg[workload.sender] -= i;
                } else if (!modsForMg[workload.sender]) {
                    modsForMg[workload.sender] = i;
                }
            }

            if (module === undefined) {
                continue;
            }

            switch (module.type) {
                case 'broadcaster':
                    module.watcher.map((wModule: string) => {
                        worker.push({pulse: workload.pulse, module: wModule, sender: module.name})
                    });
                    break;
                case '%': // flipflop
                    if (workload.pulse === 1) {
                        break;
                    }

                    // low pulse received
                    // switch on/off
                    if (module.state === 1) {
                        module.state = 0;
                        module.watcher.map((wModule: string) => {
                            worker.push({pulse: 0, module: wModule, sender: module.name})
                        });
                    } else {
                        module.state = 1;
                        module.watcher.map((wModule: string) => {
                            worker.push({pulse: 1, module: wModule, sender: module.name})
                        });
                    }
                    break;
                case '&': // conjunction
                    if (Object.entries(module.lastPulse).length === 0) {
                        Object.entries(modules).filter((m) => {
                            return modules[m[0]].watcher.includes(module.name);
                        }).map((m) => modules[m[0]].name).map((mName: string) => {
                            module.lastPulse[mName] = 0;
                        });
                    }

                    module.lastPulse[workload.sender] = workload.pulse;
                    const inputs = Object.entries(module.lastPulse);
                    if (inputs.filter((m) => m[1] === 1).length == inputs.length) {
                        module.watcher.map((wModule: string) => {
                            worker.push({pulse: 0, module: wModule, sender: module.name})
                        });
                    } else {
                        module.watcher.map((wModule: string) => {
                            worker.push({pulse: 1, module: wModule, sender: module.name})
                        });
                    }
                    break;
            }
        }
    }

    if (!part1) {
        const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b;
        const lcm = (a: number, b: number) => a * b / gcd(a, b);

        return Object.entries(modsForMg).map((mg) => Math.abs(mg[1]) ).reduce(lcm);
    }


    return lows * highs;
}

const solvePart2 = (values: string[]): number => {
    // done manually
    // hit button as often as it needs to detect the cycles ( of mg-inputs ) ... 10000 was enough

    // here jg,hf,jm,rh
    // calculate lcm 3793*3947*4003*4019 = answer
    return 0;
}


function solve() {
    const values = getFileContent(inputName).split('\n')

    const modules:{ [p:string]:module } = values.reduce<{ [p:string]:module }>((acc:{ [p:string]:module },line, currentIndex) => {
        let item: module = {
            name: '',
            type: '',
            watcher: [],
            state: 0,
            lastPulse: {},
        };

        const [name, watcher] = line.split(' -> ');

        if (name === 'broadcaster') {
            item.name = name;
            item.type = name;
        } else {
            item.name = name.substring(1);
            item.type = name.substring(0,1);
        }

        item.watcher = watcher.split(', ');

        acc[item.name] = item;

        return acc;

    }, {})

    console.log('Part 1:', solvePart1(modules))
    console.log('Part 2:', solvePart1(modules, false))
}

solve()