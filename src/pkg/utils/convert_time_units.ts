type TimeUnit = 'seconds'|'minutes'|'hours'|'milliseconds'|'days';

export function toMs(unit:TimeUnit, time:number) {
    switch (unit) {
        case "seconds":
            return time * 1000
        case "minutes":
            return time * 60 * 1000
        case "hours":
            return time * 60 * 60 * 1000
        case "days":
            return time * 24 * 60 * 60 * 1000
        default:
            return time;
    }
}
export function toSec(unit:TimeUnit, time:number) {
    switch (unit) {
        case "milliseconds":
            return time / 1000
        case "minutes":
            return time * 60
        case "hours":
            return time * 60 * 60
        case "days":
            return time *24 *60 * 60
        default:
            return time;
    }
}
export function toHr(unit:TimeUnit, time:number) {
    switch (unit) {
        case "milliseconds":
            return time / 1000 /60 /60
        case "minutes":
            return time / 60
        case "seconds":
            return time / 60 / 60
        default:
            return time;
    }
}
