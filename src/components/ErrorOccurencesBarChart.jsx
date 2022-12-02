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
import {groupErrorsByOccurence, spellCheckErrors} from "../dataProvider";

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
            text: 'Fehlerübersicht',
        },
    },
    scales: {
        x: {
            min: 0,
            ticks: {
                // forces step size to be 50 units
                stepSize: 1
            }
        }
    }
};



const ErrorOccurencesBarChart = ({spellCheckResults}) => {

    const statistics = groupErrorsByOccurence(spellCheckResults.matches);
    const labels = statistics.map(entry => `${spellCheckErrors[entry.category].title}`);

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: statistics.map(entry => entry.occurences),
                backgroundColor: statistics.map(entry => spellCheckErrors[entry.category].markColor),
                borderColor: statistics.map(entry => spellCheckErrors[entry.category].borderColor),
            },
        ],
    };

    return <Bar options={options} data={data} type={""} style={{
        maxHeight: "600px"
    }}/>;
}

export default ErrorOccurencesBarChart;
