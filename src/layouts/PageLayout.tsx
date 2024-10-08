import React from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/General/Sidebar";
import { useGeneralStore } from "../stores/general";
import { useHotkeys } from "react-hotkeys-hook";
import { downloadScreenshot } from "src/utils/general";

const PageLayout: React.FC = ({ children }) => {
  const { openSidebar } = useGeneralStore();

  useHotkeys("shift+d", downloadScreenshot);

  return (
    <section className="relative flex flex-col w-screen h-screen dark:text-white dark:bg-main">
      <Header />
      <section className="flex w-full h-full overflow-auto scrollbar">
        <Sidebar />
        <span className={openSidebar ? "w-[4rem]" : "w-0"}></span>
        {children}
      </section>
    </section>
  );
};

export default PageLayout;
