import React, { useState } from "react";
import ManageAlerts from "./ManageAlerts";

const SensorDashboard = () => {
  const [alerts, ] = useState([]);

  return (
    <div>
      <h2>Manage Alerts Dashboard</h2>
      <ManageAlerts alerts={alerts} />
    </div>
  );
};

export default SensorDashboard;
