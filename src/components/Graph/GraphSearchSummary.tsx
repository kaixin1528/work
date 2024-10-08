/* eslint-disable react-hooks/exhaustive-deps */
import { faSquarePollHorizontal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import ReactJson from "react-json-view";
import { useReactFlow } from "reactflow";

const GraphSearchSummary = ({
  searchSummary,
  nodes,
}: {
  searchSummary: any;
  nodes: any[];
}) => {
  const [show, setShow] = useState<boolean>(true);

  const { setCenter } = useReactFlow();

  const handleTransform = (id: string) => {
    const zoomedInNode = nodes?.find((node) => node.id === id);
    if (zoomedInNode) {
      setCenter(zoomedInNode.position.x, zoomedInNode.position.y, {
        duration: 800,
      });
    }
  };

  return (
    <Popover className="z-10">
      <Popover.Button className="group relative" onClick={() => setShow(!show)}>
        <FontAwesomeIcon
          icon={faSquarePollHorizontal}
          className="w-6 h-6 mt-1 dark:text-note z-0"
        />
        <span className="hidden group-hover:block absolute top-10 right-0 p-2 w-max text-xs dark:text-white dark:bg-filter black-shadow rounded-sm z-10">
          Search result
        </span>
      </Popover.Button>
      <Transition
        as={Fragment}
        show={show}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="pointer-events-auto absolute z-10">
          <section className="absolute top-0 -left-[19rem] w-[20rem] h-[20rem] grid gap-5 p-4 bg-gradient-to-br dark:from-filter dark:to-expand overflow-auto scrollbar">
            <h4 className="text-base">Click on any resource Id to zoom in</h4>
            <article className="overflow-auto scrollbar">
              <ReactJson
                src={searchSummary?.grouped_nodes}
                name={null}
                quotesOnKeys={false}
                displayDataTypes={false}
                onSelect={(e) => {
                  if (nodes?.length > 0) handleTransform(String(e.value));
                }}
                theme="ashes"
              />
            </article>
          </section>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default GraphSearchSummary;
