import axios from "axios";

//these types should declare in another file no code depulication
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
} | {
    type : "line",
    startX : number,
    startY :  number,
    endX : number,
    endY :  number,
    lineWidth : number 
}  

export default async function getExistingShapes(roomId: string): Promise<Shape[]> {
  const res = await axios.get(`http://localhost:3001/api/v1/shape/${roomId}`);

  console.log("Response from backend:", res.data);

  // Correct extraction
  const rawShapes = res.data.message;

  if (!Array.isArray(rawShapes)) {
    console.error("Expected array but got:", res.data);
    return [];
  }

  const shapes: Shape[] = rawShapes.map((row: { message: string }) => {
    try {
      return JSON.parse(row.message) as Shape;
    } catch (err) {
      console.error("Failed to parse shape message:", row.message, err);
      return null;
    }
  }).filter((s): s is Shape => s !== null);

  return shapes;
}
