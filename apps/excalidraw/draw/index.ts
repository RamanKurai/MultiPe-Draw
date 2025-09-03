import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

export default async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  const ctx = canvas.getContext("2d");

  // Load existing shapes from backend
  let existingShapes: Shape[] = await getExistingShapes(roomId) || [];

  if (!ctx) return;

  // Handle incoming WebSocket messages
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        const parsedShape: Shape = JSON.parse(message.message);
        existingShapes.push(parsedShape);
        clearCanvas(existingShapes, canvas, ctx);
      }
    } catch (err) {
      console.error("Error parsing socket message:", err);
    }
  };
   
    clearCanvas(existingShapes, canvas, ctx);
  // Drawing state
  let clicked = false;
  let startX = 0;
  let startY = 0;


  //Check It ccccccccccccccccccccccccccccccccccccccccccccccccccccccc!!!!!!!!!!!!!!
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    const pos = getMousePos(canvas, e);
    startX = pos.x;
    startY = pos.y;
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!clicked) return;
    clicked = false;

    const { x, y } = getMousePos(canvas, e);
    const width = x - startX;
    const height = y - startY;

    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    };

    existingShapes.push(shape);

      clearCanvas(existingShapes, canvas, ctx);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify(shape),
        roomId,
      })
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const { x, y } = getMousePos(canvas, e);
      const width = x - startX;
      const height = y - startY;

      clearCanvas(existingShapes, canvas, ctx);
      // Draw preview rect
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

// Clear and redraw everything
function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } 
    console.log("existingShapes after fetch:", existingShapes, Array.isArray(existingShapes));
  });
}

// to get the all existing shapes in the room , that you join 
async function getExistingShapes(roomId: string): Promise<Shape[]> {
  try {
    const res = await axios.get(`http://localhost:3001/api/v1/shape/${roomId}`);
// this logic means the backend does not give the valid stuff / does not give array
    if (res.data && Array.isArray(res.data.message)) {
      return res.data.message.map((m: { message: string }) => {
        try {
          return JSON.parse(m.message);
        } catch (err) {
          console.error("Invalid shape JSON:", m.message);
          return null;
        }
      }).filter(Boolean);
    }

    console.warn("Unexpected response format, falling back to []");
    return [];
  } catch (err) {
    console.error("Failed to fetch shapes:", err);
    return [];
  }
}
