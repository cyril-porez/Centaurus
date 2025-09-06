import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const LineChart = (props) => {
  const formatDate = (/** @type {string | number | Date} */ dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const COLOR = "#1F4E89";

  const data = {
    labels: props.date.map((date) => formatDate(date)),
    datasets: [
      {
        label: "Poid du cheval",
        data: props.weights,
        fill: false,
         borderColor: COLOR, // ? couleur de la ligne
        backgroundColor: COLOR, 
        pointBackgroundColor: COLOR, // ? couleur des points
        pointBorderColor: COLOR,
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
