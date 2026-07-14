import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SuperAdminLayout from "./file/superadmin/page/SuperAdminLayout";
import HomeSuperAdmin from "./file/superadmin/page/Home_super_admin";
import CategorySuperAdmin from "./file/superadmin/page/Category_super_admin";
import ProductSuperAdmin from "./file/superadmin/page/Product_super_admin";
import OrderSuperAdmin from "./file/superadmin/page/Order_super_admin";
import TesterSuperAdmin from "./file/superadmin/page/Tester_super_admin";

import Signin from "./file/auth/Signin";

import WebLayout from "./file/web/page/Web_layout";
import Home from "./file/web/page/Home";
import CategoryProduct from "./file/web/component/Category_product";
import CartPage from "./file/web/page/Cart_page";
import ProductPage from "./file/web/page/Product_page";
import ProductDetails from "./file/web/page/Product_detials";
import TesterDetails from "./file/web/page/Tester_detials";

function App() {
  return (
    <Router>
      <Routes>

        {/* Super Admin */}
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route index element={<HomeSuperAdmin />} />
          <Route path="/super-admin/category" element={<CategorySuperAdmin />} />
          <Route path="/super-admin/products" element={<ProductSuperAdmin />} />
          <Route path="/super-admin/tester" element={<TesterSuperAdmin />} />
          <Route path="/super-admin/orders" element={<OrderSuperAdmin />} />
        </Route>

        {/* Admin Login */}
        <Route path="/only_admin" element={<Signin />} />

        {/* Website */}
        <Route path="/" element={<WebLayout />}>
          <Route index element={<Home />} />
          <Route
            path="/category_product/:category_name"
            element={<CategoryProduct />}
          />
          <Route path="/product_page" element={<ProductPage />} />
          <Route path="/Cart_Page" element={<CartPage />} />
          <Route
            path="/product_detials/:id"
            element={<ProductDetails />}
          />
          <Route path="/tester/:id" element={<TesterDetails />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;