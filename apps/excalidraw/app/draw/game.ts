import { Tool } from "@/components/Canvas";
import getExistingShapes from "./http";

//these types should declare in another file no code depulication
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
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      lineWidth: number;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private clicked: boolean;
  private startX: number = 0;
  private startY: number = 0;
  private endX: number = 0;
  private endY: number = 0;
  private lineWidth: number = 2;
  private roomId: string;
  private socket: WebSocket;
  private selectedTool: Tool = "circle";

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.initMouseHandlers();
    this.initHandlers();
  }

    async start() {
    console.log("Game.start() called");
    this.existingShapes = await getExistingShapes(this.roomId);
    console.log("Fetched shapes:", this.existingShapes);
    this.clearCanvas();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);

    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);

    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: "circle" | "line" | "rect") {
    this.selectedTool = tool;
  }


  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type == "chat") {
        const parsedShape: Shape = JSON.parse(message.message);
        this.existingShapes.push(parsedShape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
  // wipe everything
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  // background (black)
  this.ctx.fillStyle = "#000000";
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  // shapes (white strokes)
  this.ctx.strokeStyle = "#ffffff";
  this.ctx.lineWidth = this.lineWidth;

  this.existingShapes.forEach((shape) => {
    if (shape.type === "rect") {

      this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);

    } else if (shape.type === "circle") {

      this.ctx.beginPath();
      this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();

    } else if (shape.type === "line") {

      this.ctx.beginPath();
      this.ctx.moveTo(shape.startX, shape.startY);
      this.ctx.lineTo(shape.endX, shape.endY);
      this.ctx.stroke();
      this.ctx.closePath();
      
    }
  });
}


  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;

  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;
    const width = e.offsetX - this.startX;
    const height = e.offsetY - this.startY;

    const selectedTool = this.selectedTool;

    let shape: Shape | null = null;


    if (selectedTool == "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        height,
        width,
      };
    } else if (selectedTool == "circle") {
      const radius = Math.max(width, height) / 2;
      shape = {
        type: "circle",
        radius: radius,
        centerX: this.startX + radius,
        centerY: this.startY + radius,
      };
    } else if (selectedTool == "line") {
  shape = {
    type: "line",
    startX: this.startX,
    startY: this.startY,
    endX: e.offsetX,
    endY: e.offsetY,
    lineWidth: this.lineWidth,
  };
}

    if (!shape) {
      return;
    }

    this.existingShapes.push(shape);

    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify(shape),
        roomId: this.roomId,
      })
    );
    this.clearCanvas()
  };

  mouseMoveHandler = (e: MouseEvent) => {
  if (this.clicked) {
    this.endX = e.offsetX;
    this.endY = e.offsetY;

    this.clearCanvas();
    this.ctx.strokeStyle = "rgba(255 , 255 , 255)";
    this.ctx.lineWidth = this.lineWidth;

    const width = this.endX - this.startX;
    const height = this.endY - this.startY;

    const selectedTool = this.selectedTool;

    if (selectedTool == "rect") {
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    } else if (selectedTool == "circle") {
      const radius = Math.max(width, height) / 2;
      const centerX = this.startX + radius;
      const centerY = this.startY + radius;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (selectedTool == "line") {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(this.endX, this.endY);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
};


  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);

    this.canvas.addEventListener("mouseup", this.mouseUpHandler);

    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}
