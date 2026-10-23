import { useEffect, useRef, useState } from "react";
import { detectPaper, uploadPage } from "../services/api";
import { useScannerState } from "../hooks/useScannerState";
function FrameProcessor({
  cameraRef,
  sessionId,
  stopSignalRef,
  onStopped
}) {
  const {
  scannerState,
  setScannerState,
  pageNumber,
  setPageNumber,
} = useScannerState();

 

  const scannerStateRef = useRef(scannerState);
  const pageNumberRef = useRef(pageNumber);

  const uploadLock = useRef(false);
  const waitingRemoval = useRef(false);
  const stableSince = useRef(null);

  useEffect(() => {
    scannerStateRef.current = scannerState;
  }, [scannerState]);

  useEffect(() => {
    pageNumberRef.current = pageNumber;
  }, [pageNumber]);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    async function scanLoop() {
      while (!cancelled && !stopSignalRef.current) {
        try {
          if (!cameraRef.current) {
            await sleep(200);
            continue;
          }

          if (uploadLock.current) {
            await sleep(200);
            continue;
          }

          const frame = await cameraRef.current.captureImage();

if (stopSignalRef.current || cancelled) {
  break;
}

if (!frame) {
  await sleep(200);
  continue;
}

const result = await detectPaper(frame.blob);

if (stopSignalRef.current || cancelled) {
  break;
}
          console.log("FULL RESULT:", result);
          console.log("paper_detected =", result.paper_detected);

          console.log("==================================");
          console.log("Detect API Result:", result);
          console.log("paper_detected:", result.paper_detected);
          console.log("sharp:", result.sharp);
          console.log("lighting:", result.lighting);
          console.log("==================================");

//console.clear();

console.log("================================");
console.log("Current State :", scannerStateRef.current);
console.log("Paper         :", result.paper_detected);
console.log("Sharp         :", result.sharp);
console.log("Lighting      :", result.lighting);
console.log("================================");

          // Wait until paper removed
          if (waitingRemoval.current) {
            if (!result.paper_detected) {
              waitingRemoval.current = false;
              stableSince.current = null;
              setScannerState("SEARCHING_PAPER");
            }

            await sleep(200);
            continue;
          }

          switch (scannerStateRef.current) {
           case "SEARCHING_PAPER":
            if (result.paper_detected) {
             console.log("➡️ STATE CHANGE: SEARCHING_PAPER -> PAPER_DETECTED");
             setScannerState("PAPER_DETECTED");
            }
            break;

            case "PAPER_DETECTED":
              if (!result.paper_detected) {
                setScannerState("SEARCHING_PAPER");
              } else {
                setScannerState("CHECKING_BLUR");
              }
              break;

            case "CHECKING_BLUR":
              if (!result.paper_detected) {
                setScannerState("SEARCHING_PAPER");
              } else if (result.sharp) {
                setScannerState("CHECKING_LIGHTING");
              }
              break;

            case "CHECKING_LIGHTING":
              if (!result.paper_detected) {
                setScannerState("SEARCHING_PAPER");
              } else if (result.lighting) {
                stableSince.current = Date.now();
                setScannerState("WAITING_STABILITY");
              }
              break;

            case "WAITING_STABILITY":
              if (!result.paper_detected) {
                stableSince.current = null;
                setScannerState("SEARCHING_PAPER");
                break;
              }

              if (!result.sharp || !result.lighting) {
                  console.log("RESETTING STABILITY");
                  console.log("Sharp:", result.sharp);
                  console.log("Lighting:", result.lighting);

                  stableSince.current = null;
                  setScannerState("CHECKING_BLUR");
                  break;
              }

              if (!stableSince.current) {
                stableSince.current = Date.now();
              }

              if (Date.now() - stableSince.current >= 2000) {
                setScannerState("AUTO_CAPTURE");
              }

              break;

            case "AUTO_CAPTURE":
              uploadLock.current = true;

              try {
                const capture =
                  await cameraRef.current.captureImage();

                await uploadPage(
                  sessionId,
                  pageNumberRef.current,
                  capture.blob
                );

                console.log(
                  "Uploaded Page",
                  pageNumberRef.current
                );

                setPageNumber((p) => p + 1);

                waitingRemoval.current = true;
                stableSince.current = null;

                setScannerState("PAGE_CAPTURED");
              } catch (err) {
                console.error(err);
              } finally {
                uploadLock.current = false;
              }

              break;

            default:
              break;
          }

          await sleep(200);
        } catch (err) {
          console.error(err);
          await sleep(500);
        }
      }
    }

    scanLoop().finally(() => {
  onStopped?.();
});

return () => {
  cancelled = true;
};
  }, [cameraRef, sessionId, stopSignalRef, onStopped]);

  return null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default FrameProcessor;