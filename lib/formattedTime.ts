export function getFormattedDate(dt: number) {
    const date = new Date(dt * 1000);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    const getOrdinalSuffix = (n: number) => {
        if (n > 3 && n < 21) return `${n}th`;
        switch (n % 10) {
            case 1: return `${n}st`;
            case 2: return `${n}nd`;
            case 3: return `${n}rd`;
            default: return `${n}th`;
        }
    };

    return `${dayOfWeek} ${getOrdinalSuffix(day)} ${monthName} ${year}`;
}

export function getFormattedTime(dt: number) {
    const date = new Date(dt * 1000);

    const pad = (n: number) => String(n).padStart(2, '0');
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${hours}:${minutes}`;
}

