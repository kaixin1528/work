import { faXmark, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { GetRegulatoryAuthorities } from "src/services/regulation-policy/framework";

const AdditionalRegAuth = ({
  documentType,
  inputs,
  setInputs,
}: {
  documentType: string;
  inputs: any;
  setInputs: (inputs: any) => void;
}) => {
  const { data: regAuth } = GetRegulatoryAuthorities(documentType);

  const filteredAuth = regAuth?.filter(
    (auth: string) => !inputs.additional_regulatory_authorities.includes(auth)
  );

  return (
    <section className="flex flex-wrap items-center gap-3 text-sm">
      {inputs.additional_regulatory_authorities?.length > 0 && (
        <ul className="flex flex-wrap items-center gap-3">
          {inputs.additional_regulatory_authorities.map((auth: string) => {
            return (
              <li
                key={auth}
                className="flex items-center gap-3 pl-4 pr-1 py-1 dark:bg-org rounded-full"
              >
                <p>{auth}</p>

                <button
                  onClick={() =>
                    setInputs({
                      ...inputs,
                      additional_regulatory_authorities:
                        inputs.additional_regulatory_authorities.filter(
                          (otherAuth: string) => auth !== otherAuth
                        ),
                    })
                  }
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="w-4 h-4 dark:text-org dark:hover:bg-checkbox/60 dark:bg-checkbox duration-100 rounded-full"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Popover as="article" className="relative inline-block text-left">
        <Popover.Button className="flex items-center gap-2 group dark:text-checkbox">
          <FontAwesomeIcon icon={faTag} />
          <h4>Add Additional Regulatory Authority</h4>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Popover.Panel className="absolute left-2 grid w-max -mr-5 mt-2 gap-2 origin-top-right focus:outline-none text-sm dark:text-white dark:bg-account z-50 rounded-sm">
            {filteredAuth?.length > 0 ? (
              <nav className="grid content-start w-full max-h-60 z-50 overflow-auto scrollbar">
                {filteredAuth?.map((auth: string) => {
                  return (
                    <button
                      key={auth}
                      className="flex items-center gap-3 px-4 pr-10 py-2 w-full text-left dark:bg-account dark:hover:bg-mention duration-100"
                      onClick={() =>
                        setInputs({
                          ...inputs,
                          additional_regulatory_authorities: [
                            ...inputs.additional_regulatory_authorities,
                            auth,
                          ],
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={faTag}
                        className="dark:text-checkbox"
                      />
                      <p className="grid">{auth}</p>
                    </button>
                  );
                })}
              </nav>
            ) : (
              <section className="grid gap-2 px-5 py-3 w-max origin-top-right focus:outline-none dark:text-white dark:bg-account z-50 rounded-sm">
                <h4>No regulatory authorities</h4>
              </section>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </section>
  );
};

export default AdditionalRegAuth;
