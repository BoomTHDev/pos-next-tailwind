"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";
import { FaShoppingCart } from "react-icons/fa";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [imageBanner, setImageBanner] = useState([]);

  useEffect(() => {
    fetchImageBanner();
    fetchProductData();
  }, []);

  const errorAlert = (e) => {
    Swal.fire({
      title: "Error",
      text: e.message,
      icon: "error",
    });
  };

  const fetchProductData = async () => {
    try {
      const res = await axios.get("/api/product/list");
      if (res.data.results !== undefined) {
        setProducts(res.data.results);
      }
    } catch (err) {
      errorAlert(err);
    }
  };

  const fetchImageBanner = async () => {
    try {
      const res = await axios.get('/api/image/read', { headers: { 'Cache-Control': 'no-cache' } })
      
      if (res.data.results !== undefined) {
        setImageBanner(res.data.results);
      }
    } catch (err) {
      errorAlert(err);
    }
  };

  const showImage = (item) => {
    let imgPath = "/default-image.png";
    if (item.image) {
      imgPath = item.image;
    }

    return (
      <img src={imgPath} className="w-full h-48 object-cover" alt={item.name} />
    );
  };

  return (
    <>
      <div className="flex flex-col items-center mb-5">
        <div className="w-full flex justify-center">
          {imageBanner.length > 0 ? (
            imageBanner.map((item, index) => (
              <img
                key={index}
                src={item.image}
                alt={`image-${index}`}
                className="w-full h-auto object-cover rounded-lg shadow-md mb-3"
              />
            ))
          ) : (
            <div className="text-center text-gray-500">NO BANNER IMAGE</div>
          )}
        </div>
        <div className="w-full flex justify-between items-center mt-5 px-5">
          <div className="flex items-center">
            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-lg sm:text-xl">
              Hot!!
            </button>
            <span className="text-xl sm:text-2xl ml-3 text-white">
              Our Products
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg overflow-hidden w-72 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/70"
              >
                {showImage(item)}
                <div className="p-4">
                  <h5 className="text-md font-semibold mb-2">{item.name}</h5>
                  <p className="text-gray-700 mb-3 text-sm">
                    {item.price.toLocaleString("th-TH")} บาท
                  </p>
                  <Link
                    href={`/home/products/${item.id}`}
                    className="w-full bg-gray-900 text-white px-3 py-2 rounded hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
                  >
                    <FaShoppingCart className="mr-2" />
                    Buy
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center text-gray-500">
              ไม่มีสินค้าในตอนนี้
            </div>
          )}
        </div>
      </div>
    </>
  );
}
