import { throttle } from "lodash";

type Prediction = {
  bbox: [number, number, number, number];
  class: string;
  score: number;
};

const playAudio = throttle(() => {
  const audio = new Audio("/danger.mp3");
  audio.play();
}, 2000);

export const renderPredictions = (
  predictions: Prediction[],
  ctx: CanvasRenderingContext2D
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Font settings
  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;

    const isPerson = prediction.class === "person";

    // Bounding box
    ctx.strokeStyle = isPerson ? "#FF0000" : "#00FFFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    // Fill color for person
    ctx.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.2 : 0})`;
    ctx.fillRect(x, y, width, height);

    // Draw label background
    ctx.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10);
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

    // Text color and label
    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, x, y);

    // Play audio if person is detected
    if (isPerson) {
      playAudio();
    }
  });
};
