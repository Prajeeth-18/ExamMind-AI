import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { useScannerState } from "../hooks/useScannerState";

const CameraPreview = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const { setScannerState } = useScannerState();

  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        setScannerState("CAMERA_STARTING");

        // Ask camera permission once
        const permissionStream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
          });

        permissionStream
          .getTracks()
          .forEach((track) => track.stop());

        const devices =
          await navigator.mediaDevices.enumerateDevices();

        const cameras = devices.filter(
          (device) => device.kind === "videoinput"
        );

        console.log("========== Cameras ==========");

        cameras.forEach((camera, index) => {
          console.log(index, camera.label);
        });

        let selectedCamera = cameras.find((camera) =>
          camera.label.toLowerCase().includes("logitech")
        );

        if (!selectedCamera && cameras.length > 0) {
          selectedCamera = cameras[0];
        }

        if (!selectedCamera) {
          throw new Error("No camera found.");
        }

        console.log(
          "Using Camera:",
          selectedCamera.label
        );

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: {
                exact: selectedCamera.deviceId,
              },
              width: {
                ideal: 1920,
              },
              height: {
                ideal: 1080,
              },
            },
          });

        if (!mounted) {
          stream
            .getTracks()
            .forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata =
            async () => {
              try {
                await videoRef.current.play();
                setScannerState(
                  "SEARCHING_PAPER"
                );
              } catch (err) {
                console.error(
                  "Camera Error:",
                  err
                );
              }
            };
        }
      } catch (error) {
        console.error("Camera Error:", error);

        setScannerState("CAMERA_ERROR");

        alert("Cannot access webcam");
      }
    }

    startCamera();

    return () => {
      mounted = false;

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [setScannerState]);

  function captureImage() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      !video ||
      !canvas ||
      video.readyState < 2 ||
      video.videoWidth === 0
    ) {
      return null;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }

          resolve({
            preview: canvas.toDataURL(
              "image/jpeg"
            ),
            blob,
          });
        },
        "image/jpeg",
        0.95
      );
    });
  }

  useImperativeHandle(ref, () => ({
    captureImage,
    videoRef,
  }));

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "10px",
          background: "#000",
        }}
      />

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />
    </>
  );
});

export default CameraPreview;