import React, { useState, useEffect } from "react";
import "./style.css"; 

const generateRandomData = () => {
  const now = new Date();
  const date = now.toLocaleDateString(); 
  const time = now.toLocaleTimeString();

  return {
    date,
    time,
    radioactivity: (Math.random() * 100).toFixed(2),
    temperature: (Math.random() * 50).toFixed(2),
    humidity: (Math.random() * 100).toFixed(2),
    longitude: (Math.random() * 360 - 180).toFixed(6),
    latitude: (Math.random() * 180 - 90).toFixed(6),
    acceleration: (Math.random() * 10).toFixed(2),
  };
};

const MQTT_Sensor_Script = ({ userAlerts, onAlertTriggered }) => {
  const [sensorDataArray, setSensorDataArray] = useState([]);

  useEffect(() => {

    const storedData = JSON.parse(localStorage.getItem("sensorData")) || [];
    setSensorDataArray(storedData);

    const interval = setInterval(() => {
      const newData = generateRandomData();

      userAlerts?.forEach((alert) => {
        const { type, threshold } = alert;
        if (newData[type] > threshold) {
          const alertMessage = `${type} exceeded threshold of ${threshold}: ${newData[type]}`;
          onAlertTriggered({ 
            type, 
            message: alertMessage, 
            timestamp: newData.date + ' ' + newData.time 
          });
        }
      });

      setSensorDataArray((prevData) => {
        const updatedData = [newData, ...prevData.slice(0, 4)];
        localStorage.setItem("sensorData", JSON.stringify(updatedData)); 
        return updatedData;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [userAlerts, onAlertTriggered]);

  return (
    <div className="container">
      <div className="card">
        <h3 className="card-header">Sensors Readings</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Radioactivity</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Longitude</th>
                <th>Latitude</th>
                <th>Acceleration</th>
              </tr>
            </thead>
            <tbody>
              {sensorDataArray.map((data, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "row-even" : "row-odd"}
                >
                  <td>{data.date}</td>
                  <td>{data.time}</td>
                  <td>{data.radioactivity}</td>
                  <td>{data.temperature}</td>
                  <td>{data.humidity}</td>
                  <td>{data.longitude}</td>
                  <td>{data.latitude}</td>
                  <td>{data.acceleration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MQTT_Sensor_Script;
