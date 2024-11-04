import { useContext, useEffect, useState } from "react";
import MyDrumCard from "./MyDrumCard";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import { fetchFarmer } from "../../Services/Utils/stakeholder";

const MyDrum = () => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [drumAddress, setDrumAddress] = useState(authState.address);
  const [drum, setDrum] = useState({});

  useEffect(() => {
    if (contractState.farmerContract) {
      (async () => {
        setDrum(await fetchFarmer(authState.address, contractState.farmerContract, drumAddress));
      })();
    }
  }, []);

  return (
    <div className="">
      <div className="d-flex justify-content-center">
        {drum.formattedAddress ? (
          <MyDrumCard id={drumAddress} drumObject={drum} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default MyDrum;
