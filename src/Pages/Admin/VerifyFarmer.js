import { useContext, useEffect, useState } from "react";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import '../../Assests/Styles/verify.page.css';
import StorageAdmin from "../Admin/StorageDisplay/StorageAdmin"

const VerifyFarmer = () => {
  const {contractState} = useContext(ContractContext);
  const [verifiedFarmers, setVerifiedFarmers] = useState([]);
  const [requestedFarmers, setRequestedFarmers] = useState([]);

  useEffect(() => {
    (async () => {
      if (contractState.farmerContract) {
        const { 0: verified, 1: requested } = await contractState.farmerContract.methods.getFarmers().call();
        
        setVerifiedFarmers(verified);
        setRequestedFarmers(requested);
      }
    })();
  }, [contractState.farmerContract]);


  return (
    <div className="verify">
      <div className="heading">Requested Storage Facilities</div>
      <div className="table-responsive">
        {requestedFarmers.length > 0 ? (
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Registration ID</th>
                <th>Contact No.</th>
                <th>Verification Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {requestedFarmers.map(address => (
                <StorageAdmin key={address} id={address} />
              ))}
            </tbody>
          </table>
        ) : (
          <div><p>No Requested Storage Facilities available..</p></div>
        )}
      </div>

      <div className="heading">Verified Storage Facilities</div>
      <div className="table-responsive">
        {verifiedFarmers.length > 0 ? (
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Registration</th>
                <th>Contact</th>
                <th>Verification Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {verifiedFarmers.map(address => (
                <StorageAdmin key={address} id={address} />
              ))}
            </tbody>
          </table>
        ) : (
          <div><p>No Verified Storage Facilities available..</p></div>
        )}
      </div>
    </div>
  )
}
export default VerifyFarmer;