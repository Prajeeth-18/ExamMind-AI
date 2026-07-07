import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

const CameraPreview = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, []);

  async function startCamera() {
    try {

      // Ask camera permission
      await navigator.mediaDevices.getUserMedia({
        video: true
      });

      // Get all available cameras
      const devices = await navigator.mediaDevices.enumerateDevices();

      const cameras = devices.filter(
        device => device.kind === "videoinput"
      );

      console.log("====================================");
      console.log("Available Cameras");
      console.log("====================================");

      cameras.forEach((camera, index) => {
        console.log(index, camera.label);
      });

      // Automatically select Logitech if available
      let selectedCamera = cameras.find(camera =>
        camera.label.toLowerCase().includes("logitech")
      );

      // Otherwise use first available camera
      if (!selectedCamera) {
        selectedCamera = cameras[0];
      }

      console.log("====================================");
      console.log("Using Camera:");
      console.log(selectedCamera.label);
      console.log("====================================");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: {
            exact: selectedCamera.deviceId
          },
          width: {
            ideal: 1920
          },
          height: {
            ideal: 1080
          }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

    } catch (error) {
      console.error(error);
      alert("Cannot access webcam");
    }
  }

  function captureImage() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve({
            preview: canvas.toDataURL("image/jpeg"),
            blob: blob,
          });
        },
        "image/jpeg",
        0.95
      );
    });
  }

  useImperativeHandle(ref, () => ({
    captureImage,
  }));

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          borderRadius: "10px",
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