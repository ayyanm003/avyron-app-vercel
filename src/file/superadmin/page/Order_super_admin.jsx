import { useState, useEffect } from "react";
import axios from "axios";
import "./style/Order_super_admin_style.css";

const server = "http://localhost:2000/";

const STATUS_OPTIONS = ["Pending", "Confirmed", "Delivered"];

const Order_super_admin = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // *************** Read Orders ***************
  useEffect(() => {
    const readOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${server}order_read`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    readOrders();
  }, []);

  // *************** Update Status ***************
  const handleStatusChange = async (order, newStatus) => {
    const token = localStorage.getItem("token");

    // UI turant update (optimistic)
    setOrders((prev) =>
      prev.map((o) =>
        o._id === order._id ? { ...o, order_status: newStatus } : o
      )
    );

    try {
      await axios.patch(
        `${server}order_update_status/${order._id}`,
        { order_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.log(error);
      // Fail hone pe wapas purani value pe le aao
      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, order_status: order.order_status } : o
        )
      );
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="order-page">

      <div className="order-header">
        <h2>Orders</h2>
        <input
          type="text"
          placeholder="Search by client name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="order-search"
        />
      </div>

      {loading && <p className="order-empty">Loading orders...</p>}

      {!loading && filteredOrders.length === 0 && (
        <p className="order-empty">No orders found.</p>
      )}

      <div className="order-list">
        {filteredOrders.map((order) => (
          <div className="order-card" key={order._id}>

            <div className="order-card__top">
              <div className="order-card__client">
                <h3>{order.client_name}</h3>
                <span className="order-card__date">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <select
                className={`order-status-select order-status-select--${order.order_status.toLowerCase()}`}
                value={order.order_status}
                onChange={(e) => handleStatusChange(order, e.target.value)}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="order-card__contact">
              <span>📧 {order.client_email}</span>
              <span>📱 {order.client_phone}</span>
              <span>💬 {order.client_whatsapp}</span>
              <span>📍 {order.client_address}, {order.client_city}</span>
            </div>

            {order.client_notes && (
              <p className="order-card__notes">Note: {order.client_notes}</p>
            )}

            <div className="order-card__products">
              {order.products.map((item, index) => (
                <div className="order-product-row" key={index}>
                  <img
                    src={item.product_img}
                    alt={item.product_name}
                    className="order-product-img"
                  />
                  <div className="order-product-info">
                    <span className="order-product-name">{item.product_name}</span>
                    <span className="order-product-meta">
                      {item.product_category} · {item.product_type}
                    </span>
                  </div>
                  <span className="order-product-price">Rs. {item.product_price}</span>
                </div>
              ))}
            </div>

            <div className="order-card__totals">
              <div className="order-total-row">
                <span>Subtotal</span>
                <span>Rs. {order.subtotal}</span>
              </div>
              <div className="order-total-row">
                <span>Delivery</span>
                <span>Rs. {order.delivery_charges}</span>
              </div>
              <div className="order-total-row order-total-row--grand">
                <span>Total</span>
                <span>Rs. {order.total_amount}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Order_super_admin;
