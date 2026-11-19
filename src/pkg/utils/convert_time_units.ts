type TimeUnit = 'seconds'|'minutes'|'hours'|'milliseconds'|'days';

export function toMs(unit:TimeUnit, time:number) {
    switch (unit) {
        case "seconds":
            return time * 1000
            break;
        case "minutes":
            return time * 60 * 1000
            break;
        case "hours":
            return time * 60 * 60 * 1000
            break;
        case "days":
            return time * 24 * 60 * 60 * 1000
            break;
        default:
            return time;
            break;
    }
}
export function toSec(unit:TimeUnit, time:number) {
    switch (unit) {
        case "milliseconds":
            return time / 1000
            break;
        case "minutes":
            return time * 60
            break;
        case "hours":
            return time * 60 * 60
            break;
        default:
            return time;
            break;
    }
}
export function toHr(unit:TimeUnit, time:number) {
    switch (unit) {
        case "milliseconds":
            return time / 1000 /60 /60
            break;
        case "minutes":
            return time / 60
            break;
        case "seconds":
            return time / 60 / 60
            break;
        default:
            return time;
            break;
    }
}