import React, { useEffect, useState } from 'react';

const toHHMMSS = (milliseconds: number) => {
    const secNumber = Math.floor(milliseconds / 1000);
    const seconds = secNumber % 60;
    const minutes = Math.floor(secNumber / 60) % 60;
    const hours = Math.floor(secNumber / 3600);

    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .join(":");
};

const TimeCounter = ({ initSecond, isEnableTracker }: { initSecond: number, isEnableTracker: boolean }) => {
    const [timedeltaMillisecond, setTimedeltaMillisecond] = useState(initSecond * 1000);
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
                setTimedeltaMillisecond(currentDate.getTime() + (initSecond * 1000) - startDate.getTime());
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