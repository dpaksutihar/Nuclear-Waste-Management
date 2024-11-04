import { useContext, useEffect, useState } from "react";
import { Button, Input, InputGroup, Card, CardBody, Row } from "reactstrap";
import "../../Assests/Styles/products.page.css";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import { fetchManufacturer } from "../../Services/Utils/stakeholder";
import fake_product from "../../Assests/Images/fake_product.jpg";
import Toast from "../../Components/Toast";
import ProductTable from "./ProductTable";

const Products = () => {
  const { authState } = useContext(AuthContext);
  const { contractState } = useContext(ContractContext);
  const [productIds, setProductids] = useState([]);
  const [products, setProducts] = useState({});

  useEffect(() => {
    if (contractState.productContract) {
      (async () => {
        const productIds = await contractState.productContract.methods
          .getItemIds()
          .call({ from: authState.address });
        setProductids(productIds);
      })();
    }
  }, []);

  const stats = [
    {
      icon: "",
      label: "Total Drums Registered on Blockchain",
      count: contractState.stats.productsCount,
    },
    {
      icon: "",
      label: "Total Transactions Performed on Blockchain",
      count: contractState.stats.transactionsCount,
    },
  ];

  useEffect(() => {
    if (contractState.productContract) {
      (async () => {
        const products = {};
        for (let i = 0; i < productIds.length; i++) {
          const response = await contractState.productContract.methods
            .get(productIds[i])
            .call({ from: authState.address });
            
          const product = {
            "item": response.item,
            "rawProducts": response.rawProducts,
            "transactions": response.transactions,
            "manufacturer": await fetchManufacturer(
              authState.address, 
              contractState.manufacturerContract, 
              response.item["manufacturer"]),
          };
          if (
            product.item.manufacturer !==
            "0x0000000000000000000000000000000000000000"
          ) {
            products[productIds[i]] = product;
          }
        }

        setProducts(products);
      })();
    }
  }, [productIds]);

  return (
    <div className="wrapper">
      <div>
        <h5 className="bw-heading">Drum Statistics</h5>
        <Row >
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardBody>
                <div align="center">
                  {stat.label} : {stat.count}
                </div>
              </CardBody>
            </Card>
          ))}
        </Row>
      </div>
      <div className="heading">All Drums</div>
      <div align="center">
        <div className="col-10 col-md-3">
          <InputGroup>
            <Input placeholder="Search" id="search" />
            <Button
              onClick={() => {
                const productId = document.getElementById("search").value;
                if (productId === "") {
                  Toast("error", "Please enter a product id");
                  return;
                }
                setProductids([productId]);
              }}
            >
              Search
            </Button>
          </InputGroup>
        </div>
      </div>
      <br />
      <div className="row">
        <ProductTable products={products} />
        {productIds.length > 0 && Object.keys(products).length === 0 ? (
          <div align="center">
            <div className="col-10 col-md-6">
              <img src={fake_product} alt="not-found" width="100%" />
              <span>No products found</span>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default Products;
