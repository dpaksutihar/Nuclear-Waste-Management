import { useContext, useState } from "react";
import "../../Assests/Styles/product.page.css";
import { useLocation } from "react-router-dom";
import {
  fetchManufacturer,
  formattedAddress,
} from "../../Services/Utils/stakeholder";
import { ContractContext } from "../../Services/Contexts/ContractContext";
import { AuthContext } from "../../Services/Contexts/AuthContext";
import Toast from "../../Components/Toast";
import MQTT from "../MQTT Sensor/MQTT_Sensor_Script";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Product = () => {
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const { contractState, updateStats } = useContext(ContractContext);
  const [product, setProduct] = useState(location.state.product);

  const [transferState, setTransferState] = useState({
    from: authState.address,
  });

  const [isOwner, setIsOwner] = useState(() => {
    const currentOwner =
      location.state?.product?.item?.currentOwner ||
      location.state?.product?.currentOwner;
    const userAddress = authState?.address;

    return (
      currentOwner &&
      userAddress &&
      userAddress.toLowerCase() === currentOwner.toLowerCase()
    );
  });

  const reload = async () => {
    const id = location.state.product.item.id;
    const response = await contractState.productContract.methods
      .get(id)
      .call({ from: authState.address });

    const updatedProduct = {
      "item": response.item,
      "rawProducts": response.rawProducts,
      "transactions": response.transactions,
      "manufacturer": await fetchManufacturer(
        authState.address,
        contractState.manufacturerContract,
        response.item["manufacturer"]
      ),
    };

    setProduct(updatedProduct);
  };

  const transfer = async () => {
    try {
      await contractState.productContract.methods
        .transfer(transferState.to, (product.item?.id || product.id))
        .send({ from: authState.address });

      await reload();
      Toast("success", "Product transferred successfully");
      setProduct((prevProduct) => ({
        ...prevProduct,
        item: {
          ...prevProduct.item,
          currentOwner: transferState.to.toLowerCase(),
        },
      }));
      setIsOwner(
        transferState.to.toLowerCase() === authState.address.toLowerCase()
      );
      setTransferState({ from: authState.address });
      updateStats();
    } catch (error) {
      Toast("error", "Product transfer failed");
      console.error("Transfer error:", error);
    }
  };


  const receiveProductTemp = async (newStatus) => {
    try {
      await contractState.productContract.methods
        .updateStatusTemporary((product.item?.id || product?.id), newStatus)
        .send({ from: authState.address });

      setProduct((prevProduct) => ({
        ...prevProduct,
        item: {
          ...prevProduct.item,
          tempStatus:
            newStatus === "Temporary Storage Facility"
              ? "Temporary Status Received"
              : "Long-term Status Received", // Update as per your logic
        },
      }));

      Toast("success", "Product received successfully");
      await reload();
    } catch (error) {
      Toast("error", "Failed to receive product");
      console.error("Receive error:", error);
    }
  };

  const receiveProductLong = async (newStatus) => {
    try {
      await contractState.productContract.methods
        .updateStatusLongterm((product.item?.id || product?.id), newStatus)
        .send({ from: authState.address });

      setProduct((prevProduct) => ({
        ...prevProduct,
        item: {
          ...prevProduct.item,
          longStatus:
            newStatus === "Long-term Storage Facility"
              ? "Long-term Status Received"
              : "Destroyed Status Received", // Update as per your logic
        },
      }));

      Toast("success", "Product received successfully");
      await reload();
    } catch (error) {
      Toast("error", "Failed to receive product");
      console.error("Receive error:", error);
    }
  };

  const handleExport = () => {
    const input = document.getElementById("pdf-content");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("Drum-report.pdf");
    });
  };

  console.log("product transaction ", Object.values(product));
  // console.log("pro transaction length", product.transactions.length);

  return (
    <div>
      <div id="pdf-content" style={{ padding: "20px" }}>
        <div className="wrapper">
          <div className="row top-wrapper">
            <div className="col-12 col-md-8 tw-right">
              <b>Drum ID: </b>
              <span className="tw-heading1">
                {product.item?.id || product.id}
              </span>
              <br />
              <b>Date of Creation: </b>
              {new Date(
                (product.item?.launchDate || product.launchDate) * 1000
              ).toDateString()}
              <br />
              {Array.isArray(product.transactions) ? (
                (() => {
                  const latestIndex = product.transactions.length - 1;
                  let Productstatus;

                  if (latestIndex === 0) {
                    Productstatus = "In Transit 1";
                  } else if (latestIndex === 1) {
                    Productstatus = "In Transit 2";
                  } else if (latestIndex === 2) {
                    Productstatus = "Drum Destroyed";
                  }

                  return (
                    <div key={product.transactions.id}>
                      <b>Status: </b>
                      <span>
                        {latestIndex === 0 ? (
                          <span>
                            {product.item?.tempStatus ||
                              product?.tempStatus ||
                              Productstatus ||
                              product.item.status}
                          </span>
                        ) : latestIndex === 1 ? (
                          <span>
                            {product.item?.longStatus ||
                              product?.longStatus ||
                              Productstatus ||
                              product.item.status}
                          </span>
                        ) : (
                          <span>
                            {Productstatus ||
                              product?.status ||
                              product.item?.status}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })()
              ): (
                <div>
                  <b>Status: </b>
                  <span>{product.item?.status || product.status || "N/A"}</span>
                </div>
              )}
              <b>Material: </b>
              <span>{product.item?.material || product.material}</span>
              <br />
              <b>Originator: </b>
              <span className="tw-heading1">
                {product.item?.title || product.title}
              </span>
              <br />
              <b>Radioactivity Level: </b>
              <span>
                {product.item?.radioactivityLevel || product.radioactivityLevel}
              </span>
              <br />
              <b>Dimensions (Radius, Height): </b>
              <span>{product.item?.dimensions || product.dimensions}</span>
              <br />
              {/* <b>Compliance/Regulatory Standards: </b>
              <span>{product.item?.compliance || product.compliance}</span>
              <br /> */}
              <div className="tw-transfer-wrapper">
                <input
                  type="text"
                  placeholder="Address"
                  disabled={!isOwner}
                  onChange={(e) =>
                    setTransferState({
                      ...transferState,
                      to: e.target.value,
                    })
                  }
                />
                &nbsp; &nbsp;
                <button disabled={!isOwner} onClick={transfer}>
                  Transfer
                </button>
                <button className="tw-transfer-wrapper" onClick={handleExport}>
                  Export to PDF
                </button>
              </div>
            </div>
          </div>
          <hr />
          <div className="bottom-wrapper">
            <div className="row">
              <div className="col-12 col-md-6">
                <span className="heading">Transactions</span>
                <div className="my-1 border">
                  <b>Manufacturer </b>
                  {product.transactions && product.transactions.length > 0
                    ? formattedAddress(product.transactions[0].from)
                    : "No transactions available"}
                  <br />
                  <div>
                    <b>Initial Status: </b>
                    <span style={{ textTransform: "uppercase" }}>
                      {product.item?.status || product.status}
                    </span>
                  </div>
                </div>
                {Array.isArray(product.transactions) &&
                  product.transactions.map((transaction, index) => {
                    let Productstatus;

                    if (index === 0) {
                      Productstatus = "In Transit 1";
                    } else if (index === 1) {
                      Productstatus = "In Transit 2";
                    } else if (index === 2) {
                      Productstatus = "Drum Destroyed";
                    }

                    return (
                      <div className="my-1 border" key={transaction.id}>
                        <b>Transfer From </b>
                        {formattedAddress(transaction.from)}
                        <br />
                        <b>Transfer To </b>
                        {formattedAddress(transaction.to)}
                        <br />
                        <b>Date of Transfer </b>
                        {new Date(transaction.date * 1000).toDateString()}
                        <br />
                        <b>Current Status: </b>
                        <span>
                          {index === 0 ? (
                            <span>
                              {product.item?.tempStatus || product?.tempStatus || Productstatus}
                            </span>
                          ) : index === 1 ? (
                            <span>
                              {product.item?.longStatus || product?.longStatus || Productstatus}
                            </span>
                          ) : (
                            <span>{Productstatus}</span>
                          )}
                        </span>
                        {isOwner &&
                        index === 0 &&
                        (product?.tempStatus || product.item?.tempStatus) !==
                          "Temporary Storage Facility" ? (
                          <button
                            onClick={() =>
                              receiveProductTemp("Temporary Storage Facility")
                            }
                          >
                            Receive Drum
                          </button>
                        ) : isOwner &&
                          index === 1 &&
                          (product?.longStatus || product.item?.longStatus) !==
                            "Long-term Storage Facility" ? (
                          <button
                            onClick={() =>
                              receiveProductLong("Long-term Storage Facility")
                            }
                          >
                            Receive Drum
                          </button>
                        ) : null}
                      </div>
                    );
                  })}
              </div>
              <div>
                <MQTT />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
