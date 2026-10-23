export function checkBlur(video) {

  if (typeof cv === "undefined") {

    return {
      sharp: false,
      score: 0,
    };

  }

  if (!video || video.readyState !== 4) {

    return {
      sharp: false,
      score: 0,
    };

  }

  const width = video.videoWidth;
  const height = video.videoHeight;

  const src = new cv.Mat(height, width, cv.CV_8UC4);
  const cap = new cv.VideoCapture(video);

  cap.read(src);

  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  const lap = new cv.Mat();
  cv.Laplacian(gray, lap, cv.CV_64F);

  const mean = new cv.Mat();
  const stddev = new cv.Mat();

  cv.meanStdDev(lap, mean, stddev);

  const variance =
    stddev.doubleAt(0, 0) *
    stddev.doubleAt(0, 0);

  src.delete();
  gray.delete();
  lap.delete();
  mean.delete();
  stddev.delete();

  return {

    sharp: variance > 120,

    score: variance,

  };

}