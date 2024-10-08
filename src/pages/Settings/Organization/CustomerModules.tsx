/* eslint-disable no-restricted-globals */
import { faXmark, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  AddCustomerModule,
  GetAvailableModules,
  GetCustomerModules,
  RemoveCustomerModule,
} from "src/services/settings/organization";

const CustomerModules = ({ customerID }: { customerID: string }) => {
  const { data: availableModules } = GetAvailableModules();
  const { data: customerModules } = GetCustomerModules(customerID);
  const addModule = AddCustomerModule(customerID);
  const removeModule = RemoveCustomerModule(customerID);

  const filteredAvailableModules = availableModules?.filter(
    (module: string) => !customerModules?.includes(module)
  );

  return (
    <section className="flex flex-wrap items-center gap-5 text-xs">
      {customerModules?.length > 0 && (
        <ul className="flex flex-wrap items-center gap-3">
          {customerModules?.map((module: string) => {
            return (
              <li
                key={module}
                className="flex items-center gap-3 pl-4 pr-1 py-1 dark:text-white dark:bg-black rounded-full"
              >
                <p>{module}</p>

                <button
                  onClick={() => removeModule.mutate({ modules: [module] })}
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="w-4 h-4 dark:text-black dark:hover:bg-checkbox/60 dark:bg-white duration-100 rounded-full"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Menu as="article" className="relative inline-block text-left">
        <Menu.Button className="flex items-center gap-1 group dark:text-black">
          <FontAwesomeIcon icon={faTag} />
          <h4>Add Module</h4>
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
          <Menu.Items className="absolute left-0 grid w-max gap-2 origin-top-right focus:outline-none text-sm dark:text-white dark:bg-black z-50 rounded-sm">
            {filteredAvailableModules?.length > 0 ? (
              <nav className="grid content-start w-full max-h-60 z-50 overflow-auto scrollbar">
                {filteredAvailableModules?.map((module: string) => {
                  return (
                    <button
                      key={module}
                      className="flex items-center gap-2 px-4 pr-10 py-2 w-full text-left dark:bg-black dark:hover:bg-mention duration-100"
                      onClick={() =>
                        addModule.mutate({
                          modules: [module],
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={faTag}
                        className="dark:text-checkbox"
                      />
                      <p className="grid text-xs">{module}</p>
                    </button>
                  );
                })}
              </nav>
            ) : (
              <section className="grid gap-2 px-5 py-3 w-max origin-top-right focus:outline-none text-xs dark:text-white dark:bg-account z-50 rounded-sm">
                <h4>No modules</h4>
              </section>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </section>
  );
};

export default CustomerModules;
