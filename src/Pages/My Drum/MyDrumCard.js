import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import "../../Assests/Styles/card.css";
import { fetchFarmer } from "../../Services/Utils/stakeholder";

const MyDrumCard = ({ id, drumObject }) => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);

  const [drum, setDrum] = useState({
    id: "",
    name: "",
    location: "",
    rawProducts: [],
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (drumObject) {
      setDrum(drumObject);
    } else if (contractState.farmerContract) {
      (async () => {
        setDrum(
          await fetchFarmer(authState.address, contractState.farmerContract, id)
        );
      })();
    }
  }, [drumObject]);

  useEffect(() => {
    if (contractState.productContract && drum.id) {
      (async () => {
        try {
          const ownedProducts = await contractState.productContract.methods
            .getProductsByOwner(drum.id)
            .call();

          setProducts(ownedProducts);
        } catch (e) {
          console.error("Error fetching products: ", e.message);
        }
      })();
    }
  }, [contractState.productContract, drum.id]);

  return (
    <div className="drum-card-container">
      <div className="drum-card-header">
        <h4 className="drum-card-title">Drum Information</h4>{" "}
        <span className="drum-card-address">Account Address: {drum.id}</span>
      </div>

      <div className="drum-card-body">
        <h5 className="drum-card-subtitle">
          Total Drums Owned ({drum.role}) : {products.length}
        </h5>

        {products.length > 0 ? (
          <table className="drum-products-table">
            <thead>
              <tr>
                <th>Drum ID</th>
                <th>Drum Title</th>
                <th>Material</th>
                <th>Drum Status</th>
                <th>Drum Last Owner</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>{product.material}</td>
                  <td>In {drum.role}</td>
                  <td>{product.lastOwner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-products-text">No products owned.</p>
        )}
      </div>
    </div>
  );
};

export default MyDrumCard;
