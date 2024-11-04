import { useContext, useEffect, useState } from "react";
import ManufacturerCard from "../../Components/Cards/ManufacturerCard";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import { fetchProduct } from "../../Services/Utils/product";
import { fetchManufacturer } from "../../Services/Utils/stakeholder";

const Manufacturer = () => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [manufacturerAddress, setManufacturerAddress] = useState(
    authState.address
  );
  const [manufacturer, setManufacturer] = useState({
    rawProducts: [],
    launchedProducts: [],
  });

  useEffect(() => {
    if (contractState.manufacturerContract) {
      (async () => {
        await loadManufacturer();
      })();
    }
  }, []);

  const loadManufacturer = async () => {
    if (contractState.manufacturerContract) {
      const manufacturerObject = await fetchManufacturer(
        authState.address,
        contractState.manufacturerContract,
        manufacturerAddress
      );
      const launchedProducts = [];
      for (let i = 0; i < manufacturerObject.launchedProductIds.length; i++) {
        const launchedProduct = await fetchProduct(
          authState.address,
          contractState.productContract,
          manufacturerObject.launchedProductIds[i]
        );
        launchedProduct["manufacturer"] = manufacturerObject;
        launchedProducts.push(launchedProduct);
      }
      setManufacturer({
        ...manufacturerObject,
        launchedProducts,
      });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <ManufacturerCard
          id={manufacturerAddress}
          manufacturerObject={manufacturer}
        />
      </div>
    </div>
  );
};
export default Manufacturer;
