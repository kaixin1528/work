/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { GetCustomerEnvs } from "../../../services/settings/environments";
import { CustomerEnv } from "../../../types/settings";
import CreateEnvironment from "./CreateEnvironment";
import { getCustomerID, parseURL } from "../../../utils/general";
import DeleteEnvironment from "./DeleteEnvironment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import RenameEnvironment from "./RenameEnvironment";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import EnvironmentDetails from "./EnvironmentDetails";

const Environments = () => {
  const navigate = useNavigate();
  const parsed = parseURL();
  const customerID = getCustomerID();

  const [deleteEnvType, setDeleteEnvType] = useState<string>("");
  const [renameEnvType, setRenameEnvType] = useState<string>("");
  const [selectedRenameEnv, setSelectedRenameEnv] = useState<string>("");

  const { data: customerEnvs } = GetCustomerEnvs(customerID);

  const allEnvTypes = [
    ...new Set(
      customerEnvs?.reduce(
        (pV: string[], cV: CustomerEnv) => [...pV, cV.env_type],
        []
      )
    ),
  ] as string[];

  return (
    <>
      {!parsed.selected_env ? (
        <section className="flex flex-col flex-grow gap-10 m-6 w-full overflow-auto scrollbar">
          <header className="flex items-center gap-5">
            <h4>
              ENVIRONMENTS{" "}
              <span className="dark:text-checkbox">
                ({customerEnvs?.length})
              </span>{" "}
            </h4>
            <CreateEnvironment />
          </header>
          <ul className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {allEnvTypes?.map((envType: string) => {
              return (
                <li
                  key={envType}
                  className="relative flex items-center pr-10 pl-5 py-10 z-50 cursor-pointer text-sm dark:text-white dark:bg-signin/10 border dark:border-signin dark:hover:border-signin/60 duration-100 rounded-sm"
                  onClick={() => {
                    if (deleteEnvType === "" && selectedRenameEnv === "")
                      navigate(
                        `/settings/details?${queryString.stringify(
                          parsed
                        )}&selected_env=${envType}`
                      );
                  }}
                >
                  {envType !== "DEFAULT" && (
                    <Popover>
                      <Popover.Button className="group absolute top-0 right-0 px-3 py-2">
                        <FontAwesomeIcon icon={faEllipsis} />
                      </Popover.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute px-4 -right-2 -mt-5 z-10">
                          <article className="grid gap-1 px-4 py-2 text-xs divide-y dark:divide-checkbox bg-gradient-to-b dark:from-[#577399] dark:to-[#495867]">
                            <button
                              className="text-left dark:hover:text-gray-300/50 dark:disabled:text-gray-300/30 duration-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenameEnvType(envType);
                                setSelectedRenameEnv(envType);
                              }}
                            >
                              Rename
                            </button>
                            <button
                              className="pt-1 text-left dark:hover:text-gray-300/50 dark:disabled:text-gray-300/30 duration-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteEnvType(envType);
                              }}
                            >
                              Delete
                            </button>
                          </article>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  )}
                  <RenameEnvironment
                    envType={envType}
                    selectedRenameEnv={selectedRenameEnv}
                    setSelectedRenameEnv={setSelectedRenameEnv}
                    renameEnvType={renameEnvType}
                    setRenameEnvType={setRenameEnvType}
                  />
                  <DeleteEnvironment
                    envType={envType}
                    deleteEnvType={deleteEnvType}
                    setDeleteEnvType={setDeleteEnvType}
                  />
                  <p className="w-max">{envType}</p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <EnvironmentDetails />
      )}
    </>
  );
};

export default Environments;
