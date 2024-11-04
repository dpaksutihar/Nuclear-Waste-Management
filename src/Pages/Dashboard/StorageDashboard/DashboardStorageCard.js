import { useContext, useState, useEffect } from "react";
import { Card, CardBody, Row } from "reactstrap";
import { AuthContext } from "../../../Services/Contexts/AuthContext";
import { ContractContext } from "../../../Services/Contexts/ContractContext";
import { fetchManufacturer } from "../../../Services/Utils/stakeholder";
import "../../../Assests/Styles/card.css";
import { NavLink } from "react-router-dom";
import { fetchStakeholder } from "../../../Services/Utils/stakeholder";

const DashboardStorageCard = ({ id, drumObject }) => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const role = authState.stakeholder.role;
  const [stakeholder, setStakeholder] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    (async () => {
      setStakeholder(
        await fetchStakeholder(
          authState.address,
          contractState.stakeholderContract,
          id
        )
      );
    })();
  }, []);

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
    } else if (contractState.manufacturerContract) {
      (async () => {
        try {
          const fetchedDrum = await fetchManufacturer(
            authState.address,
            contractState.manufacturerContract,
            id
          );
          setDrum(fetchedDrum);
        } catch (error) {
          console.error("Error fetching drum:", error.message);
        }
      })();
    }
  }, [drumObject, contractState.manufacturerContract, id, authState.address]);

  useEffect(() => {
    if (contractState.productContract && drum.id) {
      (async () => {
        try {
          const ownedProducts = await contractState.productContract.methods
            .getProductsByOwner(drum.id)
            .call();

          const fullProductDetails = await Promise.all(
            ownedProducts.map(async (product) => {
              const manufacturerDetails = await fetchManufacturer(
                authState.address,
                contractState.manufacturerContract,
                product.manufacturer
              );

              const transactions = await contractState.productContract.methods
                .getTransactionsByProductId(product.id)
                .call();

              return {
                ...product,
                manufacturer: manufacturerDetails,
                transactions: transactions,
              };
            })
          );

          setProducts(fullProductDetails);
        } catch (e) {
          console.error("Error fetching products: ", e.message);
        }
      })();
    }
  }, [contractState.productContract, drum.id]);

  const stats = [
    {
      icon: "",
      label: `Drums in ${role}`,
      count: products.length,
    },
    {
      icon: "",
      label: "Active Alerts",
      count: contractState.stats.reviewsCount,
    },
  ];

  return (
    <div className="bottom-wrapper">
      <div>
        <h5 className="bw-heading">Drum Statistics</h5>
        <Row className="">
          {stats.map((stat, index) => (
            <Card className="" key={index}>
              <CardBody>
                <div>
                  {stat.label} : {stat.count}
                </div>
              </CardBody>
            </Card>
          ))}
        </Row>
      </div>
      <br />
      <h5 className="bw-heading">My Drums</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Drum ID</th>
            <th>Originator</th>
            <th>Owner</th>
            <th>Material</th>
            <th>Drum Status</th>
            <th>Radioactivity</th>
            <th>Verification Status</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => {
              return (
                <tr key={product.id}>
                  <td>{product.id || "N/A"}</td>
                  <td>{product.title || "N/A"}</td>
                  <td>
                    {stakeholder.name || product.manufacturer.name || "N/A"}
                  </td>
                  <td>{product.material || "N/A"}</td>
                  <td>
                    {Array.isArray(product.transactions) &&
                    product.transactions.length > 0 ? (
                      (() => {
                        const latestIndex = product.transactions.length - 1;
                        let Productstatus;

                        if (latestIndex === 0) {
                          Productstatus = "Transit 1";
                        } else if (latestIndex === 1) {
                          Productstatus = "Transit 2";
                        } else if (latestIndex === 2) {
                          Productstatus = "Drum Destroyed";
                        }

                        return (
                          <div>
                            <span>
                              <span>In </span>
                              {latestIndex === 0 ? (
                                <span>
                                  {product.tempStatus ||
                                    Productstatus ||
                                    product.status}
                                </span>
                              ) : latestIndex === 1 ? (
                                <span>
                                  {product.longStatus ||
                                    Productstatus ||
                                    product.status}
                                </span>
                              ) : (
                                <span>{Productstatus || product.status}</span>
                              )}
                            </span>
                          </div>
                        );
                      })()
                    ) : (
                      <div>
                        <span>{product.status}</span>
                      </div>
                    )}
                  </td>
                  <td>{product.radioactivityLevel || "N/A"}</td>
                  <td>
                    {drum.isVerified ? (
                      <span className="badge bg-warning">Not Verified</span>
                    ) : (
                      <span className="badge bg-success">Verified</span>
                    )}
                  </td>
                  <td>
                    <NavLink
                      className="nav-link"
                      to={`products/${product.id}`}
                      state={{ product }}
                    >
                      [Manage]
                    </NavLink>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardStorageCard;
