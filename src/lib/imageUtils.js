const MAX_DATA_URL_LENGTH = 120_000;
const TARGET_FILE_SIZE = 85 * 1024;
const MAX_WIDTH = 900;
const MAX_HEIGHT = 900;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith("image/")) {
      reject(new Error("Please select a valid image file."));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(
        new Error(
          "This image could not be opened. Please choose a JPG, PNG or WebP photo."
        )
      );
    };

    image.src = objectUrl;
  });
}

function calculateSize(width, height, maxWidth, maxHeight) {
  const scale = Math.min(
    maxWidth / width,
    maxHeight / height,
    1
  );

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function canvasToDataUrl(canvas, quality) {
  return canvas.toDataURL("image/jpeg", quality);
}

/**
 * Converts a normal gallery/camera image into a compact JPEG data URL.
 *
 * The backend stores the image in imageUrl, so we keep the generated
 * data URL reasonably small while preserving useful visual quality.
 */
export async function compressImage(file) {
  if (!file) {
    throw new Error("Please select an image.");
  }

  if (!file.type?.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }

  // 15 MB is intentionally generous for modern phone photos.
  if (file.size > 15 * 1024 * 1024) {
    throw new Error("Please choose a photo smaller than 15 MB.");
  }

  const image = await loadImage(file);

  let { width, height } = calculateSize(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    MAX_WIDTH,
    MAX_HEIGHT
  );

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", {
    alpha: false,
  });

  if (!context) {
    throw new Error("Your browser could not process this photo.");
  }

  let bestResult = "";

  /*
   * First try a good-looking JPEG.
   */
  for (let quality = 0.82; quality >= 0.25; quality -= 0.08) {
    canvas.width = width;
    canvas.height = height;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    context.drawImage(
      image,
      0,
      0,
      width,
      height
    );

    const result = canvasToDataUrl(canvas, quality);

    bestResult = result;

    if (
      result.length <= MAX_DATA_URL_LENGTH &&
      result.length <= 115_000
    ) {
      return result;
    }
  }

  /*
   * If the photo is still large, progressively reduce dimensions.
   * This makes the function reliable even for very detailed phone photos.
   */
  for (let attempt = 0; attempt < 8; attempt += 1) {
    width = Math.max(120, Math.round(width * 0.78));
    height = Math.max(120, Math.round(height * 0.78));

    canvas.width = width;
    canvas.height = height;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    context.drawImage(
      image,
      0,
      0,
      width,
      height
    );

    for (let quality = 0.7; quality >= 0.2; quality -= 0.1) {
      const result = canvasToDataUrl(canvas, quality);

      bestResult = result;

      if (result.length <= MAX_DATA_URL_LENGTH) {
        return result;
      }
    }
  }

  /*
   * Final safety fallback.
   */
  if (bestResult && bestResult.length <= MAX_DATA_URL_LENGTH) {
    return bestResult;
  }

  throw new Error(
    "This photo is too detailed to store. Please choose another photo."
  );
}

/**
 * Returns the best available image URL for a clothing item.
 */
export function getClothingImage(item) {
  if (!item) {
    return "";
  }

  return (
    item.imageUrl ||
    item.image ||
    item.photos?.[0]?.imageUrl ||
    ""
  );
}