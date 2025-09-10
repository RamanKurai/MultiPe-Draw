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


const initDraw = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  } 

  let existingShapes : Shape[] = [] ;

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
    existingShapes.push({
        type : "rect",
        x : startX,
        y : startY,
        width : width,
        height : height
    })
  });
};

function clearCanvas (existingShapes : Shape[] ,canvas : HTMLCanvasElement , ctx : CanvasRenderingContext2D) {
ctx.clearRect(0, 0, canvas.width, canvas.height);
  existingShapes.map((shape) => {
     if (shape.type === "rect") {
        ctx.strokeStyle= "white",
        ctx.strokeRect(shape.x , shape.y , shape.width , shape.height)
     }
  })
}

export default initDraw;
