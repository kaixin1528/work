import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import ExportOption from "./ExportOption";

const ExportFile = ({ reviewID }: { reviewID: string }) => {
  return (
    <section className="text-sm">
      <Menu as="article" className="relative inline-block text-left">
        <Menu.Button className="group flex items-center gap-2 px-2 py-1 mx-auto">
          <FontAwesomeIcon icon={faFileExport} className="text-checkbox" />
          Export
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-max origin-top-right focus:outline-none text-sm dark:text-white dark:bg-filter rounded-sm z-10">
            <section className="grid gap-2 divide-y dark:divide-checkbox/30">
              <ExportOption reviewID={reviewID} mapping={true} />
              <ExportOption reviewID={reviewID} mapping={false} />
            </section>
          </Menu.Items>
        </Transition>
      </Menu>
    </section>
  );
};

export default ExportFile;
