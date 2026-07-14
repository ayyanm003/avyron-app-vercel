import { useState } from "react";
import "./signin_style.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const Signin = () => {

    const server = "http://localhost:2000/"

    const navigate = useNavigate()

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    const handel = async (e) => {
        e.preventDefault();
        // const signinAdmin = async () => {
        // e.preventDefault();

        try {
            const data = { email, password };

            const res = await axios.post(
                `${server}user_signin`, // 🔥 YOUR API URL
                data
            );

            // Save token (optional)
            localStorage.setItem("token", res.data.token);

            const decoded = jwtDecode(res.data.token);

            console.log(decoded);

            if (decoded.role === "super_admin") {
                navigate("/super-admin");
            // } else if (decoded.role === "admin") {
            //     navigate("/admin");
            } else {
                navigate("/only_admin");
            }

            // alert("Signin successful");
            // console.log("User:", res.data.user);
            // navigate("/admin")
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Signin failed");
        }
    }

    return (
        <div className="signin">

            <div className="signin-card">

                <h2>Sign In</h2>
                <p>Welcome back! Please login to continue.</p>

                <form>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email" value={email} onChange={(e) => { setemail(e.target.value) }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password" value={password} onChange={(e) => { setpassword(e.target.value) }}
                        />
                    </div>

                    <button type="submit" onClick={handel}>
                        Sign In
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Signin;