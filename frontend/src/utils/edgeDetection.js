export function detectDocument(video) {

  if (typeof cv === "undefined") {
    return {
      detected: false,
      corners: null,
    };
  }

  if (!video || video.readyState !== 4) {
    return {
      detected: false,
      corners: null,
    };
  }

  const width = video.videoWidth;
  const height = video.videoHeight;

  const src = new cv.Mat(height, width, cv.CV_8UC4);

  const cap = new cv.VideoCapture(video);

  cap.read(src);

  // Gray

  const gray = new cv.Mat();

  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  // Blur

  const blur = new cv.Mat();

  cv.GaussianBlur(
    gray,
    blur,
    new cv.Size(5, 5),
    0
  );

  // Edge

  const edges = new cv.Mat();

  cv.Canny(
    blur,
    edges,
    75,
    200
  );

  // Find Contours

  const contours = new cv.MatVector();

  const hierarchy = new cv.Mat();

  cv.findContours(
    edges,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  let detected = false;

  let largestArea = 0;

  for (let i = 0; i < contours.size(); i++) {

    const contour = contours.get(i);

    const area = cv.contourArea(contour);

    if (area < 10000) {
      contour.delete();
      continue;
    }

    const peri = cv.arcLength(
      contour,
      true
    );

    const approx = new cv.Mat();

    cv.approxPolyDP(
      contour,
      approx,
      0.02 * peri,
      true
    );

    if (
      approx.rows === 4 &&
      area > largestArea
    ) {
      largestArea = area;
      detected = true;
    }

    approx.delete();
    contour.delete();

  }

  src.delete();
  gray.delete();
  blur.delete();
  edges.delete();
  contours.delete();
  hierarchy.delete();

  return {

    detected,

    corners: null,

  };

}