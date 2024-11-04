import { useContext, useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Button, Row, Col } from "reactstrap";
import AddRawProduct from "../../../Components/Modals/AddRawProduct";
import RegisterDrum from "../RegisterDrum";
import { AuthContext } from "../../../Services/Contexts/AuthContext";
import { ContractContext } from "../../../Services/Contexts/ContractContext";
import { fetchManufacturer } from "../../../Services/Utils/stakeholder";
import { fetchProduct } from "../../../Services/Utils/product";
import "../../../Assests/Styles/registerDrum.page.css";

const RegisterDrumManufacturer = () => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [manufacturer, setManufacturer] = useState({
    rawProducts: [],
    launchedProducts: [],
  });
  const [isRPModalOpen, setIsRPModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    if (contractState.manufacturerContract) {
      loadManufacturer();
    }
  }, []);

  const loadManufacturer = async () => {
    if (contractState.manufacturerContract) {
      const manufacturerObject = await fetchManufacturer(
        authState.address,
        contractState.manufacturerContract,
        authState.address
      );
      const launchedProducts = [];
      for (let id of manufacturerObject.launchedProductIds) {
        const launchedProduct = await fetchProduct(
          authState.address,
          contractState.productContract,
          id
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

  const toggleRPModal = async () => {
    setIsRPModalOpen(!isRPModalOpen);
    await loadManufacturer();
  };

  const toggleProductModal = async () => {
    setIsProductModalOpen(!isProductModalOpen);
    await loadManufacturer();
  };

  return (
    <div className="main-container">
      <h5 className="heading">Register Drum</h5>
      <hr />
      <div className="sub-container">
        <AddRawProduct
          className="btn__register"
          isModalOpen={isRPModalOpen}
          toggleModalOpen={toggleRPModal}
        />

        <RegisterDrum
          className="btn__register"
          isModalOpen={isProductModalOpen}
          toggleModal={toggleProductModal}
          manufacturerRP={manufacturer.rawProducts}
        />

        <Button
          color="primary"
          className="btn__register"
          onClick={toggleRPModal}
        >
          Add a Drum
        </Button>

        {manufacturer.rawProducts.length === 0 ? (
          <p className="text-center">No drums available. Please add one.</p>
        ) : (
          manufacturer.rawProducts.map((rawProduct, index) => (
            <Card key={index} className="card__drum">
              <CardBody>
                <CardTitle>
                  <span className="card_drum__data">{rawProduct.name}</span>
                  <span>
                    {rawProduct.isVerified ? (
                      <span className="badge bg-danger">Not Verified</span>
                    ) : (
                      <span className="badge bg-success">Verified</span>
                    )}
                  </span>
                </CardTitle>
              </CardBody>
            </Card>
          ))
        )}
        <Button
          className="btn__register"
          color="primary"
          onClick={toggleProductModal}
        >
          Register a Drum <i className="fa me-2" />
        </Button>
      </div>
    </div>
  );
};

export default RegisterDrumManufacturer;
