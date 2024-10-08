/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, FC, useEffect, useState } from "react";

import { ControlButtonProps, useReactFlow, useStoreApi } from "reactflow";
import {
  faCrosshairs,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onInit } from "src/utils/graph";

export const ControlButton: FC<ControlButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={`w-7 h-7 px-1 dark:bg-filter dark:hover:bg-checkbox/70 duration-100 ${
        rest.title === "full screen" ? "mb-2" : ""
      } `}
      {...rest}
    >
      {children}
    </button>
  );
};

const GraphControls = ({
  showZoom = true,
  showFitView = true,
  fitViewOptions,
  onZoomIn,
  onZoomOut,
  onFitView,
  children,
  nodes,
  setMinZoom,
}: any) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const store = useStoreApi();
  const reactFlowInstance = useReactFlow();

  const onZoomInHandler = useCallback(() => {
    zoomIn?.();
    onZoomIn?.();
  }, [zoomIn, onZoomIn]);

  const onZoomOutHandler = useCallback(() => {
    zoomOut?.();
    onZoomOut?.();
  }, [zoomOut, onZoomOut]);

  const onFitViewHandler = useCallback(() => {
    onInit(store, nodes, setMinZoom, reactFlowInstance);
    onFitView?.();
  }, [fitView, fitViewOptions, onFitView, reactFlowInstance, store]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <section className="absolute bottom-5 left-5 grid gap-0.5 dark:text-[#23394F] react-flow__controls z-10">
      {showZoom && (
        <ControlButton
          onClick={onZoomInHandler}
          title="zoom in"
          aria-label="zoom in"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
        </ControlButton>
      )}
      {showFitView && (
        <ControlButton
          onClick={onFitViewHandler}
          title="fit view"
          aria-label="fit view"
        >
          <FontAwesomeIcon icon={faCrosshairs} className="w-3 h-3" />
        </ControlButton>
      )}
      {showZoom && (
        <ControlButton
          onClick={onZoomOutHandler}
          title="zoom out"
          aria-label="zoom out"
        >
          <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
        </ControlButton>
      )}
      {children}
    </section>
  );
};

export default memo(GraphControls);
