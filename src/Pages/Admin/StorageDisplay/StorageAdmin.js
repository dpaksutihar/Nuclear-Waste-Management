import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../Services/Contexts/AuthContext";
import { ContractContext } from "../../../Services/Contexts/ContractContext";
import Toast from "../../../Components/Toast";
import "../../../Assests/Styles/card.css";
import { fetchFarmer } from "../../../Services/Utils/stakeholder";
import MyDrumCard from "../../My Drum/MyDrumCard";

const StorageAdmin = ({ id, farmerObject }) => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [drumAddress, setDrumAddress] = useState(authState.address);
  const role = authState.stakeholder.role;

  const [farmer, setFarmer] = useState({
    id: "",
    name: "",
    location: "",
    registration: "",
    contact: "",
    email: "",
    certification: "",
    rawProducts: [],
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (farmerObject) {
      setFarmer(farmerObject);
    } else if (contractState.farmerContract) {
      (async () => {
        setFarmer(
          await fetchFarmer(authState.address, contractState.farmerContract, id)
        );
      })();
    }
  }, [farmerObject]);

  useEffect(() => {
    if (contractState.productContract && farmer.id) {
      (async () => {
        try {
          const ownedProducts = await contractState.productContract.methods
            .getProductsByOwner(farmer.id)
            .call();

          setProducts(ownedProducts);
        } catch (e) {
          console.error("Error fetching products: ", e.message);
        }
      })();
    }
  }, [contractState.productContract, farmer.id]);

  const verify = async () => {
    try {
      await contractState.farmerContract.methods
        .verify(id)
        .send({ from: authState.address });
      setFarmer((farmer) => {
        return {
          ...farmer,
          isVerified: true,
          isRejected: false,
        };
      });
      Toast("success", "Storage Facility verified successfully");
    } catch (e) {
      Toast("error", e.message);
    }
  };

  const denyRequest = async () => {
    try {
      await contractState.farmerContract.methods
        .reject(id)
        .send({ from: authState.address });
        setFarmer((farmer) => ({
        ...farmer,
        isVerified: false,
        isRejected: true,
      }));
      setShowReject(true);
      Toast("success", "Storage Facility Rejected successfully");
    } catch (e) {
      Toast("error", e.message);
    }
  };

  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <tr>
        <td>{farmer.formattedAddress || "00000"}</td>
        <td>{farmer.name}</td>
        <td>{farmer.role}</td>
        <td>{farmer.registration}</td>
        <td>{farmer.contact}</td>
        <td>
          {showReject ? (
            <div>
              <span className="badge bg-warning">Rejected</span>
            </div>
          ) : farmer.isRejected ? (
            <span className="badge bg-danger">Rejected</span> // Show rejected status
          ) : farmer.isVerified ? (
            <span className="badge bg-success">Verified</span>
          ) : (
            <span className="badge bg-warning">
              Not Verified
              {role === "admin" && !farmer.isRejected ? ( // Hide verify if rejected
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
          <button onClick={toggleDetails}>
            {isExpanded ? "Hide" : "Show"}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={8}>
            <div>
              <h5>Details for {farmer.id}</h5>
              <p>Name : {farmer.name}</p>
              <p>Registration ID : {farmer.registration}</p>
              <p>Contact No : {farmer.contact}</p>
              <p>Location : {farmer.location}</p>
              <p>Email : {farmer.email}</p>
              <p>Certification ID : {farmer.certification}</p>
              <p>Manager Name : {farmer.managerName}</p>
              <p>Manager Contact : {farmer.managerContact}</p>
              {!showReject && !farmer.isVerified && !farmer.isRejected && (
                <button onClick={denyRequest}>Deny Request</button>
              )}

              <div>
                {farmer.formattedAddress ? (
                  <MyDrumCard id={drumAddress} drumObject={farmer} />
                ) : (
                  <div>Loading...</div>
                )}
                <hr />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};
export default StorageAdmin;
