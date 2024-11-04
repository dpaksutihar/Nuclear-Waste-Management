import { useContext, useEffect, useState } from "react";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import '../../Assests/Styles/verify.page.css';
import ManufacturerAdmin from "./ManufacturerDisplay/ManufacturerAdmin";

const Verifymanufacturer = () => {
  const { contractState } = useContext(ContractContext);
  const [verifiedManufacturers, setVerifiedManufacturers] = useState([]);
  const [requestedManufacturers, setRequestedManufacturers] = useState([]);

  useEffect(() => {
    (async () => {
      if (contractState.manufacturerContract) {
        const { 0: verified, 1: requested } = await contractState.manufacturerContract.methods.getManufacturers().call();
        
        setVerifiedManufacturers(verified);
        setRequestedManufacturers(requested);
      }
    })();
  }, [contractState.manufacturerContract]);

  return (
    <div className="verify">
      <div className="heading">Requested Manufacturers</div>
      <div className="table-responsive">
        {requestedManufacturers.length > 0 ? (
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Registration ID</th>
                <th>Contact No.</th>
                <th>Verification Status</th>
                <th>Energy Usage</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {requestedManufacturers.map(address => (
                <ManufacturerAdmin key={address} id={address} />
              ))}
            </tbody>
          </table>
        ) : (
          <div><p>No Requested Manufacturers available..</p></div>
        )}
      </div>

      <div className="heading">Verified Manufacturers</div>
      <div className="table-responsive">
        {verifiedManufacturers.length > 0 ? (
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Registration</th>
                <th>Contact</th>
                <th>Verification Status</th>
                <th>Energy Usage</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {verifiedManufacturers.map(address => (
                <ManufacturerAdmin key={address} id={address} />
              ))}
            </tbody>
          </table>
        ) : (
          <div><p>No Verified Manufacturers available..</p></div>
        )}
      </div>
    </div>
  );
}

export default Verifymanufacturer;
