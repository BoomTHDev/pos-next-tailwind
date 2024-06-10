// app/home/page.jsx

"use client";

import { useState, useEffect } from "react";
import MyModal from "../dashboard/components/MyModal";
import Link from "next/link";
import axios from 'axios';
import Swal from "sweetalert2";
import { FaShoppingCart } from "react-icons/fa";

export default function Page() {
    const [modalOpen, setModalOpen] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProductData();
    }, []);

    const errorAlert = (e) => {
        Swal.fire({
            title: 'Error',
            text: e.message,
            icon: 'error'
        });
    };

    const fetchProductData = async () => {
        try {
            const res = await axios.get('/api/product/list');
            if (res.data.results !== undefined) {
                setProducts(res.data.results);
            }
        } catch (err) {
            errorAlert(err);
        }
    };

    const handleOpenModalCart = () => {
        setModalOpen(true);
    };

    const handleCloseModalCart = () => {
        setModalOpen(false);
    };

    const showImage = (item) => {
        let imgPath = "/default-image.png"
        if (item.image) {
            imgPath = "/uploads/" + item.image
        }

        return <img src={imgPath} className="w-full h-auto object-cover" />
    }

    return (
        <>
            <div className="flex justify-between items-center mb-3">
                <div className="mt-5">
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-lg sm:text-xl">
                        Hot!!
                    </button>{" "}
                    <span className="text-xl sm:text-2xl ml-3">Our Products</span>
                </div>
                <div className="flex items-center">
                    My cart
                    <button
                        className="ml-2 flex items-center bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors duration-200"
                        onClick={handleOpenModalCart}
                    >
                        <FaShoppingCart className="mr-2" />
                        <span className="text-lg">0</span>
                    </button>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.length > 0 ? (
                        products.map((item) => (
                            <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden w-72">
                                {showImage(item)}
                                <div className="p-2">
                                    <h5 className="text-md font-semibold mb-1">{item.name}</h5>
                                    <p className="text-gray-700 mb-1 text-sm">{item.price.toLocaleString("th-TH")} บาท</p>
                                    <button className="w-full bg-gray-900 text-white px-3 py-2 rounded hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center">
                                        <FaShoppingCart className="mr-2" />Add to cart
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>ไม่มีสินค้าในตอนนี้</div>
                    )}
                </div>
            </div>

            <MyModal id="modalCart" title="My Cart" isOpen={modalOpen} onClose={handleCloseModalCart} />
        </>
    );
}
