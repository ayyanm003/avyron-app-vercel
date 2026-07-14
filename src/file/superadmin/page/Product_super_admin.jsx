import { useEffect, useState } from "react";
import "./style/Product_super_admin_style.css";
import axios from "axios";

const Product_super_admin = () => {

    const server = "http://localhost:2000/";
    // http://localhost:2000/product_create
    // http://localhost:2000/product_read
    // http://localhost:2000/category_read
    // http://localhost:2000/product_update_post_status/:id
    // http://localhost:2000/product_update_stock/:id
    // http://localhost:2000/product_update/:id
    // http://localhost:2000/product_delete/:id

    // *************** Add Form Fields ***************
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [stock] = useState("In Stock"); // disabled, backend hardcoded hai

    const [productImage, setProductImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [refresh, setRefresh] = useState(false);

    // *************** Data ***************
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // *************** Delete Modal ***************
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // *************** Edit Modal ***************
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [editImage, setEditImage] = useState(null);
    const [editPreview, setEditPreview] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editMessage, setEditMessage] = useState("");

    // *************** Image Change (Add Form) ***************
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // *************** Create Product ***************
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        // Validation
        if (!category) return setMessage("Category is required.");
        if (!name.trim()) return setMessage("Product name is required.");
        if (!description.trim()) return setMessage("Description is required.");
        if (!price) return setMessage("Price is required.");
        if (!quantity) return setMessage("Quantity is required.");
        if (!productImage) return setMessage("Please select a product image.");

        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("category", category);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("image", productImage);

        try {
            setLoading(true);

            const res = await axios.post(
                `${server}product_create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                setMessage(res.data.message);

                // Reset Form
                setCategory("");
                setName("");
                setDescription("");
                setPrice("");
                setQuantity("");
                setProductImage(null);
                setPreview(null);
                e.target.reset();
                setRefresh((prev) => !prev);
            } else {
                setMessage(res.data.message);
            }

        } catch (err) {
            console.log("ERROR:", err);
            console.log("RESPONSE:", err.response?.data);

            setMessage(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // *************** Read Categories (for dropdown) ***************
    useEffect(() => {
        const readCategories = async () => {
            try {
                const res = await axios.get(`${server}category_read`);
                setCategories(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        readCategories();
    }, []);

    // *************** Read Products ***************
    useEffect(() => {
        const readProducts = async () => {
            try {
                const res = await axios.get(`${server}product_read`);
                setProducts(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        readProducts();
    }, [refresh]);

    // *************** Toggle Post Status ***************
    const handleStatusToggle = async (item) => {
        const newStatus = item.post_status === "Published" ? "paused" : "Published";
        const token = localStorage.getItem("token");

        // UI turant update (optimistic)
        setProducts((prev) =>
            prev.map((p) =>
                p._id === item._id ? { ...p, post_status: newStatus } : p
            )
        );

        try {
            await axios.patch(
                `${server}product_update_post_status/${item._id}`,
                { post_status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.log("STATUS UPDATE ERROR:", err);
            // Fail hone pe wapas purani value pe le aao
            setProducts((prev) =>
                prev.map((p) =>
                    p._id === item._id ? { ...p, post_status: item.post_status } : p
                )
            );
        }
    };

    // *************** Toggle Stock ***************
    const handleStockToggle = async (item) => {
        const newStock = item.stock === "In Stock" ? "Out of Stock" : "In Stock";
        const token = localStorage.getItem("token");

        setProducts((prev) =>
            prev.map((p) =>
                p._id === item._id ? { ...p, stock: newStock } : p
            )
        );

        try {
            await axios.patch(
                `${server}product_update_stock/${item._id}`,
                { stock: newStock },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.log("STOCK UPDATE ERROR:", err);
            setProducts((prev) =>
                prev.map((p) =>
                    p._id === item._id ? { ...p, stock: item.stock } : p
                )
            );
        }
    };

    // *************** Delete Product — Open Modal ***************
    const openDeleteModal = (item) => {
        setDeleteTarget(item);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setDeleteTarget(null);
    };

    // *************** Delete Product — Confirm ***************
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;

        const token = localStorage.getItem("token");

        try {
            setDeleteLoading(true);

            const res = await axios.delete(
                `${server}product_delete/${deleteTarget._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setProducts((prev) =>
                    prev.filter((p) => p._id !== deleteTarget._id)
                );
                closeDeleteModal();
            }

        } catch (err) {
            console.log("DELETE ERROR:", err);
        } finally {
            setDeleteLoading(false);
        }
    };

    // *************** Edit Modal — Open / Close ***************
    const openEditModal = (item) => {
        setEditData({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category?._id || "",
            price: item.price,
            quantity: item.quantity,
        });
        setEditImage(null);
        setEditPreview(item.img);
        setEditMessage("");
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditData(null);
        setEditImage(null);
        setEditPreview(null);
        setEditMessage("");
    };

    const handleEditChange = (field, value) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImage(file);
            setEditPreview(URL.createObjectURL(file));
        }
    };

    // *************** Edit Modal — Save ***************
    const handleEditSave = async (e) => {
        e.preventDefault();
        setEditMessage("");

        if (!editData.category) return setEditMessage("Category is required.");
        if (!editData.name.trim()) return setEditMessage("Product name is required.");
        if (!editData.description.trim()) return setEditMessage("Description is required.");
        if (!editData.price) return setEditMessage("Price is required.");
        if (!editData.quantity) return setEditMessage("Quantity is required.");

        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("category", editData.category);
        formData.append("name", editData.name);
        formData.append("description", editData.description);
        formData.append("price", editData.price);
        formData.append("quantity", editData.quantity);

        // Sirf tab bhejo jab user ne nayi image select ki ho
        if (editImage) {
            formData.append("image", editImage);
        }

        try {
            setEditLoading(true);

            const res = await axios.put(
                `${server}product_update/${editData._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                setRefresh((prev) => !prev);
                closeEditModal();
            } else {
                setEditMessage(res.data.message);
            }

        } catch (err) {
            console.log("EDIT SAVE ERROR:", err);
            setEditMessage(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div className="product-page">

            <div className="product-form-card">

                <h2>Add Product</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select category</option>
                            {categories.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            placeholder="Enter product name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            placeholder="Enter product description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                            <span className="field-note">Admin only — feature coming soon</span>
                        </div>

                        <div className="form-group">
                            <label>Stock</label>
                            <input
                                type="text"
                                value={stock}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Product Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    {preview && (
                        <div className="form-group">
                            <img
                                src={preview}
                                alt="Product preview"
                                className="image-preview"
                            />
                        </div>
                    )}

                    {message && <p className="form-message">{message}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Adding..." : "Add Product"}
                    </button>

                </form>

            </div>

            <div className="product-search-bar">
                <input
                    type="text"
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="product-container">
                {products
                    .filter((item) =>
                        item.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item) => (
                        <div className="product-item" key={item._id}>

                            <div className="product-image">
                                <img
                                    src={item.img}
                                    alt={item.name}
                                />
                            </div>

                            <div className="product-info">
                                <h3 className="product-name" title={item.name}>{item.name}</h3>
                                <p className="product-desc">{item.description}</p>

                                <div className="product-meta">
                                    <span className="meta-tag">
                                        {item.category?.category_name || "—"}
                                    </span>
                                    <span className="meta-price">Rs. {item.price}</span>
                                    <span className="meta-qty">Qty: {item.quantity}</span>

                                    <button
                                        type="button"
                                        className={`status-toggle ${item.post_status === "Published"
                                                ? "status-published"
                                                : "status-paused"
                                            }`}
                                        onClick={() => handleStatusToggle(item)}
                                    >
                                        {item.post_status}
                                    </button>

                                    <button
                                        type="button"
                                        className={`status-toggle ${item.stock === "In Stock"
                                                ? "status-instock"
                                                : "status-outstock"
                                            }`}
                                        onClick={() => handleStockToggle(item)}
                                    >
                                        {item.stock}
                                    </button>
                                </div>

                                <div className="product-submeta">
                                    <span>Posted by: {item.posted_by_role}</span>
                                    <span>
                                        Added on:{" "}
                                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="product-actions">
                                <button
                                    type="button"
                                    className="edit-btn"
                                    onClick={() => openEditModal(item)}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() => openDeleteModal(item)}
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    ))}
            </div>

            {/* *************** Edit Modal *************** */}
            {editModalOpen && editData && (
                <div className="modal-overlay" onClick={closeEditModal}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>

                        <div className="modal-header">
                            <h2>Edit Product</h2>
                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeEditModal}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleEditSave}>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={editData.category}
                                    onChange={(e) => handleEditChange("category", e.target.value)}
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => handleEditChange("name", e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows={4}
                                    value={editData.description}
                                    onChange={(e) => handleEditChange("description", e.target.value)}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        value={editData.price}
                                        onChange={(e) => handleEditChange("price", e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        value={editData.quantity}
                                        onChange={(e) => handleEditChange("quantity", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Product Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                />
                                <span className="field-note">
                                    Leave empty to keep the current image
                                </span>
                            </div>

                            {editPreview && (
                                <div className="form-group">
                                    <img
                                        src={editPreview}
                                        alt="Current"
                                        className="image-preview"
                                    />
                                </div>
                            )}

                            {editMessage && <p className="form-message">{editMessage}</p>}

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="modal-cancel-btn"
                                    onClick={closeEditModal}
                                >
                                    Cancel
                                </button>
                                <button type="submit" disabled={editLoading}>
                                    {editLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

            {/* *************** Delete Confirmation Modal *************** */}
            {deleteModalOpen && deleteTarget && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-box modal-box-small" onClick={(e) => e.stopPropagation()}>

                        <div className="modal-header">
                            <h2>Delete Product</h2>
                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeDeleteModal}
                            >
                                ×
                            </button>
                        </div>

                        <p className="delete-confirm-text">
                            Are you sure you want to delete{" "}
                            <strong>{deleteTarget.name}</strong>? This will
                            permanently remove the product and its image. This
                            action cannot be undone.
                        </p>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="modal-cancel-btn"
                                onClick={closeDeleteModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="modal-delete-confirm-btn"
                                onClick={handleDeleteConfirm}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Product_super_admin;
