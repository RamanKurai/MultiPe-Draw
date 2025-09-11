import axios from "axios"

type Shape = {
    type : "rect",
    x : number,
    y : number,
    width : number,
    height : number
} | {
    type : "circle",
    centerX : number,
    centerY : number,
    radius : number
}

const initDraw = async (canvas: HTMLCanvasElement , roomId : string , socket : WebSocket): Promise<void> => {    

  const ctx = canvas.getContext("2d");

    let existingShapes : Shape[] = await getExistingShapes(roomId) || [] ;

  if (!ctx) {
    return;
  } 

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

 clearCanvas(existingShapes , canvas , ctx)

  let startX: number = 0;
  let startY: number = 0;
  let isDrawing = false;

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      const width = e.offsetX - startX;
      const height = e.offsetY - startY;
      clearCanvas(existingShapes,canvas , ctx)
      ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, width, height);
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    isDrawing = false;
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;
    const shape : Shape= {
        type : "rect",
        x : startX,
        y : startY,
        width,
        height
    }
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

function clearCanvas (existingShapes : Shape[] ,canvas : HTMLCanvasElement , ctx : CanvasRenderingContext2D) {
ctx.clearRect(0, 0, canvas.width, canvas.height);
  existingShapes.map((shape) => {
     if (shape.type === "rect") {
        ctx.strokeStyle= "white",
        ctx.strokeRect(shape.x , shape.y , shape.width , shape.height)
     }
  })
}

async function getExistingShapes(roomId : string) : Promise<Shape[]> {
  const res = await axios.get(`http://localhost:3001/api/v1/shape/${roomId}`)
  const message = res.data.message

  const shapes =  message.map((x : {message : string}) => {
    const messageData = JSON.parse(x.message)
    return messageData as Shape;
  })

  return shapes;
}
}
export default initDraw;
