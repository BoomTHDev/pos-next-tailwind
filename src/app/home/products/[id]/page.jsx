"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Page({ params }) {
  const [imageBanner, setImageBanner] = useState([]);
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    fetchBanner();
    fetchProduct();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [product, quantity]);

  const errorAlert = (e) => {
    Swal.fire({
      title: "error",
      text: e.message,
      icon: "error",
    });
  };

  const fetchBanner = async () => {
    try {
      const res = await axios.get("/api/image/read");
      if (res.data.results !== undefined) {
        setImageBanner(res.data.results);
      }
    } catch (err) {
      errorAlert(err);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/product/list/${params.id}`);
      if (res.data.result !== undefined) {
        setProduct(res.data.result);
      }
    } catch (err) {
      errorAlert(err);
    }
  };

  const calculateTotalPrice = () => {
    if (product.price) {
      setTotalPrice(product.price * quantity);
    }
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setQuantity(value);
  };

  const showImage = (item) => {
    if (item.image) {
      const imgPath = "/uploads/" + item.image;
      return (
        <img
          src={imgPath}
          className="w-full h-70 object-cover"
          alt={item.name}
        />
      );
    }
    return null;
  };

  const handleSave = async () => {
    try {
      if (!totalPrice || !quantity) {
        Swal.fire({
          title: "error",
          text: "กรุณากรอกข้อมูลให้ครบถ้วน",
          icon: "error",
        });
        return;
      }

      if (!session || !session.user || !session.user.id) {
        Swal.fire({
          title: "error",
          text: "ผู้ใช้ไม่ได้เข้าสู่ระบบ",
          icon: "error",
        });
        return;
      }

      const userId = session.user.id;
      const payload = { totalPrice, quantity, productId: product.id, userId: userId }; // ส่ง userId ที่ถูกต้อง
      const res = await axios.post('/api/sale/save', payload);
      if (res.data.message === 'success') {
        Swal.fire({
          title: "Success",
          text: "ทำการสั่งซื้อเรียบร้อยแล้ว",
          icon: "success",
          timer: 1000
        });
        setQuantity(1);
        setTotalPrice(0);
      }
    } catch (err) {
      errorAlert(err);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center">
        {imageBanner.length > 0 ? (
          imageBanner.map((item, index) => (
            <img
              key={index}
              src={"/uploads/" + item.filename}
              alt={`image-${index}`}
              className="w-full h-auto object-cover rounded-lg shadow-md mb-3"
            />
          ))
        ) : (
          <div className="text-center text-gray-500">NO BANNER IMAGE</div>
        )}
      </div>

      <div className="container mx-auto p-4 text-white">
        <div className="bg-gray-800 shadow-lg rounded-lg p-4">
          <div className="flex">
            {product && product.image ? (
              <div className="w-1/4">
                {showImage(product)}
              </div>
            ) : (
              <div className="text-center text-gray-500">NO PRODUCT IMAGE</div>
            )}
            <div className="w-3/4 pl-4">
              <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
              <ul className="list-disc pl-5 mb-4">
                <p>"เอาไว้ลงรายละเอียด"</p>
              </ul>
              <div className="flex justify-between items-center mb-4">
                <span>ราคาบัตรที่เลือก</span>
                <span>{product.price} บาท</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span>จำนวน</span>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border rounded-lg p-2 w-24 text-black"
                  min="1"
                />
              </div>
              <div className="flex justify-between items-center mb-4">
                <span>ยอดรวม</span>
                <span>{totalPrice} บาท</span>
              </div>
              <button className="bg-green-500 text-white py-2 px-4 rounded-lg w-full" onClick={handleSave}>
                ยืนยันการสั่งซื้อ
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
