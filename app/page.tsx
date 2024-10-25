"use client";
import React, { useState } from "react";
import ObjectDetection from "@/components/ObjectDetection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page: React.FC = () => {
  const [showCamera, setShowCamera] = useState(false);

  const toggleCamera = async () => {
    if (!showCamera) {
      // Hanya menampilkan notifikasi ketika membuka kamera
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setShowCamera(true);
        toast.success("Izin kamera diberikan. Kamera terbuka.");
      } catch (error) {
        console.error("Izin kamera ditolak atau terjadi kesalahan:", error);
        toast.error(
          "Izin akses kamera diperlukan untuk menggunakan fitur ini."
        );
      }
    } else {
      setShowCamera(false);
    }
  };

  return (
    <main className="w-full h-full bg-black/80 text-white">
      <div
        className={`container p-6 flex flex-col justify-center items-center ${
          showCamera ? "lg:h-fit h-screen" : "h-screen"
        }`}
      >
        <div className="title font-extrabold text-center mb-6">
          <h1 className="text-3xl gradient-title">Next.js Object Detection</h1>
          <h2 className="mt-3 text-2xl gradient-title">
            Pada proyek ini, jika objek adalah person, maka akan memunculkan
            sound danger.
          </h2>
        </div>
        <button
          onClick={toggleCamera}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {showCamera ? "Tutup Kamera" : "Buka Kamera"}
        </button>
        {showCamera && <ObjectDetection />}

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>
    </main>
  );
};

export default Page;
