function convertSecoundsToHours(secounds: number): string {
    const date = new Date(Date.UTC(0, 0, 0, 0, 0, secounds));
    return date.toUTCString().substring(17, 25);
}

export default convertSecoundsToHours;
