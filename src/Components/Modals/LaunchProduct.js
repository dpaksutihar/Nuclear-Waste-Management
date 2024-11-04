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
import Toast from "../Toast";

const LaunchProduct = ({ isModalOpen, toggleModal, manufacturerRP }) => {
  const { authState } = useContext(AuthContext);
  const { contractState, updateStats } = useContext(ContractContext);
  const [product, setProduct] = useState({
    id: "",
    title: "",
    selectedRawProducts: {},
    material: "",
    status: "",
    radioactivityLevel: "",
    dimensions: "",
    compliance: "",
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
      Toast("error", "Product id and title required!");
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
      Toast("error", "Please select atleast one raw product");
      return;
    }
    await contractState.productContract.methods
      .add(
        product.id,
        product.title,
        selectedRP,
        product.material,
        product.status,
        product.radioactivityLevel,
        product.dimensions,
        product.compliance
      )
      .send({ from: authState.address });
    await contractState.manufacturerContract.methods
      .launchProduct(product.id)
      .send({ from: authState.address });
    Toast("success", "Launced Product!");
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
    updateStats();
  };
  return (
    <div>
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader>Register Drum</ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupText>Serial Number</InputGroupText>
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
            <InputGroupText>Type of Waste</InputGroupText>
            <Input
              placeholder="type of waste"
              value={product.title}
              onChange={(e) =>
                setProduct((product) => ({ ...product, title: e.target.value }))
              }
            />
          </InputGroup>
          <br />
          <div className="row mt-2 justify-content-around">
            <p className="info-drum">Please Select the Below Drum</p>
            {Object.keys(manufacturerRP).map((rawProductIndex) => {
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

export default LaunchProduct;
