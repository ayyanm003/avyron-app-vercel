// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./style/Category_style.css";

// const server = "http://localhost:2000/";

// const Category = () => {
//   // ---------------- STATE ----------------
//   const [categories, setCategories] = useState([]); // backend se categories

//   // ---------------- FETCH CATEGORIES FROM BACKEND ----------------
//   useEffect(() => {
//     const readCategory = async () => {
//       try {
//         const res = await axios.get(`${server}category_read`);
//         setCategories(res.data.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     readCategory();
//   }, []);

//   // ---------------- JSX ----------------
//   return (
//     // <section className="cat-section">
//     //   <h2 className="cat-heading">Shop by Collection</h2>

//     //   <div className="cat-grid">
//     //     {categories.map((cat) => (
//     //       <a
//     //         key={cat._id}
//     //         href={`/collection/${cat.category_name.toLowerCase()}`}
//     //         className="cat-card"
//     //       >
//     //         {/* category ki image bhi backend se aa sakti hai, filhal placeholder */}
//     //         <div className="cat-card-img-wrap">
//     //           <img
//     //             src={cat.category_image || "/accets/img/gallery.png"}
//     //             alt={cat.category_name}
//     //             className="cat-card-img"
//     //           />
//     //           <div className="cat-card-overlay"></div>
//     //         </div>
//     //         <span className="cat-card-name">{cat.category_name}</span>
//     //       </a>
//     //     ))}
//     //   </div>
//     // </section>

//     <section className="cat-section">
//       <div className="cat-container">
//         <span className="cat-eyebrow">Collection</span>
//         <h2 className="cat-heading">Shop by Collection</h2>

//         <div className="cat-grid">
//           {categories.map((cat) => (
//             <a
//               key={cat._id}
//               href={`/collection/${cat.category_name.toLowerCase()}`}
//               className="cat-card"
//             >
//               {cat.category_name}
//             </a>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Category;


// import { useState, useEffect } from "react";
// import axios from "axios";
// import "./style/Category_style.css";

// const server = "http://localhost:2000/";

// const Category = () => {
//   // ---------------- STATE ----------------
//   const [categories, setCategories] = useState([]);

//   // ---------------- FETCH CATEGORIES FROM BACKEND ----------------
//   useEffect(() => {
//     const readCategory = async () => {
//       try {
//         const res = await axios.get(`${server}category_read`);
//         setCategories(res.data.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     readCategory();
//   }, []);

//   // ---------------- JSX ----------------
//   return (
//     <section className="cat-section">
//       <div className="cat-container">
//         <span className="cat-eyebrow">Collection</span>
//         <h2 className="cat-heading">Shop by Collection</h2>

//         <div className="cat-grid">
//           {categories.map((cat) => (
//             <a
//               key={cat._id}
//               href={`/category_product/${cat.category_name.toLowerCase()}`}
//               className="cat-card"
//             >
//               {cat.category_name}
//             </a>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Category;
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style/Category_style.css";

const server = "http://localhost:2000/";

export default function Category() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const readCategory = async () => {
      try {
        const res = await axios.get(`${server}category_read`);
        setCategories(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    readCategory();
  }, []);

  return (
    <section className="category">

      <h2 className="category-title">Shop by Collection</h2>

      <div className="category-row">

        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/category_product/${cat.category_name.toLowerCase()}`}
            className="category-card"
          >
            {cat.category_name}
          </Link>
        ))}

      </div>

    </section>
  );
}