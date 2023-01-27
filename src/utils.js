Object.defineProperty(String.prototype, 'capitalize', {
    value: function() { return this.charAt(0).toUpperCase() + this.slice(1); },
    enumerable: false
});

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

module.exports = {

    sleep

}