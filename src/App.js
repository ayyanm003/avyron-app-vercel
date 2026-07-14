import './App.css';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Outlet } from "react-router-dom";
import SuperAdminLayout from './file/superadmin/page/SuperAdminLayout';
import Home_super_admin from './file/superadmin/page/Home_super_admin';
import Category_super_admin from './file/superadmin/page/Category_super_admin';
import Signin from './file/auth/Signin';
import Product_super_admin from './file/superadmin/page/Product_super_admin';
import Order_super_admin from './file/superadmin/page/Order_super_admin';
import Tester_super_admin from './file/superadmin/page/Tester_super_admin';
import Web_layout from './file/web/page/Web_layout';
import Home from './file/web/page/Home';
import Category_product from './file/web/component/Category_product';
import Cart_Page from './file/web/page/Cart_page';
import Product_page from './file/web/page/Product_page';
import Product_details from './file/web/page/Product_detials';
import Tester_details from './file/web/page/Tester_detials';

function App() {
  return (
    <>

      <Router>
        <Routes>

          {/* **************** Super Admin **************** */}
          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route index element={<Home_super_admin />} />
            <Route path="/super-admin/category" element={<Category_super_admin />} />
            <Route path="/super-admin/products" element={<Product_super_admin />} />
            <Route path="/super-admin/tester" element={<Tester_super_admin />} />
            <Route path="/super-admin/orders" element={<Order_super_admin />} />
          </Route>

          {/* **************** Admin Login **************** */}
          <Route path="/only_admin" element={<Signin />} />

          {/* **************** Super Admin **************** */}
          <Route path="/" element={<Web_layout />}>
            <Route index element={<Home />} />
            {/* <Route path="/category_product/:category_name" element={<Category_product />} /> */}
            <Route path="/category_product/:category_name" element={<Category_product />} />
            <Route path='/product_page' element={<Product_page />} />
            <Route path="/Cart_Page" element={<Cart_Page />} />
            
            <Route path="/product_detials/:id" element={<Product_details />} />
            <Route path="/tester/:id" element={<Tester_details />} />

          </Route>

        </Routes>
      </Router>

    </>
  );
}

export default App;


// jan mai first time cpanel mai hosting kr raha ho ab is hisab se react karana host