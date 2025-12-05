import React from "react";
import Canvas from "@/components/Canvas/Canvas";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

const MainCanvasPage = () => {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <SideBar />
        <Canvas />
      </div>
    </div>
  );
};

export default MainCanvasPage;
