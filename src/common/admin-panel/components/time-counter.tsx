import React, { useEffect, useState } from 'react';

const toHHMMSS = (milliseconds: number) => {
    const secNumber = Math.floor(milliseconds / 1000);
    const seconds = secNumber % 60;
    const minutes = Math.floor(secNumber / 60) % 60;
    const hours = Math.floor(secNumber / 3600);

    const formatText = [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .join(":");
    console.log(formatText);
    return formatText;
};

const TimeCounter = ({ initMillisecond, isEnableTracker }: { initMillisecond: number, isEnableTracker: boolean }) => {
    console.log(initMillisecond);

    const [timedeltaMillisecond, setTimedeltaMillisecond] = useState(initMillisecond);
    const [startDate, setStartDate] = useState(new Date());
    const [previousTrackerState, setPreviousTrackerState] = useState(isEnableTracker);
    useEffect(() => {
        if (previousTrackerState != isEnableTracker) {
            setPreviousTrackerState(isEnableTracker);
            setStartDate(new Date());
        }

        if (isEnableTracker) {
            const intervalId = setInterval(function () {
                const currentDate = new Date();
                setTimedeltaMillisecond(currentDate.getTime() + (initMillisecond) - startDate.getTime());
            }, 1000);
            return () => {
                clearInterval(intervalId);
            };
        }
    });
    return (
        <p>Today: {toHHMMSS(timedeltaMillisecond)}</p>
    );
};

export default TimeCounter;