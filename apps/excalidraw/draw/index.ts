type Shape = {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
} | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
};

export default function initDraw(canvas: HTMLCanvasElement) {
  function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  const ctx = canvas.getContext("2d");
  let existingShapes: Shape[] = [];

  if (!ctx) {
    return;
  }

  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
  clicked = false;
  const { x, y } = getMousePos(canvas, e);
  const width = x - startX;
  const height = y - startY;

  existingShapes.push({
    type: "rect",
    x: startX,
    y: startY,
    width,
    height,
  });

  clearCanvas(existingShapes, canvas, ctx);
});

  canvas.addEventListener("mousemove", (e) => {
  if (clicked) {
    const { x, y } = getMousePos(canvas, e);
    const width = x - startX;
    const height = y - startY;

    clearCanvas(existingShapes, canvas, ctx);

    // draw preview rect
    ctx.strokeStyle = "rgba(255,255,255)";
    ctx.strokeRect(startX, startY, width, height);
  }
});

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type == "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}
}