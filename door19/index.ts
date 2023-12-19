// @ts-nocheck
import {getFileContent} from "../utils/fileHandling";

const inputName = __dirname + '/puzzle-input'

const WF: {[p:string]:{
    name: string;
    conditions: string;
    }} = {}


const solvePart1 = (workflows: string[], parts: string[]): number => {
    let resolved = 0;
    // parse workflows
    workflows.map((workflow:string) => {
        const [name, conditions] = workflow.substring(0, workflow.length-1).split('{');
        WF[name] = {name, conditions}
    });

    parts.map((part: string) => {
        const [x,m,a,s] = part.substring(1, part.length-1).split(',').map((attribute:string) => {
            return attribute.substring(2);
        })
        let isResolved = false;
        const isValid = (val: number, op: string, compare: number) => {
            if (op === '<') {
                return val < compare;
            }

            return val > compare;
        }

        const resolveCondition = (resolver: string): any => {
            switch (resolver) {
                case 'A':
                    resolved += +x + +m + +a + +s;
                    return true;
                case 'R':
                    return true;
                default:
                    return resolver;
            }
        }

        let conditions = WF['in'].conditions.split(',');
        while (!isResolved) {
            let conditionsMet = false;
            for (let i=0; i<conditions.length && !conditionsMet; i++) {
                let res = false;
                // otherwise path
                // @ts-ignore
                if (conditions[i].indexOf(':') < 0) {
                    res = resolveCondition(conditions[i]);
                    conditionsMet = true;

                } else {
                    const [cond, resolve] = conditions[i].split(':');
                    const op = cond.substring(1,2);
                    const val = +cond.substring(2);
                    switch (cond[0]) {
                        case 'x':
                            if (isValid(+x, op, val)) {
                                conditionsMet = true;
                                res = resolveCondition(resolve);
                            }
                            break;
                        case'm':
                            if (isValid(+m, op, val)) {
                                conditionsMet = true;
                                res = resolveCondition(resolve);
                            }
                            break;
                        case 'a':
                            if (isValid(+a, op, val)) {
                                conditionsMet = true;
                                res = resolveCondition(resolve);
                            }
                            break;
                        case 's':
                            if (isValid(+s, op, val)) {
                                conditionsMet = true;
                                res = resolveCondition(resolve);
                            }
                            break;
                    }
                }

                if (res === true) {
                    isResolved = true;
                } else if (res === false) {
                    // think of something nice to do
                } else {
                    // @ts-ignore
                    conditions = WF[res].conditions.split(',');
                    isResolved = false;
                }
            }
        }
    })

    return resolved;
}

const solvePart2 = (workflows: string[]): number => {
    let resolvable = 0;
    // parse workflows
    workflows.map((workflow:string) => {
        const [name, conditions] = workflow.substring(0, workflow.length-1).split('{');
        WF[name] = {name, conditions}
    });

    const getNewRanges = (name, op, value, x: number,m: number,a: number,s: number) => {
        let [nMin, nMax] = [0,0];

        const range = (op, value, min: number, max: number) => {
            let [nMax,nMin] = [max, min];
            switch (op) {
                case '>':
                    nMin = Math.max(min,value+1)
                    break;
                case '<':
                    nMax = Math.min(max, value-1);
                    break;
                case '>=':
                    nMin = Math.max(min, value);
                    break;
                case '<=':
                    nMax = Math.min(max, value);
            }
            return [nMin, nMax];

        }

        switch (name) {
            case 'x':
                [nMin, nMax] = range(op, value, ...x);
                return [[nMin, nMax], m,a,s];
            case 'm':
                [nMin, nMax] = range(op, value, ...m);
                return [x, [nMin, nMax],a,s];
            case 'a':
                [nMin, nMax] = range(op, value, ...a);
                return [x, m, [nMin, nMax], s];
            case 's':
                [nMin, nMax] = range(op, value, ...s);
                return [x, m, a, [nMin, nMax]];
        }
    }

    const worker: any = [];

    worker.push(['in', [1,4000],[1,4000],[1,4000],[1,4000]])

    const validBounds = (x: number[],m: number[],a: number[],s: number[]) => {
        return x[0]<=x[1] && m[0]<=m[1] && a[0] <= a[1] && s[0] <= s[1];
    }

    while (worker.length > 0) {
        let [resolver, x, m, a, s] = worker.pop()

        // exit ?
        if (!validBounds(x,m,a,s) || resolver === 'R') {
            continue;
        }
        if (resolver === 'A') { // calculate possibilities to reach this A
            resolvable += [x,m,a,s].reduce((acc, bounds) => {
                return acc * (bounds[1] - bounds[0] + 1);
            }, 1);
        } else {
            // check rules
            const wf = WF[resolver];
            for (const cond of wf.conditions.split(',')) {
                if (cond.indexOf(':') > 0) { // push positive resolver and new boundaries to "queue"
                    const [c, resolve] = cond.split(':');
                    const op = c.substring(1, 2);
                    const val = +c.substring(2);

                    worker.push([resolve, ...getNewRanges(c[0], op, val, x, m, a, s)]);

                    // prepare rest for next condition
                    [x, m, a, s] = getNewRanges(c[0], op === '>' ? '<=' : '>=', val, x,m,a,s);
                } else { // push new resolver to "queue"
                    worker.push([cond, x, m, a, s]);
                }
            }
        }
    }

    return resolvable;
}


function solve() {
    const values = getFileContent(inputName).split('\n\n')

    console.log('Part 1:', solvePart1(values[0].split('\n'), values[1].split('\n')))
    console.log('Part 2:', solvePart2(values[0].split('\n')));
}

solve()