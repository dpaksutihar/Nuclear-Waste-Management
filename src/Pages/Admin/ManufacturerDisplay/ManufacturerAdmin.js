import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Services/Contexts/AuthContext";
import { ContractContext } from "../../../Services/Contexts/ContractContext";
import "../../../Assests/Styles/card.css";
import Toast from "../../../Components/Toast";
import { fetchManufacturer } from "../../../Services/Utils/stakeholder";

const ManufacturerAdmin = ({ id, manufacturerObject }) => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const role = authState.stakeholder.role;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReject, setShowReject] = useState(false);

  const [manufacturer, setManufacturer] = useState({
    id: "",
    name: "",
    location: "",
    registration: "",
    contact: "",
    email: "",
    certification: "",
    managerName:"",
    managerContact:"",
    isRenewableUsed: false,
    rawProducts: [],
  });

  useEffect(() => {
    if (manufacturerObject) {
      setManufacturer(manufacturerObject);
    } else if (contractState.manufacturerContract) {
      (async () => {
        setManufacturer(
          await fetchManufacturer(
            authState.address,
            contractState.manufacturerContract,
            id
          )
        );
      })();
    }
  }, [manufacturerObject]);

  const verify = async () => {
    try {
      await contractState.manufacturerContract.methods
        .verify(id)
        .send({ from: authState.address });
      setManufacturer((manufacturer) => ({
        ...manufacturer,
        isVerified: true,
        isRejected: false,
      }));
      Toast("success", "Manufacturer verified successfully");
    } catch (e) {
      Toast("error", e.message);
    }
  };

  const update = async () => {
    try {
      await contractState.manufacturerContract.methods
        .updateEnergy(id)
        .send({ from: authState.address });
      setManufacturer((manufacturer) => ({
        ...manufacturer,
        isRenewableUsed: true,
      }));
      Toast("success", "Manufacturer's energy updated");
    } catch (e) {
      Toast("error", e.message);
    }
  };

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  const denyRequest = async () => {
    try {
      await contractState.manufacturerContract.methods
        .reject(id)
        .send({ from: authState.address });
      setManufacturer((manufacturer) => ({
        ...manufacturer,
        isVerified: false,
        isRejected: true,
      }));
      setShowReject(true);
      Toast("success", "Manufacturer Rejected successfully");
    } catch (e) {
      Toast("error", e.message);
    }
  };

  return (
    <>
      <tr>
        <td>{manufacturer.formattedAddress || "00000"}</td>
        <td>{manufacturer.name}</td>
        <td>{manufacturer.role}</td>
        <td>{manufacturer.registration}</td>
        <td>{manufacturer.contact}</td>
        <td>
          {showReject ? (
            <div>
              <span className="badge bg-warning">Rejected</span>
            </div>
          ) : manufacturer.isRejected ? (
            <span className="badge bg-danger">Rejected</span> // Show rejected status
          ) : manufacturer.isVerified ? (
            <span className="badge bg-success">Verified</span>
          ) : (
            <span className="badge bg-warning">
              Not Verified
              {role === "admin" && !manufacturer.isRejected ? ( // Hide verify if rejected
                <span
                  className="badge bg-dark mx-1"
                  type="button"
                  onClick={verify}
                >
                  <i className="fa fa-certificate" /> Verify
                </span>
              ) : (
                ""
              )}
            </span>
          )}
        </td>

        <td>
          {manufacturer.isRenewableUsed ? (
            <span className="badge bg-success">Nuclear</span>
          ) : (
            <span className="badge bg-warning">Non-Nuclear</span>
          )}
          {role === "admin" && !manufacturer.isRenewableUsed ? (
            <span className="badge bg-dark mx-1" type="button" onClick={update}>
              <i className="fa fa-fire" /> Update
            </span>
          ) : (
            ""
          )}
        </td>
        <td>
          <button onClick={toggleDetails}>
            {isExpanded ? "Hide" : "Show"}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={8}>
            <div>
              <h5>Details for {manufacturer.id}</h5>
              <p>Name : {manufacturer.name}</p>
              <p>Registration ID : {manufacturer.registration}</p>
              <p>Contact No : {manufacturer.contact}</p>
              <p>Location : {manufacturer.location}</p>
              <p>Email : {manufacturer.email}</p>
              <p>Certification ID : {manufacturer.certification}</p>
              <p>Manager Name : {manufacturer.managerName}</p>
              <p>Manager Contact : {manufacturer.managerContact}</p>
              {!showReject && !manufacturer.isVerified && !manufacturer.isRejected && (
                <button onClick={denyRequest}>Deny Request</button>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ManufacturerAdmin;
