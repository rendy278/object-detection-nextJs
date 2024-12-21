"use client";

import React, { useState, useEffect } from "react";
import ObjectDetection from "@/components/ObjectDetection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page: React.FC = () => {
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [frontCameraId, setFrontCameraId] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Mendapatkan perangkat kamera
  useEffect(() => {
    const getCameraDevices = async (): Promise<void> => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(
          (device) => device.kind === "videoinput"
        );

        if (videoInputs.length > 0) {
          const frontCamera = videoInputs.find((device) =>
            device.label.toLowerCase().includes("front")
          );
          const backCamera = videoInputs.find((device) =>
            device.label.toLowerCase().includes("back")
          );

          setFrontCameraId(frontCamera?.deviceId || null);

          // Default fallback jika label tidak ditemukan
          if (!frontCamera || !backCamera) {
            setFrontCameraId(videoInputs[0]?.deviceId || null);
          }
        } else {
          toast.error("Tidak ada perangkat kamera yang terdeteksi.");
        }
      } catch (error) {
        console.error("Error saat mendapatkan perangkat kamera:", error);
        toast.error("Gagal mendapatkan daftar perangkat kamera.");
      }
    };

    getCameraDevices();
  }, []);

  // Membuka kamera
  const openCamera = async (deviceId: string | null): Promise<void> => {
    const constraints: MediaStreamConstraints = {
      video: deviceId ? { deviceId: { exact: deviceId } } : true,
    };

    try {
      // Tutup stream sebelumnya jika ada
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream); // Simpan stream untuk ditutup nanti
    } catch (error) {
      console.error("Error saat membuka kamera:", error);
      throw error;
    }
  };

  // Menyalakan/Mematikan kamera
  const toggleCamera = async (): Promise<void> => {
    if (!showCamera) {
      try {
        const initialCameraId = frontCameraId;
        await openCamera(initialCameraId);
        setShowCamera(true);
        toast.success("Kamera berhasil dibuka.");
      } catch (error) {
        console.error(error);
        toast.error(
          "Izin akses kamera diperlukan untuk menggunakan fitur ini."
        );
      }
    } else {
      // Tutup kamera
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      setShowCamera(false);
      toast.info("Kamera ditutup.");
    }
  };

  return (
    <main className="w-full h-full text-white">
      <div
        className={`w-full p-6 flex flex-col justify-center items-center ${
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
