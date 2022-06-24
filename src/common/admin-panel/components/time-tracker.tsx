import React, { useEffect, useState } from 'react';
import { Box, Label } from '@adminjs/design-system';
import { ApiClient } from "adminjs";
import TimeCounter from "./time-counter";
import { TimeShotEntity } from "../../../database/entities/time-shot.entity";


const api = new ApiClient();

function todayDate(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

async function getWorkingTimeShot() {
    const result = await api.resourceAction({
        resourceId: "TimeShotEntity",
        actionName: "getWorkingTimeShot"
    });
    return result.data.record;
}

async function getTotalMillisecondForCompletedTimeShotsToday() {
    const result = await api.resourceAction({
        resourceId: "TimeShotEntity",
        actionName: "getTotalMillisecondForCompletedTimeShotsToday"
    });
    return result.data.totalMillisecond;
}


async function onClickTimeTracker(isEnableTracker: boolean, setIsEnableTracker: Function) {
    console.log('YES');
    await api.resourceAction({
        resourceId: "TimeShotEntity",
        actionName: isEnableTracker ? "stopTracker" : "startTracker",
        data: {
            "user": "57eda2be-6bca-4871-8358-d141ef2ad06e",
            "location": "99be802a-e568-4b60-881e-a5306ea8666f"
        }
    });
    setIsEnableTracker(!isEnableTracker);
}

const getSvg = (isEnableTracker: boolean) => {
    const d1 = isEnableTracker ? 'M11 22h-4v-20h4v20z' : "M3 22v-20l18 10-18 10z";
    const d2 = isEnableTracker ? "M17 22h-4v-20h4v-20z" : "M7.26274645,12.6635515 C7.26274645,13.4126534 6.94859678,12.5187543 7.00731285,12.6635515 C7.18860321,13.1106239 7.84805291,12.5509389 7.26274645,12.103737 C7.02916666,11.925271 7.26274645,12.103737 7.00731285,12.446144 C6.97368062,12.4912277 7.05882516,12.6387618 7.26274645,12.8887463";

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="100"
            viewBox="0 0 24 24"
        >
            <path d={d1}></path>
            <path d={d2} style={{ opacity: 1 }}></path>
        </svg>
    );
};

function getMillisecondDelta(timeShotEntity: { id: string, start: string } | null): number {
    if (!timeShotEntity) {
        return 0;
    }

    let startDate = new Date(timeShotEntity.start);
    const nowDate = new Date();

    if (
        startDate.getFullYear() !== nowDate.getFullYear() ||
        startDate.getMonth() !== nowDate.getMonth() ||
        startDate.getDate() !== nowDate.getDate()
    ) {
        startDate = todayDate(nowDate);
    }

    const millisecondDelta = nowDate.getTime() - startDate.getTime();
    if (millisecondDelta < 0) {
        throw new Error("error in calculating the past tense");
    }
    return millisecondDelta;
}

const TimeTracker = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isEnableTracker, setIsEnableTracker] = useState(false);
    const [todayMillisecond, setTodayMillisecond] = useState(0);

    async function initialize() {
        const totalMillisecond: number = await getTotalMillisecondForCompletedTimeShotsToday();
        const timeShotEntity: { id: string, start: string } | null = await getWorkingTimeShot();
        const millisecondDelta: number = getMillisecondDelta(timeShotEntity);
        const v = totalMillisecond + millisecondDelta;
        console.log(v);
        setTodayMillisecond(totalMillisecond + millisecondDelta);
        setIsEnableTracker(!!timeShotEntity);
    }

    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            initialize();
        }
    });

    return (
        <Box variant="grey">
            <Box variant="grey">

                <Label style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TimeCounter initMillisecond={todayMillisecond} isEnableTracker={isEnableTracker}></TimeCounter>
                </Label>
                <button
                    onClick={() => setIsEnableTracker(!isEnableTracker)}
                    /*onClickTimeTracker(isEnableTracker, setIsEnableTracker)*/
                    style={{
                        border: "none",
                        backgroundColor: isEnableTracker ? "#ffdada" : "#e4ffd7",
                        boxShadow: "0 0 4px 2px rgba(0,0,0,.2)",
                        cursor: "pointer",
                        outline: "none",
                        borderRadius: "100%",
                        width: 360,
                        height: 360,
                        margin: "auto",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {getSvg(isEnableTracker)}
                </button>
            </Box>
        </Box>
    );
};

export default TimeTracker;
