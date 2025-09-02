import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const LineChart = (props) => {
  const formatDate = (/** @type {string | number | Date} */ dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const data = {
    labels: props.date.map((date) => formatDate(date)),
    datasets: [
      {
        label: "Poid du cheval",
        data: props.weights,
        fill: false,
        backgroundColor: "text-Lavender-Blue",
        borderColor: "text-Lavender-Blue",
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
