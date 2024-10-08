/* eslint-disable no-restricted-globals */
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { GetLatestVersion } from "../../services/general/general";
import { documentationLinks } from "src/constants/general";

const Help = () => {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const { data: getLatestVersion } = GetLatestVersion(showHelp);

  return (
    <Menu as="article" className="relative inline-block text-left">
      <Menu.Button className="group relative focus:outline-none">
        <img
          src="/general/help.svg"
          alt="help"
          className="w-10 h-10 -mt-1.5 dark:hover:saturate-50 duration-300"
          onClick={() => setShowHelp(true)}
        />
        <span className="hidden group-hover:block absolute top-10 right-0 p-2 w-max text-xs dark:bg-filter black-shadow rounded-sm z-20">
          Help
        </span>
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
        <Menu.Items className="absolute right-0 grid gap-2 mr-2 w-56 origin-top-right focus:outline-none divide-y dark:divide-checkbox text-xs dark:text-white dark:bg-info z-30">
          <header className="flex items-center justify-between gap-5 px-4 pt-4">
            <h6 className="font-medium">HELP</h6>
            <p>{getLatestVersion}</p>
          </header>
          <article className="grid gap-1 py-2">
            {documentationLinks.map((section) => {
              return (
                <a
                  key={section.name}
                  href={`/documentation/details?section=${section.section}`}
                  className="justify-self-start px-4 w-full underline dark:text-signin dark:hover:text-[#53BEEC] duration-300"
                >
                  {section.name}
                </a>
              );
            })}
          </article>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Help;
