import { setTimeout } from 'timers/promises';

declare global {
    interface String {
        capitalize(): string;
    }
    interface Array<T> {
        shuffle(): T[];
    }
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
};

Array.prototype.shuffle = function() { 
    for (let i = this.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [this[i], this[j]] = [this[j], this[i]]; 
    } 
    return this; 
}; 

function similarity(s1: string, s2: string): number {
    let longer = s1;
    let shorter = s2;
    
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }

    const longerLength = longer.length;

    if (longerLength === 0)
        return 1.0;

    return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(s1: string, s2: string): number {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs: number[] = new Array();

    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;

        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }

        if (i > 0) {
            costs[s2.length] = lastValue;
        }
    }

    return costs[s2.length];
}

async function sleep(ms: number): Promise<void> {
    await setTimeout(ms);
}

export {
    similarity,
    sleep
};