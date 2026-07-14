// import React from 'react'
// import Navbar from '../component/Navbar'
// import { Outlet } from 'react-router-dom'

// const Web_layout = () => {
//     return (
//         <>
//             <Navbar />
//             <main>
//                 <Outlet />
//             </main>
//             {/* <Footer /> */}
//         </>
//     )
// }

// export default Web_layout

import React, { useEffect } from 'react'
import Navbar from '../component/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../component/Footer';

const Web_layout = () => {

    // Defensive fix — kahin bhi (kisi bhi component se) agar
    // body/html/root pe overflow hidden reh gaya ho, ye reset kar dega
    useEffect(() => {
        document.documentElement.style.overflow = "auto";
        document.body.style.overflow = "auto";

        const root = document.getElementById("root");
        if (root) {
            root.style.overflow = "auto";
        }
    }, []);

    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default Web_layout
