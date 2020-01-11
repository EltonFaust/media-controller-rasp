
export function strlimit(str, length) {
    return str.length > length ? `${str.substr(0, length - 3).trim()}...` : str;
}

export function millistohuman(millis) {
    let temp = parseInt(millis, 10) / 1000;
    const years = Math.floor(temp / 31536000);
    const days = Math.floor((temp %= 31536000) / 86400);
    const hours = Math.floor((temp %= 86400) / 3600);
    const minutes = Math.floor((temp %= 3600) / 60);
    const seconds = temp % 60;

    if (days || hours || minutes || seconds) {
        const humanTime = [];

        if (years) {
            humanTime.push(`${years}y`);
        }

        if (days) {
            humanTime.push(`${days}d`);
        }

        if (hours) {
            humanTime.push(`${hours}h`);
        }

        if (minutes) {
            humanTime.push(`${minutes}m`);
        }

        if (seconds > 1 && !years && !days && !hours) {
            humanTime.push(`${seconds.toFixed(0)}s`);
        }

        return humanTime.join(' ');
    }

    return '< 1s';
}
