import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import '../../Assests/Styles/card.css';
import stakeholder_default from '../../Assests/Images/stakeholder_default.jpg';
import { fetchStakeholder } from "../../Services/Utils/stakeholder";

const StakeholderCard = ({ id }) => {
  const {authState} = useContext(AuthContext);
  const {contractState} = useContext(ContractContext);
  const [stakeholder, setStakeholder] = useState({
    id: "",
    name: "",
    location: "",
    registration:"",
    contact:"",
    email:"",
    certification:"",
    formattedAddress: "",
  });

  useEffect(() => {
    (async () => {
      setStakeholder(await fetchStakeholder(
        authState.address,
        contractState.stakeholderContract,
        id
      ));
    })();
  }, []);

  return (
    <div className="col-12 col-lg-6 my-1">
      <div className="row d-flex justify-content-around align-items-center">
        <div className="col-12 col-md-4">
          <img 
            src={stakeholder_default}
            width="100%"
          />
        </div>
        <div className="col-12 col-md-8">
          <span className="card-key">Serial Number : </span>
          <span className="card-value">{stakeholder.formattedAddress}</span>
          <br/>
          <span className="card-key">Name : </span>
          <span className="card-value">{stakeholder.name}</span>
          <br/>
          <span className="card-key">Email: </span>
          <span className="card-value">{stakeholder.email}</span>
          <br/>          
          <span className="card-key">Contact: </span>
          <span className="card-value">{stakeholder.contact}</span>
          <br/>          
          <span className="card-key">Address: </span>
          <span className="card-value">{stakeholder.location}</span>
          <br/>
          <span className="card-key">Role: </span>
          <span className="card-value">{stakeholder.role}</span>
          <br/>         
        </div>
      </div>
      <hr/>
    </div>
  )
}
export default StakeholderCard;