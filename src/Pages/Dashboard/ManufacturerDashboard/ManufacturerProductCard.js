import { useContext, useState, useEffect } from "react";
import { Card, CardBody, Row } from "reactstrap";
import { AuthContext } from "../../../Services/Contexts/AuthContext";
import { ContractContext } from "../../../Services/Contexts/ContractContext";
import { fetchManufacturer } from "../../../Services/Utils/stakeholder";
import "../../../Assests/Styles/card.css";
import { Link } from "react-router-dom";
import { fetchProduct } from "../../../Services/Utils/product";

const ManufacturerProductCard = ({ id, drumObject }) => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);

  const [manufacturer, setManufacturer] = useState({
    rawProducts: [],
    launchedProducts: [],
  });

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
              return {
                ...product,
                manufacturer: manufacturerDetails,
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

  let statusCount = {
    longStatus: 0,
    tempStatus: 0,
    manufacturerName: 0,
  };

  const stats = [
    {
      icon: "",
      label: "Total Drums Registered by me ",
      count: manufacturer.launchedProducts.length,
    },
    {
      icon: "",
      label: "Drum Transactions",
      count: contractState.stats.transactionsCount,
    },
    {
      icon: "",
      label: "Active Alerts",
      count: contractState.stats.reviewsCount,
    },
  ];

  console.log("man dash pro", manufacturer);

  return (
    <div className="bottom-wrapper">
      <div>
        {manufacturer.launchedProducts.length > 0 &&
          manufacturer.launchedProducts.map((product) => {
            let statusDisplay =
              product.item.longStatus ||
              product.item.tempStatus ||
              product.manufacturer["name"];
            if (product.item.longStatus) statusCount.longStatus += 1;
            else if (product.item.tempStatus) statusCount.tempStatus += 1;
            else statusCount.manufacturerName += 1;
          })}
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
        <Row className="">
          <Card className="">
            <CardBody>
              <div>
                <p>
                  No. of Drums Owned by Manufacturer :{" "}
                  {statusCount.manufacturerName || "N/A"}
                </p>
                <p>
                  Drum in Temporary Storage Facility :{" "}
                  {statusCount.tempStatus || "N/A"}
                </p>
                <p>
                  Drum in Long-Term Storage Facility :{" "}
                  {statusCount.longStatus || "N/A"}
                </p>
              </div>
            </CardBody>
          </Card>
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
          {manufacturer.launchedProducts.length > 0 ? (
            manufacturer.launchedProducts.map((product) => {
              return (
                <tr key={product.item.id}>
                  <td>{product.item.id || "N/A"}</td>
                  <td>{product.item.title || "N/A"}</td>
                  <td>
                    {product.item?.longStatus ||
                      product.item?.tempStatus ||
                      product.manufacturer["name"]}
                  </td>
                  <td>{product.item.material || "N/A"}</td>
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
                          <div key={product.transactions[latestIndex].id}>
                            <span>
                              <span>In </span>
                              {latestIndex === 0 ? (
                                <span>
                                  {product.item?.tempStatus ||
                                    Productstatus ||
                                    product.tempStatus}
                                </span>
                              ) : latestIndex === 1 ? (
                                <span>
                                  {product.item?.longStatus ||
                                    Productstatus ||
                                    product.item?.status}
                                </span>
                              ) : (
                                <span>
                                  {Productstatus || product.item?.status || "N/A"}
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })()
                    ) : (
                      <div>
                        <span>{product.item?.status || "N/A"}</span>
                      </div>
                    )}
                  </td>
                  <td>{product.item.radioactivityLevel || "N/A"}</td>
                  <td>
                    {drum.isVerified ? (
                      <span className="badge bg-success">Verified</span>
                    ) : (
                      <span className="badge bg-warning">Not Verified</span>
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/products/${product.item?.id}`}
                      state={{ product: product.item }}
                    >
                      [Manage]
                    </Link>
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

export default ManufacturerProductCard;
