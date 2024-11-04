import { useContext, useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputGroupText,
  FormGroup,
  Label,
} from "reactstrap";
import "../Assests/Styles/register.page.css";
import { AuthContext } from "../Services/Contexts/AuthContext";
import { ContractContext } from "../Services/Contexts/ContractContext";
import Toast from "../Components/Toast";

const Register = () => {
  const { authState } = useContext(AuthContext);
  const { contractState, loadStakeholder } = useContext(ContractContext);
  const [stakeholder, setStakeholder] = useState({
    name: "",
    location: "",
    role: "manufacturer",
    registration: "",
    contact: "",
    email: "",
    certification: "",
    managerName: "", 
    managerContact: "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStakeholder({
      ...stakeholder,
      [name]: value,
    });
  };

  const register = async () => {
    let contract = null;
    switch (stakeholder.role) {
      case "temporary-storage-facility":
        contract = contractState.farmerContract;
        break;
      case "long-storage-facility":
        contract = contractState.farmerContract;
        break;
      case "manufacturer":
        contract = contractState.manufacturerContract;
        break;
      default:
        contract = contractState.stakeholderContract;
    }
    if (contract) {
      await contract.methods
        .register(
          stakeholder.name,
          stakeholder.registration,
          stakeholder.contact,
          stakeholder.email,
          stakeholder.certification,
          stakeholder.location,
          stakeholder.role,
          stakeholder.managerName,
          stakeholder.managerContact,
        )
        .send({ from: authState.address });
      Toast("success", "Registered successfully");
      loadStakeholder();
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="register-card">
          <span className="register-card-heading">Register</span>
          <hr />
          <br />
          <Label className="role-heading">Select your Role</Label>
          <InputGroup>
            <InputGroupText>Role</InputGroupText>
            <Input type="select" name="role" onChange={handleChange}>
              <option value="manufacturer">Manufacturer</option>
              <option value="temporary-storage-facility">
                Temporary Storage Facility
              </option>
              <option value="long-storage-facility">
                Long-term Storage Facility
              </option>
              <option value="general-public">General Public</option>
            </Input>
          </InputGroup>
          <br />

          {[
            "temporary-storage-facility",
            "long-storage-facility",
            "manufacturer",
          ].includes(stakeholder.role) && (
            <FormGroup>
              <InputGroup>
                <InputGroupText>Name</InputGroupText>
                <Input
                  placeholder="your name"
                  name="name"
                  onChange={handleChange}
                />
              </InputGroup>
              <br />
              <InputGroup>
                <InputGroupText>Registration ID</InputGroupText>
                <Input
                  placeholder="Enter Registration id"
                  name="registration"
                  onChange={handleChange}
                />
              </InputGroup>
              <br />
              <InputGroup>
                <InputGroupText>Contact No.</InputGroupText>
                <Input
                  placeholder="your contact number"
                  name="contact"
                  onChange={handleChange}
                />
              </InputGroup>
              <br />
              <InputGroup>
                <InputGroupText>Address</InputGroupText>
                <Input
                  placeholder="your address"
                  name="location"
                  onChange={handleChange}
                />
              </InputGroup>
              <br />
              <InputGroup>
                <InputGroupText>Email</InputGroupText>
                <Input
                  placeholder="your email"
                  name="email"
                  onChange={handleChange}
                />
              </InputGroup>
              <br />
              <InputGroup>
                <InputGroupText>License/Certification ID</InputGroupText>
                <Input
                  placeholder="your License/Certification id"
                  name="certification"
                  onChange={handleChange}
                />
              </InputGroup>
              <br />
              <Label>Add Manager Details</Label>
              <InputGroup>
                <InputGroupText>Manager Name</InputGroupText>
                <Input
                  placeholder="Name of the Manager"
                  name="managerName"
                  onChange={handleChange}
                />
              </InputGroup>
              <br />
              <InputGroup>
                <InputGroupText>Manager Contact No.</InputGroupText>
                <Input
                  placeholder="Contact No."
                  name="managerContact"
                  onChange={handleChange}
                />
              </InputGroup>
            </FormGroup>
          )}
          {stakeholder.role === "general-public" && (
            <FormGroup>
              <InputGroup>
                <InputGroupText>Name</InputGroupText>
                <Input
                  placeholder="your name"
                  name="name"
                  onChange={handleChange}
                />
              </InputGroup>
              <br />
              <InputGroup>
                <InputGroupText>Email</InputGroupText>
                <Input
                  placeholder="your email"
                  name="email"
                  onChange={handleChange}
                />
              </InputGroup>
              <br />
              <InputGroup>
                <InputGroupText>Contact No.</InputGroupText>
                <Input
                  placeholder="your contact number"
                  name="contact"
                  onChange={handleChange}
                />
              </InputGroup>
              <br />
              <InputGroup>
                <InputGroupText>Address</InputGroupText>
                <Input
                  placeholder="your address"
                  name="location"
                  onChange={handleChange}
                />
              </InputGroup>
            </FormGroup>
          )}

          <Button onClick={register}>Register</Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
