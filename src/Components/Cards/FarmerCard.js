import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import Toast from "../Toast";
import "../../Assests/Styles/card.css";
import storage_default from "../../Assests/Images/storage_default.jpg";
import { fetchFarmer } from "../../Services/Utils/stakeholder";

const FarmerCard = ({ id, storageObject }) => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const role = authState.stakeholder.role;

  const [storageFacility, setStorageFacility] = useState({
    id: "",
    name: "",
    location: "",
    registration:"",
    contact:"",
    email:"",
    certification:"",
    rawProducts: [],
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (storageObject) {
      setStorageFacility(storageObject);
    } else if (contractState.farmerContract) {
      (async () => {
        setStorageFacility(
          await fetchFarmer(authState.address, contractState.farmerContract, id)
        );
      })();
    }
  }, [storageObject]);

  useEffect(() => {
    if (contractState.productContract && storageFacility.id) {
      (async () => {
        try {
          const ownedProducts = await contractState.productContract.methods
            .getProductsByOwner(storageFacility.id)
            .call();

          setProducts(ownedProducts);
        } catch (e) {
          console.error("Error fetching products: ", e.message);
        }
      })();
    }
  }, [contractState.productContract, storageFacility.id]);

  const verify = async () => {
    try {
      await contractState.farmerContract.methods
        .verify(id)
        .send({ from: authState.address });
        setStorageFacility((farmer) => {
        return {
          ...farmer,
          isVerified: true,
        };
      });
      Toast("success", "Storage Facility verified successfully");
    } catch (e) {
      Toast("error", e.message);
    }
  };

  return (
    <div className="col-12 col-lg-6 my-1">
      <div className="row d-flex justify-content-around align-items-center">
        <div className="col-12 col-md-4">
          <img src={storage_default} width="100%" alt="Farmer" />
        </div>
        <div className="col-12 col-md-8">
          <span className="card-key">Id: </span>
          <span className="card-value">{storageFacility.formattedAddress}</span>
          <br />
          <span className="card-key">Name: </span>
          <span className="card-value">{storageFacility.name}</span>
          <br />
          <span className="card-key">Role: </span>
          <span className="card-value">{storageFacility.role}</span>
          <br />
          <span className="card-key">Location: </span>
          <span className="card-value">{storageFacility.location}</span>
          <br />
          <span className="card-key">Registration ID: </span>
          <span className="card-value">{storageFacility.registration}</span>
          <br />
          <span className="card-key">Contact No: </span>
          <span className="card-value">{storageFacility.contact}</span>
          <br />
          <span className="card-key">Email: </span>
          <span className="card-value">{storageFacility.email}</span>
          <br />          
          <span className="card-key">Certification ID: </span>
          <span className="card-value">{storageFacility.certification}</span>
          <br />
          <span className="">
            <span className="card-key"> Verification: </span>
            {storageFacility.isVerified ? (
              <span className="">
                <span className="badge bg-success">Verified</span>
              </span>
            ) : (
              <span className="">
                <span className="badge bg-warning">Not Verified</span>
                {role === "admin" ? (
                  <span
                    className="badge bg-dark mx-1"
                    type="button"
                    onClick={verify}
                  >
                    <i className="fa fa-certificate" />
                    Verify
                  </span>
                ) : (
                  ""
                )}
              </span>
            )}
          </span>
        </div>
      </div>
      {(role === "temporary-storage-facility" ||
        role === "long-storage-facility") && (
        <div>
          <h5>
            Total Drums Owned {storageFacility.role} : {products.length}
          </h5>
        </div>
      )}
      <hr />
    </div>
  );
};
export default FarmerCard;
