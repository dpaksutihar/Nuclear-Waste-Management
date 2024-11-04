import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { AuthContext } from "../Services/Contexts/AuthContext";
import Dashboard from "../Pages/Dashboard";
import Products from "../Pages/Products";
import Product from "../Pages/Products/product";
import Register from "../Pages/Register";
import Admin from "../Pages/Admin";
import VerifyFarmer from "../Pages/Admin/VerifyFarmer";
import VerifyManufacturer from "../Pages/Admin/VerifyManufacturer";
import Farmers from "../Pages/Farmers";
import Farmer from "../Pages/Farmers/farmer";
import Manufacturers from "../Pages/Manufacturers";
import Manufacturer from "../Pages/Manufacturers/manufacturer";
import Profile from "../Pages/Profile";
import RegisterDrumManufacturer from "../Pages/Manufacturers/Register Drum/RegisterDrumManufacturer";
import SensorDashboard from "../Pages/Manage Alerts/SensorDashboard";
import DashboardManufacturer from "../Pages/Dashboard/ManufacturerDashboard/DashboardManufacturer";
import DashboardStorages from "../Pages/Dashboard/StorageDashboard/DashboardStorages";

const Routing = () => {
  const { authState } = useContext(AuthContext);
  const isAuthenticated = authState.isAuthenticated;
  const role = authState.stakeholder.role;
  const isRegistered = authState.stakeholder.isRegistered;
  const isVerified = authState.stakeholder.isVerified;

  const authRoutes = () => {
    if (isAuthenticated && !isRegistered) {
      return (
        <>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/register" element={<Register />} />
        </>
      );
    } else if (isAuthenticated) {
      return (
        <>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<Product />} /> 
        </>
      );
    }
  };

  const roleRoutes = () => {
    if (role === "admin") {
      return (
        <>
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/admin/verify/storage-facilities"
            element={<VerifyFarmer />}
          />
          <Route
            path="/admin/verify/storage-facilities"
            element={<VerifyFarmer />}
          />
          <Route
            path="/admin/verify/manufacturer"
            element={<VerifyManufacturer />}
          />
          <Route
            path="/admin/verify/manage-alerts/:id"
            element={<SensorDashboard />}
          />
        </>
      );
    } else if (role === "temporary-storage-facility") {
      return (
        <>
          <Route path="/storage-facilities" element={<Farmers />} />
          <Route path="/storage-facilities/:id" element={<Farmer />} />
          <Route
            path="/storage-facilities/manage-alerts/:id"
            element={<SensorDashboard />}
          />
        </>
      );
    } else if (role === "long-storage-facility") {
      return (
        <>
          <Route path="/storage-facilities" element={<Farmers />} />
          <Route path="/storage-facilities/:id" element={<Farmer />} />
          <Route
            path="/storage-facilities/manage-alerts/:id"
            element={<SensorDashboard />}
          />
        </>
      );
    } else if (role === "manufacturer") {
      return (
        <>
          {isVerified ? (
            <>
              {" "}
              <Route path="/manufacturers" element={<Manufacturers />} />
              <Route path="/manufacturers/me/:id" element={<Manufacturer />} />
              <Route
                path="/manufacturers/register-drum/:id"
                element={<RegisterDrumManufacturer />}
              />
              <Route
                path="/manufacturers/manage-alerts/:id"
                element={<SensorDashboard />}
              />
            </>
          ) : (
            <>
              <Route path="/manufacturers" element={<Manufacturers />} />
              <Route path="/manufacturers/me/:id" element={<Manufacturer />} />
            </>
          )}
        </>
      );
    } else if (isRegistered) {
      return (
        <>
          <Route path="/profile" element={<Profile />} />
        </>
      );
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          role === "manufacturer" ? (
            <DashboardManufacturer />
          ) : role === "temporary-storage-facility" ? (
            <DashboardStorages />
          ) : role === "long-storage-facility" ? (
            <DashboardStorages />
          ) : (
            <Dashboard />
          )
        }
      />
      {authRoutes()}
      {roleRoutes()}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default Routing;
