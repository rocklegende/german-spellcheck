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

import {groupErrorsByGroup} from "../dataProvider";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    // indexAxis: 'y',
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
            text: 'Fehlergruppen',
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Gruppe'
            },
        },
        y: {
            title: {
                display: true,
                text: 'Anzahl'
            },
            min: 0,
            ticks: {
                // forces step size to be 50 units
                stepSize: 1
            }
        }
    }
};



const ErrorsByGroupBarChart = ({spellCheckResults}) => {

    const statistics = groupErrorsByGroup(spellCheckResults.matches);
    const labels = statistics.map(entry => entry.group);
    const backgroundColors = ['rgba(153, 102, 255, 0.4)', 'rgba(255, 159, 64, 0.4)', 'rgba(255, 99, 132, 0.4)'];
    const borderColors = ['rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: statistics.map(entry => entry.occurences),
                backgroundColor: backgroundColors,
                borderColor: borderColors,
            },
        ],
    };

    return <Bar options={options} data={data} type={""} style={{
        maxHeight: "300px"
    }}/>;
}

export default ErrorsByGroupBarChart;
