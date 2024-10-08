import {
  faLandMineOn,
  faExclamationTriangle,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { annotationBGColors, annotationTextColors } from "src/constants/graph";
import { useGraphStore } from "src/stores/graph";
import { GraphNodeData } from "src/types/general";

const SideIcons = ({ data }: { data: GraphNodeData }) => {
  const {
    setSelectedEdge,
    setSelectedNode,
    setSelectedPanelTab,
    setElementType,
    showGraphAnnotations,
  } = useGraphStore();

  const handleOnClick = (category: string) => {
    setElementType("node");
    setSelectedNode({
      id: data.id,
    });
    setSelectedEdge(undefined);
    setSelectedPanelTab(category);
  };

  const annotation =
    data.simulationAnnotation?.annotation ||
    data.graphAnnotation?.annotation ||
    "";
  const annotationMessage = data.graphAnnotation?.message || "";

  return (
    <section className="absolute -top-2 -right-5 grid gap-3 py-2 px-[0.6rem] justify-items-center">
      {annotationMessage !== "" && (
        <Popover as="section" className="relative">
          {({ open }) => {
            return (
              <>
                <Popover.Button>
                  <FontAwesomeIcon
                    icon={faLandMineOn}
                    className={`w-10 h-10 ${
                      annotationTextColors[annotation?.toLowerCase()]
                    } z-0`}
                  />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  show={open || showGraphAnnotations}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="pointer-events-auto absolute">
                    <section
                      className={`absolute -right-20 bottom-16 w-[20rem] h-max grid gap-5 p-4 text-left ${
                        annotationBGColors[annotation?.toLowerCase()]
                      } shadow-lg rounded-sm overflow-auto scrollbar`}
                    >
                      <p>{annotationMessage}</p>
                    </section>
                  </Popover.Panel>
                </Transition>
              </>
            );
          }}
        </Popover>
      )}
      {data.hasEvents && (
        <button
          className="grid content-center dark:text-event dark:hover:text-orange-300 duration-100 rounded-full"
          onClick={() => handleOnClick("Alerts")}
        >
          <FontAwesomeIcon icon={faExclamationTriangle} className="w-10 h-10" />
        </button>
      )}
      {data.hasComments && (
        <button
          className="grid content-center dark:text-green-500 dark:hover:text-green-300 duration-100"
          onClick={() => handleOnClick("Notes")}
        >
          <FontAwesomeIcon icon={faComment} className="w-10 h-10" />
        </button>
      )}
    </section>
  );
};

export default SideIcons;
