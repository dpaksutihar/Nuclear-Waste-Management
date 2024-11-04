import { useContext, useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  InputGroupText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

import "../../Assests/Styles/launchProduct.modal.css";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import Toast from "../../Components/Toast";

const RegisterDrum = ({ isModalOpen, toggleModal, manufacturerRP }) => {
  const { authState } = useContext(AuthContext);
  const { contractState, updateStats } = useContext(ContractContext);
  const [product, setProduct] = useState({
    id: "",
    title: "",
    selectedRawProducts: {},
    material: "",
    status: "",
    tempStatus:"",
    longStatus:"",
    radioactivityLevel: "",
    dimensions: "",
    compliance:"",
  });

  const toggleRP = (rawProductIndex) => {
    setProduct((product) => {
      return {
        ...product,
        selectedRawProducts: {
          ...product.selectedRawProducts,
          [rawProductIndex]: !product.selectedRawProducts[rawProductIndex],
        },
      };
    });
  };

  const launch = async () => {
    if (product.id === "" || product.title === "") {
      Toast("error", "Drum id and title required!");
      return;
    }
    const selectedRPIndexes = Object.keys(product.selectedRawProducts).filter(
      (key) => product.selectedRawProducts[key]
    );
    const selectedRP = selectedRPIndexes.map((key) => {
      return {
        name: manufacturerRP[key].name,
        isVerified: manufacturerRP[key].isVerified,
      };
    });
    if (selectedRP.length === 0) {
      Toast("error", "Please select atleast one drum");
      return;
    }
    await contractState.productContract.methods
      .add(
        product.id,
        product.title,
        selectedRP,
        product.material,
        product.status,
        product.tempStatus,
        product.longStatus,
        product.radioactivityLevel,
        product.dimensions,

      )
      .send({ from: authState.address });
    await contractState.manufacturerContract.methods
      .launchProduct(product.id)
      .send({ from: authState.address });
    Toast("success", "Launced Drum!");
    setProduct({
      id: "",
      title: "",
      selectedRawProducts: {},
      material: "",
      status: "",
      tempStatus:"",
      longStatus:"",
      radioactivityLevel: "",
      dimensions: "",
    });
    toggleModal();
    updateStats();
  };

  return (
    <div>
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader>Register Drum</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupText>Drum ID</InputGroupText>
            <Input
              placeholder="serial number"
              value={product.id}
              onChange={(e) =>
                setProduct((product) => ({ ...product, id: e.target.value }))
              }
            />
          </InputGroup>
          <br />
          <InputGroup>
            <InputGroupText>Originator</InputGroupText>
            <Input
              placeholder="originator"
              value={product.title}
              onChange={(e) =>
                setProduct((product) => ({ ...product, title: e.target.value }))
              }
            />
          </InputGroup>
          <br />
          <InputGroup>
            <InputGroupText>Materials</InputGroupText>
            <Input
              placeholder="Materials"
              value={product.material}
              onChange={(e) =>
                setProduct({ ...product, material: e.target.value })
              }
            >
            </Input>
          </InputGroup>
          <br />
          <InputGroup>
            <InputGroupText>Drum Status</InputGroupText>
            <Input
              type="select"
              value={product.status}
              onChange={(e) =>
                setProduct({ ...product, status: e.target.value })
              }
            >
              <option value="">Select Status</option>
              <option value="Enrollment">Enrollment</option>
              <option value="Packaging">Packaging</option>
            </Input>
          </InputGroup>
          <br />
          <InputGroup>
            <InputGroupText>Radioactivity Level</InputGroupText>
            <Input
              type="select"
              value={product.radioactivityLevel}
              onChange={(e) =>
                setProduct({ ...product, radioactivityLevel: e.target.value })
              }
            >
              <option value="">Select Level</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
              <option value="None">None</option>
            </Input>
          </InputGroup>
          <br />
          <InputGroup>
            <InputGroupText>Dimensions (RxH) :</InputGroupText>
            <Input
              placeholder="dimensions"
              value={product.dimensions}
              onChange={(e) =>
                setProduct((product) => ({
                  ...product,
                  dimensions: e.target.value,
                }))
              }
            />
          </InputGroup>
          <br />
          <InputGroup>
            <InputGroupText>Compliance</InputGroupText>
            <Input
              placeholder="Compliance/Regulatory Standards"
              value={product.compliance}
              onChange={(e) =>
                setProduct((product) => ({
                  ...product,
                  compliance: e.target.value,
                }))
              }
            />
          </InputGroup>
          <br />
          <div className="row mt-2 justify-content-around">
            {manufacturerRP &&
              Object.keys(manufacturerRP).map((rawProductIndex) => {
                const rawProduct = manufacturerRP[rawProductIndex];
                return (
                  <div
                    className={`
                  col-5 d-flex justify-content-between 
                  align-items-center my-2 mx-1 raw-product-card 
                  ${
                    product.selectedRawProducts[rawProductIndex]
                      ? "raw-product-card-selected"
                      : ""
                  }
                  `}
                    key={rawProductIndex}
                    onClick={() => toggleRP(rawProductIndex)}
                    type="button"
                  >
                    <span className="raw-product-card-name">
                      {rawProduct.name}
                    </span>
                    {rawProduct.isVerified ? (
                      <span className="badge bg-success">Verified</span>
                    ) : (
                      <span className="badge bg-warning">Not Verified</span>
                    )}
                  </div>
                );
              })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={launch}>Register</Button>{" "}
          <Button
            onClick={() => {
              setProduct({
                id: "",
                title: "",
                selectedRawProducts: {},
                material: "",
                status: "",
                radioactivityLevel: "",
                dimensions: "",
                compliance: "",
              });
              toggleModal();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RegisterDrum;
