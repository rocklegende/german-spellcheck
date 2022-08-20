import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {spellCheckErrors} from "../dataProvider";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    indexAxis: 'y',
    elements: {
        bar: {
            borderWidth: 1,
        },
    },
    responsive: true,
    plugins: {
        legend: {
            display: false,
            position: 'right',
        },
        title: {
            display: true,
            text: 'Oldenburg',
        },
    },
};



const BarChart = ({spellCheckResults}) => {

    const labels = spellCheckResults.statistics.map(entry => spellCheckErrors[entry.category].title);

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: spellCheckResults.statistics.map(entry => entry.occurences),
                backgroundColor: spellCheckResults.statistics.map(entry => spellCheckErrors[entry.category].markColor),
                borderColor: spellCheckResults.statistics.map(entry => spellCheckErrors[entry.category].borderColor),
            },
        ],
    };

    return <Bar options={options} data={data} type={""} style={{
        maxHeight: "300px"
    }}/>;
}

export default BarChart;
