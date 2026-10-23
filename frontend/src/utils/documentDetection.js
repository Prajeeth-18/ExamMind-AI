export function detectDocument(video) {

  if (!video || video.readyState !== 4) {
    return {
      detected: false
    };
  }

  if (typeof cv === "undefined") {
    return {
      detected: false
    };
  }

  const width = video.videoWidth;
  const height = video.videoHeight;

  const src = new cv.Mat(height, width, cv.CV_8UC4);
  const cap = new cv.VideoCapture(video);

  cap.read(src);

  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  const blurred = new cv.Mat();
  cv.GaussianBlur(
    gray,
    blurred,
    new cv.Size(5, 5),
    0
  );

  const edges = new cv.Mat();
  cv.Canny(
    blurred,
    edges,
    75,
    200
  );

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  cv.findContours(
    edges,
    contours,
    hierarchy,
    cv.RETR_LIST,
    cv.CHAIN_APPROX_SIMPLE
  );

  let detected = false;

  for (let i = 0; i < contours.size(); i++) {

    const contour = contours.get(i);

    const perimeter = cv.arcLength(
      contour,
      true
    );

    const approx = new cv.Mat();

    cv.approxPolyDP(
      contour,
      approx,
      0.02 * perimeter,
      true
    );

    if (approx.rows === 4) {
      detected = true;
      approx.delete();
      contour.delete();
      break;
    }

    approx.delete();
    contour.delete();
  }

  src.delete();
  gray.delete();
  blurred.delete();
  edges.delete();
  contours.delete();
  hierarchy.delete();

  return {
    detected
  };
}