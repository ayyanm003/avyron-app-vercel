import { useEffect, useState } from "react";
import "./style/Category_super_admin_style.css";
import { Link } from "react-router-dom";
import axios from "axios";
// import Tester from "../models/tester.js";
// import { sendOrderConfirmationEmail } from "../utils/sendEmail.js";

const Category_super_admin = () => {

    const server = "http://localhost:2000/"; // http://localhost:2000/category_create

    const [categoryName, setCategoryName] = useState("");
    const [categoryImage, setCategoryImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [refresh, setRefresh] = useState(false);

    const [read_category_data, setread_category_data] = useState([])
    //     const [read_category_data, setread_category_data] = useState([
    //     {
    //         _id: 1,
    //         category_name: "Men Perfume",
    //         category_image: "/img/header.webp",
    //     },
    //     {
    //         _id: 2,
    //         category_name: "Women Perfume",
    //         category_image: "/img/header.webp",
    //     },
    //     {
    //         _id: 3,
    //         category_name: "Unisex Perfume",
    //         category_image: "/img/header.webp",
    //     },
    //     {
    //         _id: 4,
    //         category_name: "Luxury Perfume",
    //         category_image: "/img/header.webp",
    //     },
    // ]);

    // *************** create Data ***************  
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCategoryImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setMessage("");

    //     if (!categoryName.trim()) {
    //         setMessage("Category name is required.");
    //         return;
    //     }
    //     if (!categoryImage) {
    //         setMessage("Please select a category image.");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append("category_name", categoryName);
    //     formData.append("image", categoryImage);

    //     try {
    //         setLoading(true);
    //         // const res = await fetch(server + "category_create", {
    //         //     method: "POST",
    //         //     body: formData,
    //         // });

    //         // const res = await axios.post(
    //         //     `${server}category_create`,
    //         //     formData
    //         // );

    //         const res = await axios.post(
    //             `${server}category_create`,
    //             formData
    //         );

    //         // const data = await res.json();

    //         if (res.data.success) {
    //             setMessage(res.data.message);
    //         } else {
    //             setMessage(res.data.message);
    //         }

    //         if (res.ok) {
    //             setMessage("Category added successfully.");
    //             setCategoryName("");
    //             setCategoryImage(null);
    //             setPreview(null);
    //             e.target.reset();
    //         } else {
    //             // setMessage(data.message || "Failed to add category.");
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         setMessage("Something went wrong. Please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        // Validation
        if (!categoryName.trim()) {
            return setMessage("Category name is required.");
        }

        if (!categoryImage) {
            return setMessage("Please select a category image.");
        }

        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("category_name", categoryName);
        formData.append("image", categoryImage);

        try {
            setLoading(true);

            const res = await axios.post(
                `${server}category_create`,
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
                setCategoryName("");
                setCategoryImage(null);
                setPreview(null);
                e.target.reset();
                setRefresh(prev => !prev);
            } else {
                setMessage(res.data.message);
            }

        }
        // catch (err) {
        //     console.error(err);

        //     setMessage(
        //         err.response?.data?.message ||
        //         "Something went wrong. Please try again."
        //     );
        // } finally {
        //     setLoading(false);
        // }
        catch (err) {
            console.log("ERROR:", err);
            console.log("RESPONSE:", err.response?.data);

            setMessage(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    // *************** Read Data ***************  
    useEffect(() => {
        const readCategory = async () => {
            try {
                const res = await axios.get(`${server}category_read`);

                setread_category_data(res.data.data);
                console.log(res.data.data)

            } catch (error) {
                console.log(error);
            }
        };
        readCategory()
    }, [refresh]);



    return (
        <div className="category-page">

            {/* <div className="category-card"> */}
            <div className="category-form-card">

                <h2>Add Category</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Category Name</label>
                        {/* <input
                            type="text"
                            placeholder="Enter category name"
                        /> */}
                        <input
                            type="text"
                            placeholder="Enter category name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category Image</label>
                        {/* <input type="file" accept="image/*" /> */}
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
                                alt="Category preview"
                                style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                            />
                        </div>
                    )}

                    {message && <p className="form-message">{message}</p>}

                    {/* <button type="submit">
                        Add Category
                    </button> */}

                    <button type="submit" disabled={loading}
                    // onClick={handleSubmit} 
                    >
                        {loading ? "Adding..." : "Add Category"}
                    </button>

                </form>

            </div>

            <div className="category-container">
                {read_category_data.map((item) => (
                    // <div className="category-item" key={item._id}>

                    //     <div className="category-image">
                    //         <img
                    //             src={item.img}
                    //             alt={item.category_name}
                    //         />
                    //     </div>

                    //     <div className="category-info">
                    //         <h3>{item.category_name}</h3>
                    //     </div>

                    // </div>
                    // `/super-admin/category/${item._id}`
                    <Link to={"/super-admin/category"} className="category-item" key={item._id}>

                        <div className="category-image">
                            <img
                                src={item.img}
                                alt={item.category_name}
                            />
                        </div>

                        <div className="category-info">
                            <h3>{item.category_name}</h3>
                        </div>

                    </Link>
                ))}
            </div>

        </div>
    );
};

export default Category_super_admin;