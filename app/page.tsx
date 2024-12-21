"use client";

import React, { useState, useEffect } from "react";
import ObjectDetection from "@/components/ObjectDetection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page: React.FC = () => {
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [currentCameraId, setCurrentCameraId] = useState<string | null>(null);
  const [frontCameraId, setFrontCameraId] = useState<string | null>(null);
  const [backCameraId, setBackCameraId] = useState<string | null>(null);

  // Mendapatkan perangkat kamera
  useEffect(() => {
    const getCameraDevices = async (): Promise<void> => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(
          (device) => device.kind === "videoinput"
        );

        if (videoInputs.length === 1) {
          // Jika hanya ada satu kamera
          setFrontCameraId(videoInputs[0].deviceId);
          setBackCameraId(null);
        } else {
          // Jika ada lebih dari satu kamera
          videoInputs.forEach((device) => {
            if (device.label.toLowerCase().includes("front")) {
              setFrontCameraId(device.deviceId);
            } else if (
              device.label.toLowerCase().includes("back") ||
              device.label.toLowerCase().includes("environment")
            ) {
              setBackCameraId(device.deviceId);
            }
          });
        }

        if (!frontCameraId && !backCameraId) {
          toast.error("Tidak ada perangkat kamera yang terdeteksi.");
        }
      } catch (error) {
        console.error("Error saat mendapatkan perangkat kamera:", error);
        toast.error("Gagal mendapatkan daftar perangkat kamera.");
      }
    };

    getCameraDevices();
  }, [frontCameraId, backCameraId]);

  // Membuka kamera
  const openCamera = async (
    deviceId: string | null
  ): Promise<MediaStream | null> => {
    const constraints: MediaStreamConstraints = {
      video: deviceId ? { deviceId: { exact: deviceId } } : true,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (error) {
      console.error("Error saat membuka kamera:", error);
      return null;
    }
  };

  // Menyalakan/Mematikan kamera
  const toggleCamera = async (): Promise<void> => {
    if (!showCamera) {
      try {
        const initialCameraId = frontCameraId || backCameraId;
        setCurrentCameraId(initialCameraId);

        const stream = await openCamera(initialCameraId);
        if (stream) {
          setShowCamera(true);
          toast.success("Kamera berhasil dibuka.");
        } else {
          toast.error("Gagal membuka kamera.");
        }
      } catch (error) {
        toast.error(
          "Izin akses kamera diperlukan untuk menggunakan fitur ini."
        );
      }
    } else {
      setShowCamera(false);
      toast.info("Kamera ditutup.");
    }
  };

  // Mengganti kamera
  const switchCamera = async (): Promise<void> => {
    if (!frontCameraId && !backCameraId) {
      toast.error("Perangkat tidak memiliki kedua kamera.");
      return;
    }

    const newCameraId =
      currentCameraId === frontCameraId ? backCameraId : frontCameraId;

    if (!newCameraId) {
      toast.error("Tidak ada kamera yang tersedia untuk diganti.");
      return;
    }

    try {
      const stream = await openCamera(newCameraId);
      if (stream) {
        setCurrentCameraId(newCameraId);
        toast.info(
          `Berpindah ke ${
            newCameraId === frontCameraId ? "kamera depan" : "kamera belakang"
          }.`
        );
      } else {
        toast.error("Gagal mengganti kamera. Perangkat tidak mendukung.");
      }
    } catch (error) {
      console.error("Kesalahan saat mengganti kamera:", error);
      toast.error("Tidak dapat mengganti kamera.");
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
              Ganti Kamera
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
