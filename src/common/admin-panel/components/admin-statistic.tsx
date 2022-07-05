import React, { useState } from 'react';
import { Box, Text, Button, Placeholder, Label, Table, TableHead, TableBody, TableRow, TableCell } from '@adminjs/design-system';
import { ApiClient } from "adminjs";
import generateDaysInCurrentMonth from "../../utils/generate-days-in-current-month";
import { DatePicker } from '@adminjs/design-system'

const api = new ApiClient();

const adminStatistic = (props) => {
    // console.log(props)
    const [isHide, setStatus] = useState(true);
    let records: Array<{userWorkTime: number, userEmail: string}> = [];
    let meta: {
        totalByPeriod: string,
        usersCount: number
        averageByUser: string
    } = {
        totalByPeriod: "00:00:00",
        usersCount: 0,
        averageByUser: "--:--:--"
    };
    const baseResult = {contentCustomer: "", meta: meta, records: records}
    const [fetchResult, setFetchResult] = useState(baseResult);

    async function setBaseResult() {
        setStatus(true);
        setFetchResult(baseResult);
    }

    const daysInCurrentMonth = generateDaysInCurrentMonth();
    const [dateFrom, setDateFrom] = useState(new Date(daysInCurrentMonth[0].day));
    const [dateTo, setDateTo] = useState(new Date(daysInCurrentMonth[daysInCurrentMonth.length - 1].day));

    async function showDates() {
        setStatus(false);
        let result : {
            data: {
                contentCustomer: string,
                meta: typeof meta,
                records: typeof records
            }
        }
        result = await api.getPage({ 
            pageName: "Admin Statistic", 
            params: { dateFrom: dateFrom, dateTo: dateTo }
        });
        setFetchResult({
            contentCustomer: result.data.contentCustomer,
            meta: result.data.meta,
            records: result.data.records
        })
    }  

    function validateDateSetter(date: Date, dateType: "dateFrom" | "dateTo") {
        if (dateType === "dateFrom" && date < dateTo || dateType === "dateTo" && date > dateFrom) {
            dateType === "dateFrom" ? setDateFrom(date) : setDateTo(date);
        } else {
            alert("Invalid date. Date \"to\" must be higher than date \"from\".")
        }
         
    }

    const metaComponent = <Label>
        <Label>Statistic for {fetchResult.contentCustomer}</Label>
        <Label>Total hours by peroid: {fetchResult.meta.totalByPeriod}</Label>
        <Label>Users: {fetchResult.meta.usersCount}</Label>
        <Label>Average hours by user: {fetchResult.meta.averageByUser}</Label>
        <br></br>
        <Table>
            <TableHead>
                { 
                    fetchResult.records.length ? <TableCell>Index</TableCell> : null 
                }
                {   fetchResult.records.length ?
                    Object.keys(fetchResult.records[0]).map(cellName => (
                        <TableCell>{cellName.toLocaleUpperCase()}</TableCell>
                    )) : null
                }
            </TableHead>
            <TableBody>
                {
                    fetchResult.records.map((record, index) => (
                        <TableRow key={index} align='center'>
                            <TableCell>{index + 1}</TableCell>
                            {
                                Object.keys(record).map(cellName => (
                                    <TableCell>{record[cellName]}</TableCell>
                                ))
                            }
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </Label>

    return (
        <Box variant="grey">
            <div style={{display: (isHide ? 'block' : 'none')}}>
                <Text>
                    From
                </Text>
                <DatePicker 
                    value={dateFrom.toISOString().substring(0, 10)} 
                    selected={dateFrom} 
                    onChange={(date) => validateDateSetter(date, "dateFrom")} 
                ></DatePicker>
                <Text>
                    To
                </Text>
                <DatePicker 
                    value={dateTo.toISOString().substring(0, 10)} 
                    selected={dateTo} 
                    onChange={(date) => validateDateSetter(date, "dateTo")} 
                ></DatePicker>
                <Button onClick={showDates}>Search</Button>
            </div>
            
            <div style={{display: (isHide ? 'none' : 'block')}}>
                {fetchResult?.contentCustomer.length ? <Box>{metaComponent}</Box> : <Placeholder style={{ width: 900, height: 20 }} />}
            </div>

            <Button style={{display: (isHide ? 'none' : 'block')}} onClick={setBaseResult}>Show hiden</Button>
        </Box>
    )
}

export default adminStatistic;

