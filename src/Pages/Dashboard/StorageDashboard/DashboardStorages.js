import { useContext, useEffect, useState } from "react";
import { ContractContext } from "../../../Services/Contexts/ContractContext";
import DashboardStorageCard from "./DashboardStorageCard";
import { AuthContext } from "../../../Services/Contexts/AuthContext";
import { fetchManufacturer } from "../../../Services/Utils/stakeholder";

const DashboardStorages = () => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [drumAddress, setDrumAddress] = useState(authState.address);
  const [drum, setDrum] = useState({});
  const [productIds, setProductids] = useState([]);
  const [products, setProducts] = useState({});

  useEffect(() => {
    if(contractState.productContract){
      (async () => {
        const productIds = await contractState.productContract.methods.getItemIds().call({from: authState.address});        
        setProductids(productIds);
      })();
    }
  },[])

  useEffect(() => {
    if(contractState.productContract){
      (async () => {
        const products = {};
        for(let i = 0; i < productIds.length; i++){
          const response = await contractState.productContract.methods.get(productIds[i]).call({from: authState.address});
          const product = {
            "item": response.item,
            "rawProducts": response.rawProducts,
            "reviews": response.reviews,
            "transactions": response.transactions,
            "manufacturer": await fetchManufacturer(authState.address, contractState.manufacturerContract, response.item["manufacturer"])
          }
          if(product.item.manufacturer !== "0x0000000000000000000000000000000000000000"){
            products[productIds[i]] = product;
          }
        }
        setProducts(products);
      })();
    }
  }, [productIds])

  useEffect(() => {
    if (contractState.manufacturerContract) {
      (async () => {
        const fetchedDrum = await fetchManufacturer(
          authState.address,
          contractState.manufacturerContract,
          drumAddress
        );
        setDrum(fetchedDrum);
      })();
    }
  }, []);

  return (
    <div className="bottom-wrapper">
      <div className="d-flex justify-content-center">
        {drum.formattedAddress ? (
          <DashboardStorageCard id={drumAddress} drumObject={drum} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};
export default DashboardStorages;
