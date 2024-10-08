import React from "react";
import { toPng } from "html-to-image";
import { useHotkeys } from "react-hotkeys-hook";
import { convertToUTCString } from "src/utils/general";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const GraphScreenshot = ({ curSnapshotTime }: { curSnapshotTime: number }) => {
  function downloadImage(dataUrl: string) {
    const a = document.createElement("a");

    a.setAttribute(
      "download",
      `Graph-${convertToUTCString(curSnapshotTime)}.png`
    );
    a.setAttribute("href", dataUrl);
    a.click();
  }
  const onClick = () => {
    toPng(document.querySelector(".react-flow") as HTMLElement, {
      pixelRatio: 16,
      backgroundColor: "#151F2B",
      filter: (node: any) => {
        // we don't want to add the minimap and the controls to the image
        if (
          node?.classList?.contains("react-flow__minimap") ||
          node?.classList?.contains("react-flow__controls")
        ) {
          return false;
        }

        return true;
      },
    }).then(downloadImage);
  };

  useHotkeys("shift+g", onClick);

  return (
    <button
      className="group relative dark:text-checkbox z-10"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faCamera} className="w-5 h-5" />
      <span className="hidden group-hover:block absolute top-10 right-0 p-2 w-max text-xs dark:text-white dark:bg-filter black-shadow rounded-sm z-20">
        Take graph screenshot
      </span>
    </button>
  );
};

export default GraphScreenshot;
