import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const LineChart = (props) => {
  const formatLabel = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const data = {
    labels: props.date.map((date) => formatLabel(date)),
    datasets: [
      {
        label: "Poid du cheval",
        data: props.weights,
        fill: false,
        backgroundColor: "Lavender-Blue",
        borderColor: "Lavender-Blue",
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
