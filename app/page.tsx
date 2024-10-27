"use client";
import React, { useState } from "react";
import ObjectDetection from "@/components/ObjectDetection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page: React.FC = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const toggleCamera = async () => {
    if (!showCamera) {
      // Menampilkan notifikasi hanya ketika membuka kamera
      try {
        await openCamera(isFrontCamera);
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

  const openCamera = async (useFrontCamera: boolean) => {
    const constraints = {
      video: {
        facingMode: useFrontCamera ? "user" : { ideal: "environment" },
      },
    };
    try {
      await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      if (!useFrontCamera) {
        toast.error("Kamera belakang tidak tersedia.");
      }
      throw error;
    }
  };

  const switchCamera = async () => {
    setIsFrontCamera((prev) => !prev);
    if (showCamera) {
      try {
        await openCamera(!isFrontCamera);
      } catch (error) {
        console.error("Gagal beralih kamera:", error);
      }
    }
  };

  return (
    <main className="w-full h-full text-white">
      <div
        className={`container p-6 flex flex-col justify-center items-center ${
          showCamera ? "h-fit" : "h-screen"
        }`}
      >
        <div className="title font-extrabold text-center mb-6">
          <h1 className="text-3xl gradient-title">Next.js Object Detection</h1>
          <h2 className="mt-3 text-2xl gradient-title">
            Pada proyek ini, jika objek adalah person, maka akan memunculkan
            sound danger.
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3 items-center">
          <button
            onClick={toggleCamera}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
          >
            {showCamera ? "Tutup Kamera" : "Buka Kamera"}
          </button>
          {showCamera && (
            <button
              onClick={switchCamera}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Ganti ke Kamera {isFrontCamera ? "Belakang" : "Depan"}
            </button>
          )}
        </div>
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
