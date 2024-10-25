"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import {
  load as cocoSSDLoad,
  ObjectDetection as CocoSSDModel,
} from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-prediction";

const ObjectDetection: React.FC = () => {
  const webCamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load and run the COCO-SSD model
  const runCoco = useCallback(async () => {
    setIsLoading(true);
    const model = await cocoSSDLoad();
    setIsLoading(false);

    setInterval(() => {
      runModelsDetection(model);
    }, 1000); // Adjust interval as needed
  }, []);

  // Run object detection with the model
  const runModelsDetection = useCallback(async (model: CocoSSDModel) => {
    if (
      canvasRef.current &&
      webCamRef.current !== null &&
      webCamRef.current.video?.readyState === 4
    ) {
      const video = webCamRef.current.video!;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set canvas width and height to match video dimensions
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Detect objects in the video frame
      const detectedObjects = await model.detect(video);

      // Get canvas context and render predictions
      const context = canvasRef.current.getContext("2d");
      if (context) {
        renderPredictions(detectedObjects, context);
      }
    }
  }, []);

  // Initialize and display the webcam
  const showMyWebCam = useCallback(() => {
    if (
      webCamRef.current !== null &&
      webCamRef.current.video?.readyState === 4
    ) {
      const video = webCamRef.current.video;
      if (video) {
        video.width = video.videoWidth;
        video.height = video.videoHeight;
      }
    }
  }, []);

  // Run the model and show the webcam on mount
  useEffect(() => {
    tf.ready().then(() => {
      runCoco();
    });
    showMyWebCam();
  }, [runCoco, showMyWebCam]);

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 rounded-full animate-spin border-y-4 border-solid border-gray-300 border-t-transparent shadow-md"></div>
        </div>
      ) : (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
          <Webcam ref={webCamRef} className="rounded-md h-full w-full" muted />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-[99999] w-full h-96"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
