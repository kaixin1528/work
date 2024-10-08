/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useGraphStore } from "src/stores/graph";
import { GraphNav } from "src/types/graph";
import { getCustomerCloud } from "src/utils/general";

const GraphNavigation = () => {
  const customerCloud = getCustomerCloud();

  const { graphInfo, setGraphInfo, graphNav, setGraphNav } = useGraphStore();

  const handleOnClick = (node: GraphNav) => {
    setGraphInfo({
      ...graphInfo,
      root: node.nodeID,
      depth: node.nodeID.includes("agg") ? 1 : 2,
      showOnlyAgg: node.nodeID === customerCloud,
      showPanel: false,
    });
  };

  useEffect(() => {
    // go to previous nav
    const handleEscape = (event: {
      key: string;
      preventDefault: () => void;
    }) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (graphNav.length > 1) {
          const previousNode = graphNav[graphNav.length - 2];
          handleOnClick(previousNode);
          setGraphNav(graphNav.slice(0, -1));
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [graphNav, graphInfo]);

  return (
    <nav className="flex flex-wrap gap-2 absolute top-5 left-10 w-[20rem] z-10 text-sm dark:text-white">
      {graphNav.map((currentNode: GraphNav, index: number) => {
        return (
          <article
            key={currentNode.nodeID}
            className="flex gap-2 dark:hover:text-checkbox cursor-pointer"
            onClick={() => {
              handleOnClick(currentNode);
              setGraphNav(graphNav.slice(0, index + 1));
            }}
          >
            {index > 0 && <span>&gt;</span>}
            <p data-test="graph-navigation" className="capitalize">
              {graphNav[index].nodeType}
            </p>
          </article>
        );
      })}
    </nav>
  );
};

export default GraphNavigation;
