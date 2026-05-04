"use client";

export async function autoCutoutImage(dataUrl: string) {
  const image = await loadImage(dataUrl);
  const maxSize = 1400;
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return dataUrl;
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const frame = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = frame;
  const originalVisibleRatio = visiblePixelRatio(data, width, height);
  const visited = new Uint8Array(width * height);
  const queue: number[] = [];
  const edgeSamples = sampleEdgeColors(data, width, height);
  const edgeTolerance = 92;
  const neighbourTolerance = 46;

  const enqueue = (x: number, y: number, fromPixelIndex?: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return;
    }

    const index = y * width + x;

    if (visited[index]) {
      return;
    }

    const pixelIndex = index * 4;

    if (
      fromPixelIndex !== undefined &&
      !isSimilar(data, pixelIndex, fromPixelIndex, neighbourTolerance) &&
      !isEdgeBackgroundLike(data, pixelIndex, edgeSamples, edgeTolerance)
    ) {
      return;
    }

    visited[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }

  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  while (queue.length) {
    const index = queue.pop() ?? 0;
    const pixelIndex = index * 4;

    if (!isEdgeBackgroundLike(data, pixelIndex, edgeSamples, edgeTolerance)) {
      continue;
    }

    data[pixelIndex + 3] = 0;

    const x = index % width;
    const y = Math.floor(index / width);
    enqueue(x + 1, y, pixelIndex);
    enqueue(x - 1, y, pixelIndex);
    enqueue(x, y + 1, pixelIndex);
    enqueue(x, y - 1, pixelIndex);
  }

  softenTransparentEdges(data, width, height);
  context.putImageData(frame, 0, 0);

  const visibleRatio = visiblePixelRatio(data, width, height);

  if (visibleRatio < Math.max(0.08, originalVisibleRatio * 0.18)) {
    return dataUrl;
  }

  return canvas.toDataURL("image/png");
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function sampleEdgeColors(
  data: Uint8ClampedArray,
  width: number,
  height: number,
) {
  const samples: Array<{ r: number; g: number; b: number }> = [];
  const step = Math.max(4, Math.floor(Math.min(width, height) / 24));

  for (let x = 0; x < width; x += step) {
    samples.push(readColor(data, (0 * width + x) * 4));
    samples.push(readColor(data, ((height - 1) * width + x) * 4));
  }

  for (let y = 0; y < height; y += step) {
    samples.push(readColor(data, (y * width + 0) * 4));
    samples.push(readColor(data, (y * width + width - 1) * 4));
  }

  return samples;
}

function readColor(data: Uint8ClampedArray, index: number) {
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2],
  };
}

function isSimilar(
  data: Uint8ClampedArray,
  index: number,
  otherIndex: number,
  tolerance: number,
) {
  const dr = data[index] - data[otherIndex];
  const dg = data[index + 1] - data[otherIndex + 1];
  const db = data[index + 2] - data[otherIndex + 2];

  return Math.sqrt(dr * dr + dg * dg + db * db) < tolerance;
}

function isEdgeBackgroundLike(
  data: Uint8ClampedArray,
  index: number,
  samples: Array<{ r: number; g: number; b: number }>,
  tolerance: number,
) {
  return samples.some((sample) => {
    const dr = data[index] - sample.r;
    const dg = data[index + 1] - sample.g;
    const db = data[index + 2] - sample.b;
    const distance = Math.sqrt(dr * dr + dg * dg + db * db);
    const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
    const sampleBrightness = (sample.r + sample.g + sample.b) / 3;

    return (
      distance < tolerance ||
      (Math.abs(brightness - sampleBrightness) < 42 &&
        distance < tolerance * 1.35)
    );
  });
}

function softenTransparentEdges(
  data: Uint8ClampedArray,
  width: number,
  height: number,
) {
  const alpha = new Uint8ClampedArray(width * height);

  for (let index = 0; index < width * height; index += 1) {
    alpha[index] = data[index * 4 + 3];
  }

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x;

      if (alpha[index] === 0) {
        continue;
      }

      const neighbours = [
        alpha[index - 1],
        alpha[index + 1],
        alpha[index - width],
        alpha[index + width],
      ];

      if (neighbours.some((value) => value === 0)) {
        data[index * 4 + 3] = 210;
      }
    }
  }
}

function visiblePixelRatio(
  data: Uint8ClampedArray,
  width: number,
  height: number,
) {
  let visible = 0;

  for (let index = 0; index < width * height; index += 1) {
    if (data[index * 4 + 3] > 12) {
      visible += 1;
    }
  }

  return visible / (width * height);
}
