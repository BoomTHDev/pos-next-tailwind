"use client";

import { useState, useRef } from "react";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

export default function Page() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const selectedFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        Swal.fire("Error", "Please upload image files only", "error");
        return;
      }

      setImage(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Swal.fire("Error", "Please select an image before uploading", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("/api/image/upload/banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.newName !== undefined) {
        Swal.fire({
          title: "Success",
          text: "Image uploaded successfully",
          icon: "success",
          timer: 1000,
        });
        setImagePreview(`/uploads/${response.data.newName}`);
      } else {
        Swal.fire("Error", "Failed to upload image", "error");
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while uploading the image",
        icon: "error",
      });
    }
  };

  return (
    <div className="min-h-screen  p-4 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">ปรับแต่งหน้าเว็บไซต์</h1>
        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-4">แก้ไขภาพ Banner</h4>
          <div className="flex items-center justify-between mb-4">
            <button
              className="flex items-center bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
              onClick={() => fileInputRef.current.click()}
            >
              <FaUpload className="mr-2" />
              <span>Upload Image</span>
            </button>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={selectedFile}
            />
            <span className="ml-2">{fileName || "No file chosen"}</span>
          </div>
          <div className="flex justify-center items-center mb-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Selected Image"
                className="max-w-xs h-auto rounded shadow"
              />
            ) : (
              <div className="text-gray-500">No Banner Photo</div>
            )}
          </div>
          <button
            onClick={uploadImage}
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Upload Image
          </button>
        </div>
      </div>
    </div>
  );
}
