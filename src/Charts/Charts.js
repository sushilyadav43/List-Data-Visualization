// ZoneCharts.js
import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, DoughnutController, CategoryScale, LinearScale, BarController, BarElement, Legend } from 'chart.js';
import { registerables } from 'chart.js';
Chart.register(...registerables, ArcElement, DoughnutController, CategoryScale, LinearScale, BarController, BarElement, Legend);

const ZoneCharts = ({ userlistData, selectedZone }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    generateChartData();
  }, [userlistData, selectedZone]);

  const generateChartData = () => {
    const filteredData = selectedZone ? userlistData.filter((item) => item.zone === selectedZone) : userlistData;

    const vehicleCCData = generateStackedBarChartData(filteredData, 'zone', 'vehicle_cc');
    const sdkIntData = generateStackedBarChartData(filteredData, 'zone', 'sdk_int');

    const deviceBrandData = generatePieChartData(filteredData, 'device_brand');
    const vehicleBrandData = generatePieChartData(filteredData, 'vehicle_brand');

    const vehicleBrandBarData = generateBarChartData(filteredData, 'vehicle_brand', 'Total Vehicles');
    const sdkIntBarData = generateBarChartData(filteredData, 'sdk_int', 'Total Devices');

    setChartData({
      vehicleCCData,
      sdkIntData,
      deviceBrandData,
      vehicleBrandData,
      vehicleBrandBarData,
      sdkIntBarData,
    });
  };

  const generateStackedBarChartData = (data, property1, property2, label) => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }
  
    const uniqueValues = [...new Set(data.map((item) => item[property1]))];
    const labels = uniqueValues.map((value) => value || 'Unknown');
    const datasets = [];
  
    // Create datasets for each property
    const property1Values = [...new Set(data.map((item) => item[property1]))];
    const property2Values = [...new Set(data.map((item) => item[property2]))];
  
    property1Values.forEach((prop1) => {
      const dataForProp1 = property2Values.map((prop2) => {
        const count = data.filter((item) => item[property1] === prop1 && item[property2] === prop2).length;
        return count;
      });
  
      datasets.push({
        label: `${prop1} - ${label}`,
        data: dataForProp1,
        backgroundColor: getRandomColors(property2Values.length),
      });
    });
  
    return { labels, datasets };
  };
  

  const generatePieChartData = (data, property) => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    const uniqueValues = [...new Set(data.map((item) => item[property]))];
    const labels = uniqueValues.map((value) => value || 'Unknown');
    const datasets = [
      {
        data: labels.map((label) => data.filter((item) => item[property] === label).length),
        backgroundColor: getRandomColors(labels.length),
      },
    ];
    return { labels, datasets };
  };

  const generateBarChartData = (data, property, label) => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    const uniqueValues = [...new Set(data.map((item) => item[property]))];
    const labels = uniqueValues.map((value) => value || 'Unknown');
    const datasets = [
      {
        label,
        data: labels.map((label) => data.filter((item) => item[property] === label).length),
        backgroundColor: getRandomColors(labels.length),
      },
    ];
    return { labels, datasets };
  };

  const getRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, 0.7)`);
    }
    return colors;
  };

  const getRandomColor = () => {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, 0.7)`;
  };

  return (
    <div>
      {chartData && (
        <>
          {/* Stacked Bar Charts */}
          <div>
            <h2>Vehicle CC Distribution Between Zones</h2>
            <Bar data={chartData.vehicleCCData} options={{ scales: { x: { stacked: true }, y: { stacked: true } } }} />
          </div>

          <div>
            <h2>SDK Int Distribution Between Zones</h2>
            <Bar data={chartData.sdkIntData} options={{ scales: { x: { stacked: true }, y: { stacked: true } } }} />
          </div>

          {/* Remaining Charts */}
          {/* ... */}
          {/* PIE Charts */}
          <div>
            <h2>Device Brand Distribution</h2>
            <Doughnut data={chartData.deviceBrandData} />
          </div>

          <div>
            <h2>Vehicle Brand Distribution</h2>
            <Doughnut data={chartData.vehicleBrandData} />
          </div>

          <div>
            <h2>Vehicle CC Distribution</h2>
            <Doughnut data={chartData.vehicleCCData} />
          </div>

          {/* Bar Charts */}
          <div>
            <h2>Vehicle Distribution by Brand</h2>
            <Bar data={chartData.vehicleBrandBarData} />
          </div>

          <div>
            <h2>Device Distribution by SDK Version</h2>
            <Bar data={chartData.sdkIntBarData} />
          </div>

        </>
      )}
    </div>
  );
};

export default ZoneCharts;
