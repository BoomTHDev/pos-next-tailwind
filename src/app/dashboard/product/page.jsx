"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MyModal from "../components/MyModal";
import {
  FaCheck,
  FaTrash,
  FaPlus,
  FaUndo,
  FaTrashAlt,
  FaEdit,
  FaUpload,
} from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

export default function Page() {
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [trashModalOpen, setTrashModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [productTrash, setProductTrash] = useState([]);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    fetchProductData();
    fetchProductDelete();
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

  const fetchProductDelete = async () => {
    try {
      const res = await axios.get("/api/product/listDelete");
      if (res.data.results !== undefined) {
        setProductTrash(res.data.results);
      }
    } catch (err) {
      errorAlert(err);
    }
  };

  const handleOpenModalAddProduct = () => {
    setProductModalOpen(true);
    setProduct({});
    setFileName("");
    setImagePreview(null)
  };

  const handleOpenModalTrashProduct = () => {
    setTrashModalOpen(true);
    fetchProductDelete();
  };

  const handleEdit = (item) => {
    setProduct(item);
    setProductModalOpen(true);
    setImagePreview(null)
    setFileName("")
  };

  const handleCloseModalAddProduct = () => {
    setProductModalOpen(false);
  };

  const handleCloseModalTrashProduct = () => {
    setTrashModalOpen(false);
  };

  const handleRemove = async (item) => {
    try {
      const button = await Swal.fire({
        title: "Remove",
        text: "Move it to trash?",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Yes! Do it.",
        cancelButtonText: "No! Cancel it.",
      });
      if (button.isConfirmed) {
        const res = await axios.delete(`/api/product/remove/${item.id}`, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.data.message === "success") {
          Swal.fire({
            title: "Removed",
            text: "Item has been removed successfully",
            icon: "success",
            timer: 1000,
          });
          fetchProductData();
        }
      }
    } catch (err) {
      errorAlert(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (session) {
      try {
        const newProductData = { ...product };
        if (image) {
          const uploadImageName = await handleUpload();
          if (uploadImageName) {
            newProductData.image = uploadImageName;
          } else {
            throw new Error("Image upload failed");
          }
        }
        newProductData.cost = parseInt(product.cost);
        newProductData.price = parseInt(product.price);

        let res;

        if (product.id === undefined) {
          res = await axios.post("/api/product/create", newProductData, {
            headers: { "Content-Type": "application/json" },
          });
        } else {
          res = await axios.put(`/api/product/update`, newProductData, {
            headers: { "Content-Type": "application/json" },
          });
        }

        if (res.data.message === "success") {
          Swal.fire({
            title: "Success",
            text:
              product.id === undefined
                ? "Add product success"
                : "Update product success",
            icon: "success",
            timer: 1000,
          });
          handleCloseModalAddProduct();
          fetchProductData();
        }
      } catch (err) {
        errorAlert(err);
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      const button = await Swal.fire({
        title: "Restore",
        text: "Restore this product?",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Yes, restore it.",
        cancelButtonText: "No! Cancel it.",
      });
      if (button.isConfirmed) {
        const res = await axios.put(`/api/product/restore/${id}`, null, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.data.message === "success") {
          Swal.fire({
            title: "Success",
            text: "Restored success",
            icon: "success",
            timer: 1000,
          });
          fetchProductData();
          fetchProductDelete();
          handleCloseModalTrashProduct();
        }
      }
    } catch (err) {
      errorAlert(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const button = await Swal.fire({
        title: "Delete",
        text: "Are you sure to delete it?",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Yes, delete it.",
        cancelButtonText: "No! Cancel it.",
      });
      if (button.isConfirmed) {
        const res = await axios.delete(`/api/product/delete/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.data.message === "success") {
          Swal.fire({
            title: "Success",
            text: "Deleted product success",
            icon: "success",
            timer: 1000,
          });
          fetchProductDelete();
          fetchProductData();
        }
      }
    } catch (err) {
      errorAlert(err);
    }
  };

  const selectedFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await axios.post("/api/product/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.newName !== undefined) {
        return res.data.newName;
      } else {
        throw new Error("Failed to get uploaded image name");
      }
    } catch (err) {
      errorAlert(err);
    }
  };

  const showImage = (item) => {
    if (item.image && item.image !== "") {
      return (
        <img
          src={"/uploads/" + item.image}
          alt=""
          className="object-cover rounded"
          width="150px"
        />
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-3xl font-bold mb-4 text-white">Product Manage</div>
      <div className="mb-6 flex">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center mr-3 border"
          onClick={handleOpenModalAddProduct}
        >
          <FaPlus className="mr-2" />
          Add Product
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center border"
          onClick={handleOpenModalTrashProduct}
        >
          <FaTrash className="mr-2" />
          Trash
        </button>
      </div>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Cost</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((item) => (
              <tr key={item.id} className="bg-gray-400 hover:bg-gray-500">
                <td className="px-4 py-2 border">{showImage(item)}</td>
                <td className="px-4 py-2 border">{item.name}</td>
                <td className="px-4 py-2 border">{item.cost}</td>
                <td className="px-4 py-2 border">{item.price}</td>
                <td className="px-4 py-2 border flex justify-center items-center space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-1 px-2 rounded flex items-center"
                    onClick={() => handleEdit(item)}
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-2 rounded flex items-center"
                    onClick={() => handleRemove(item)}
                  >
                    <FaTrashAlt className="mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="px-4 py-8 border text-center text-gray-600 italic"
              >
                No Products Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <MyModal
        id="modalProduct"
        title={product.id === undefined ? "Add Product" : "Edit Product"}
        isOpen={productModalOpen}
        onClose={handleCloseModalAddProduct}
      >
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Product Name
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter product name"
              value={product.name || ""}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cost
            </label>
            <input
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter cost"
              value={product.cost || ""}
              onChange={(e) => setProduct({ ...product, cost: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price
            </label>
            <input
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter price"
              value={product.price || ""}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload Image
            </label>
            <div className="flex items-center">
              <label className="cursor-pointer flex items-center bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
                <FaUpload className="mr-2" />
                <span>Upload</span>
                <input type="file" className="hidden" onChange={selectedFile} />
              </label>
              <span className="ml-2">{fileName || "No file chosen"}</span>
            </div>
          </div>
          {imagePreview ? (
              <div className="mt-4 mb-4">
                <img
                  src={imagePreview}
                  alt="Selected Image"
                  className="max-w-full h-auto rounded"
                  width='150px'
                />
              </div>
            ) : (
              showImage(product)
            )}
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
            type="submit"
          >
            <FaCheck className="mr-1" />
            Save
          </button>
        </form>
      </MyModal>

      <MyModal
        id="modalProductTrash"
        title="Trash"
        isOpen={trashModalOpen}
        onClose={handleCloseModalTrashProduct}
      >
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productTrash.length > 0 ? (
                      productTrash.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.cost}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              className="inline-flex items-center gap-x-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
                              onClick={() => handleRestore(item.id)}
                            >
                              <FaUndo className="mr-1" />
                              Restore
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center gap-x-2 text-sm font-semibold text-red-600 hover:text-red-800 ml-2"
                              onClick={() => handleDelete(item.id)}
                            >
                              <FaTrashAlt className="mr-1" />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No products in trash
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </MyModal>
    </div>
  );
}
