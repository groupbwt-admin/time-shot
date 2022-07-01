import React from 'react';
import { useRecord } from 'adminjs';

const showStatistic = (props) => {
    const { record: initialRecord, resource } = props;
    const { record } = useRecord(initialRecord, resource.id);

    const resultsItems = record.results.map((record, index) =>
        <tr style={{width: '100%', height: '30px', border: '1px solid', textAlign: 'center'}}>
            <td style={{border: '1px solid', textAlign: 'center', verticalAlign: 'middle'}}>{index + 1}</td>
            <td style={{border: '1px solid', textAlign: 'center', verticalAlign: 'middle'}}>{record.dayStart}</td>
            <td style={{border: '1px solid', textAlign: 'center', verticalAlign: 'middle'}}>{record.dayEnd}</td>
            <td style={{border: '1px solid', textAlign: 'center', verticalAlign: 'middle', fontWeight: 550, fontSize: 14}}>{record.workTime}</td>
        </tr>
    )
    
    return (
        <div>
            {/* <style>.center {text-align='center'}</style> */}
            <table>
                <thead style={{width: '100%', height: '60px', border: '2px solid', fontWeight: 400, fontSize: 16}}>
                    <th style={{width: '13%', border: '1px solid', verticalAlign: 'middle'}}>Week number</th>
                    <th style={{width: '29%', border: '1px solid', verticalAlign: 'middle'}}>Monday</th>
                    <th style={{width: '29%', border: '1px solid', verticalAlign: 'middle'}}>Sunday</th>
                    <th style={{border: '1px solid', textAlign: 'center', verticalAlign: 'middle'}}>Worked per week</th>
                </thead>
                <tbody style={{width: '100%', border: '2px solid'}}>
                    {resultsItems}
                    <tr style={{height: '15px', border: '1px solid'}}>
                        <td></td>
                    </tr>
                    <tr style={{width: '20px', height: '15px', textAlign: 'center', fontWeight: 400, fontSize: 16}}>
                        <td style={{width: '13%', height: '45px', border: '1px solid', textAlign: 'center', verticalAlign: 'middle'}}>
                            Worked per month
                        </td>
                        <td colspan='3' style={{width: '13%', height: '45px', border: '1px solid',
                            textAlign: 'center', verticalAlign: 'middle', fontWeight: 800, fontSize: 20}}>
                            {record.totalWorkTime}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    )
}

export default showStatistic;
