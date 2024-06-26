declare global {
    interface String {
        capitalize(): string;
    }
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
};

export function similarity(s1: string, s2: string) {
    const longer = s1.length >= s2.length ? s1 : s2;
    const shorter = s1 === longer ? s2 : s1;

    if (longer.length === 0) return 1.0;

    return (longer.length - editDistance(longer, shorter)) / longer.length;
}

function editDistance(s1: string, s2: string) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs: number[] = [];

    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;

        for (let j = 0; j <= s2.length; j++) {

            if (i === 0) costs[j] = j;
            else {

                if (j > 0) {
                    let newValue = costs[j - 1];

                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;

                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }

        if (i > 0) costs[s2.length] = lastValue;
    }

    return costs[s2.length];
}

export async function sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
}