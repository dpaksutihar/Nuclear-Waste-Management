import { NavLink } from "react-router-dom";

const ProductTable = ({ products }) => {
  return (
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
        {Object.keys(products).map((productId) => {
          const product = products[productId];
          return (
            <tr key={productId}>
              <td>{product.item["id"]}</td>
              <td>{product.item["title"]}</td>
              <td>
                {product.item?.longStatus ||
                  product.item?.tempStatus ||
                  product.manufacturer["name"]}
              </td>
              <td>{product.item["material"]}</td>
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
                          {latestIndex === 2 ? null : <span>In </span>}
                          {latestIndex === 0 ? (
                            <span>
                              {product.item?.tempStatus ||
                                Productstatus ||
                                product.status}
                            </span>
                          ) : latestIndex === 1 ? (
                            <span>
                              {product.item?.longStatus ||
                                Productstatus ||
                                product.item.status}
                            </span>
                          ) : (
                            <span>{Productstatus || product.item.status}</span>
                          )}
                        </span>
                      </div>
                    );
                  })()
                ) : (
                  <div>
                    <span>{product.item.status}</span>
                  </div>
                )}
              </td>
              <td>{product.item["radioactivityLevel"]}</td>
              <td>
                {product.manufacturer.isVerified ? (
                  <span className="badge bg-success">Verified</span>
                ) : (
                  <span className="badge bg-warning">Not Verified</span>
                )}
              </td>
              <td>
                <NavLink
                  className="nav-link"
                  to={`/products/${productId}`}
                  state={{ product }}
                >
                  [Manage]
                </NavLink>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProductTable;
