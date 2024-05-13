declare global {
    interface String {
        capitalize(): string;
    }
    interface Number {
        timeAgo(): string;
        toTimestamp(): string;
    }
    interface Array<T> {
        shuffle(): T[];
    }
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
};

Number.prototype.timeAgo = function() {
    const secondsAgo = Math.floor((Date.now() / 1000) - Number(this));

    const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    if (secondsAgo < intervals.minute) return 'just now';
    if (secondsAgo < intervals.hour) return `${Math.floor(secondsAgo / intervals.minute)} min. ago`;
    if (secondsAgo < intervals.day) return `${Math.floor(secondsAgo / intervals.hour)} hr. ago`;
    if (secondsAgo < intervals.month) {
        const days = Math.floor(secondsAgo / intervals.day);
        return `${days} day${days === 1 ? '' : 's'} ago`
    }
    if (secondsAgo < intervals.year) return `${Math.floor(secondsAgo / intervals.month)} mo. ago`;
    return `${Math.floor(secondsAgo / intervals.year)} yr. ago`;
}

Number.prototype.toTimestamp = function() {
    const minutes = Math.floor(Number(this) / 60);
    const seconds = Number(this) % 60;

    return minutes + ':' + seconds;
}

Array.prototype.shuffle = function() { 
    for (let i = this.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [this[i], this[j]] = [this[j], this[i]]; 
    } 
    return this; 
};

function similarity(s1: string, s2: string) {
    const longer = s1.length >= s2.length ? s1 : s2;
    const shorter = s1.length < s2.length ? s1 : s2;

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

async function sleep(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

export {
    sleep,
    similarity
}