import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Services/Contexts/AuthContext";
import { ContractContext } from "../../../Services/Contexts/ContractContext";
import '../../../Assests/Styles/card.css';
import Toast from "../../../Components/Toast";
import { fetchManufacturer } from "../../../Services/Utils/stakeholder";

const ManufacturerReg = ({id, manufacturerObject}) => {
  const {authState} = useContext(AuthContext);
  const {contractState} = useContext(ContractContext);
  const role = authState.stakeholder.role;
  const [manufacturer, setManufacturer] = useState({
    id: "",
    name: "",
    location: "",
    isRenewableUsed: false,
    rawProducts: [],
  });

  useEffect(() => {
    if(manufacturerObject){
      setManufacturer(manufacturerObject);
    }
    else if(contractState.manufacturerContract){
      (async() => {
        setManufacturer(await fetchManufacturer(
          authState.address,
          contractState.manufacturerContract,
          id
        ))
      })();
    }
  }, [manufacturerObject])

  const verify = async () => {
    try{
      await contractState.manufacturerContract.methods.verify(id).send({from: authState.address});
      setManufacturer(manufacturer => {
        return {
          ...manufacturer,
          isVerified: true
        }
      })
      Toast("success", "Manufacturer verified successfully");
    } catch(e){
      Toast("error", e.message);
    }
  }

  return (
    <div className="col-12 col-lg-6 my-1">
      <div className="row d-flex justify-content-around align-items-center">
        <div className="col-12 col-md-8">
          <span className="card-key">Id: </span>
          <span className="card-value">{manufacturer.formattedAddress}</span>
          <br/>
          <span className="card-key">Name: </span>
          <span className="card-value">{manufacturer.name}</span>
          <br/>
          <span className="">
            <span className="card-key"> Verification: </span>
            {manufacturer.isVerified?
              <span className="">
                <span className="badge bg-success">Verified</span>
              </span>
            :
              <span className="">
                <span className="badge bg-warning">Not Verified</span>
                {role === "admin"? 
                  <span 
                    className="badge bg-dark mx-1" 
                    type="button"
                    onClick={verify}
                  >
                    <i class="fa fa-certificate"/>
                    Verify
                  </span>
                : ""
                }
              </span>
            }
          </span>
          <br/>
        </div>
      </div>
      <hr/>
    </div>
  )
}
export default ManufacturerReg;