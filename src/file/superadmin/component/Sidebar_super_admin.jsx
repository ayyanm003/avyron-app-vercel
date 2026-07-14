import "./style/Sidebar_super_admin_style.css";
import {
    FaTachometerAlt,
    FaUsers,
    FaBoxOpen,
    FaClipboardList,
    FaCog,
    FaShoppingCart,
    FaVial,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
// import { FaShoppingCart, FaClipboardList } from "react-icons/fa";

const Sidebar_super_admin = () => {
    return (
        <aside className="sidebar">
            <ul>

                {/* <li className="active">
                    <FaTachometerAlt />
                    <span>Dashboard</span>
                </li>

                <li>
                    <FaUsers />
                    <span>Users</span>
                </li>

                <li>
                    <FaBoxOpen />
                    <span>Products</span>
                </li>

                <li>
                    <FaClipboardList />
                    <span>Orders</span>
                </li>

                <li>
                    <FaCog />
                    <span>Settings</span>
                </li> */}

                {/* <li>
                    <NavLink to="/super-admin">
                        <FaTachometerAlt />
                        <span>Dashboard</span>
                    </NavLink>
                </li> */}

                <li>
                    <NavLink to="/super-admin/orders">
                        <FaShoppingCart />
                        <span>Orders</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/super-admin/products">
                        <FaClipboardList />
                        <span>Products</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/super-admin/tester">
                        <FaVial />
                        <span>Tester</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/super-admin/category">
                        <FaBoxOpen />
                        <span>Category</span>
                    </NavLink>
                </li>

                {/* <li>
                    <NavLink to="/super-admin/users">
                        <FaUsers />
                        <span>Users</span>
                    </NavLink>
                </li> */}

                {/* <li>
                    <NavLink to="/super-admin/settings">
                        <FaCog />
                        <span>Settings</span>
                    </NavLink>
                </li> */}

            </ul>
        </aside>
    );
};

export default Sidebar_super_admin;