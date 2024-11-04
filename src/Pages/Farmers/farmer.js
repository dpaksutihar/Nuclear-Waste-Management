import { useContext, useEffect, useState } from "react";

import FarmerCard from "../../Components/Cards/FarmerCard";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import { fetchFarmer } from "../../Services/Utils/stakeholder";

const Farmer = () => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [farmerAddress, setFarmerAddress] = useState(authState.address);
  const [farmer, setFarmer] = useState({});

  useEffect(() => {
    if (contractState.farmerContract) {
      (async () => {
        setFarmer(await fetchFarmer(authState.address, contractState.farmerContract, farmerAddress));
      })();
    }
  }, []);

  return (
    <div className="">
      <div className="d-flex justify-content-center">
        {farmer.formattedAddress ? (
          <FarmerCard id={farmerAddress} storageObject={farmer} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default Farmer;
