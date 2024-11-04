import React from "react";

const ManageAlerts = ({ alerts }) => {
  return (
    <div>
      <h3>Alert Logs</h3>
      {alerts.length === 0 ? (
        <p>No alerts triggered yet.</p>
      ) : (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>
              <b>Type:</b> {alert.type} <br />
              <b>Threshold:</b> {alert.threshold} <br />
              <b>Time:</b> {new Date().toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageAlerts;
