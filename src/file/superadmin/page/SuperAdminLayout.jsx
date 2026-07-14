import { Outlet } from "react-router-dom";
import "./style/SuperAdminLayout_stlye.css"
import Navbar from "../component/Navbar_super_admin";
import Sidebar from "../component/Sidebar_super_admin";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const SuperAdminLayout = () => {

    // const token = localStorage.getItem("token");

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/only_admin");
            return;
        }

        try {
            const decoded = jwtDecode(token);

            if (decoded.role !== "super_admin") {
                localStorage.removeItem("token");
                navigate("/only_admin");
            }

        } catch (error) {
            localStorage.removeItem("token");
            navigate("/only_admin");
        }
    }, [navigate]);
    return (
        <div className="app">
            <Navbar />

            <div className="main">
                <Sidebar />

                <div className="content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SuperAdminLayout;