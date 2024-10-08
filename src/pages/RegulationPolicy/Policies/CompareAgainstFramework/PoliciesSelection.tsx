/* eslint-disable react-hooks/exhaustive-deps */
import {
  faArrowDownLong,
  faChevronCircleDown,
  faChevronCircleRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import Loader from "src/components/Loader/Loader";
import { GetFrameworkToPolicyGroupMappings } from "src/services/regulation-policy/framework";
import {
  GetPolicyGroups,
  GetPoliciesFromGroup,
} from "src/services/regulation-policy/policy";
import { KeyStringVal } from "src/types/general";
import ViewInFile from "../../Document/ViewInFile/ViewInFile";

const PoliciesSelection = ({
  documentID,
  index,
  selectedPolicyGroups,
  setSelectedPolicyGroups,
  policyGroupSpace,
  setPolicyGroupSpace,
}: {
  documentID: string;
  index: number;
  selectedPolicyGroups: KeyStringVal[];
  setSelectedPolicyGroups: (selectedPolicyGroups: KeyStringVal[]) => void;
  policyGroupSpace: number;
  setPolicyGroupSpace: (policyGroupSpace: number) => void;
}) => {
  const [selectedPolicyIDs, setSelectedPolicyIDs] = useState<string[]>([]);

  const { data: policyGroups } = GetPolicyGroups();
  const { data: policies } = GetPoliciesFromGroup(
    selectedPolicyGroups[index]?.policy_group_id
      ? selectedPolicyGroups[index].policy_group_id
      : ""
  );

  const { data: policyMappings, status: mappingStatus } =
    GetFrameworkToPolicyGroupMappings(documentID, selectedPolicyIDs);

  useEffect(() => {
    if (
      policyGroups?.length > 0 &&
      index === 0 &&
      !selectedPolicyGroups[index]?.policy_group_id
    ) {
      const newPolicyGroups = selectedPolicyGroups;
      const defaultGroup = policyGroups?.find(
        (policyGroup: KeyStringVal) =>
          policyGroup.title.toLowerCase() === "default"
      );
      newPolicyGroups.splice(index, 1, defaultGroup);
      setSelectedPolicyGroups([...newPolicyGroups]);
    }
  }, [policyGroups]);

  useEffect(() => {
    if (policies?.data.length > 0)
      setSelectedPolicyIDs(
        policies?.data?.reduce(
          (pV: string[], cV: KeyStringVal) => [...pV, cV.policy_id],
          []
        )
      );
  }, [policies]);

  return (
    <section className="grid content-start gap-5 mb-4 w-full">
      <header className="flex items-center justify-between gap-2 w-full border-b-1 dark:border-signin">
        <Menu as="article" className="relative inline-block text-left">
          <Menu.Button className="group flex items-center gap-2 px-2 py-1 mx-auto text-xl dark:hover:bg-filter/30 duration-100">
            {selectedPolicyGroups[index]?.policy_group_id ? (
              <h4>{selectedPolicyGroups[index].title}</h4>
            ) : (
              <span>
                <FontAwesomeIcon icon={faArrowDownLong} /> Select Policy Group
              </span>
            )}
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
            <Menu.Items className="absolute left-0 grid mt-2 w-max origin-top-right focus:outline-none text-sm dark:text-white dark:bg-account rounded-sm z-50">
              {policyGroups?.length > 0 ? (
                <nav className="grid content-start w-full max-h-60 z-50 overflow-auto scrollbar">
                  {policyGroups?.map(
                    (policyGroup: KeyStringVal, policyGroupIndex: number) => {
                      const selected =
                        selectedPolicyGroups[index]?.policy_group_id ===
                        policyGroup.policy_group_id;
                      return (
                        <button
                          key={policyGroupIndex}
                          className={`flex items-center gap-3 px-4 pr-10 py-2 w-full text-left ${
                            selected
                              ? "dark:bg-filter"
                              : "dark:bg-account dark:hover:bg-mention duration-100"
                          }`}
                          onClick={() => {
                            const newPolicyGroups = selectedPolicyGroups;
                            newPolicyGroups.splice(index, 1, policyGroup);
                            setSelectedPolicyGroups([...newPolicyGroups]);
                          }}
                        >
                          <h4 className="font-medium">{policyGroup.title}</h4>
                        </button>
                      );
                    }
                  )}
                </nav>
              ) : (
                <p className="p-4">No policy groups</p>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
        <button
          className="text-reset hover:text-reset/60 duration-100"
          onClick={() => {
            setPolicyGroupSpace(policyGroupSpace - 1);
            if (selectedPolicyGroups[index])
              setSelectedPolicyGroups(
                selectedPolicyGroups.filter(
                  (policyGroup) =>
                    policyGroup.policy_group_id !==
                    selectedPolicyGroups[index].policy_group_id
                )
              );
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </header>

      {mappingStatus === "loading" ? (
        <Loader />
      ) : mappingStatus === "success" ? (
        <section className="flex flex-col flex-grow gap-5 w-full">
          <article className="grid gap-3 mx-auto text-center text-xl">
            <h4>Coverage</h4>
            <CircularProgressbarWithChildren
              strokeWidth={10}
              value={Number(policyMappings.coverage)}
              maxValue={100}
              styles={buildStyles({
                trailColor: "#FFF",
                pathColor: "#fcba03",
              })}
              className="w-32 h-32"
            >
              <span>{policyMappings.coverage}%</span>
            </CircularProgressbarWithChildren>
          </article>
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center gap-2 w-max text-base">
                  <FontAwesomeIcon
                    icon={open ? faChevronCircleDown : faChevronCircleRight}
                    className="dark:text-checkbox"
                  />
                  <p>{open ? "Hide" : "Show"} sections</p>
                </Disclosure.Button>
                <Disclosure.Panel>
                  {policyMappings ? (
                    policyMappings.mappings.length > 0 ? (
                      <ul className="grid gap-5 overflow-auto scrollbar">
                        {policyMappings.mappings.map(
                          (
                            frameworkSection: any,
                            frameworkSectionIndex: number
                          ) => {
                            return (
                              <li
                                key={frameworkSectionIndex}
                                className="grid content-start gap-3 p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-2xl"
                              >
                                <span className="text-xs">FRAMEWORK</span>
                                <header className="flex items-center justify-between gap-10 border-b dark:border-black">
                                  <h4 className="text-lg">
                                    {frameworkSection.framework_sub_section_id}{" "}
                                    {!["-", "", null].includes(
                                      frameworkSection.framework_sub_section_title
                                    ) &&
                                      frameworkSection.framework_sub_section_title}
                                  </h4>
                                  {frameworkSection.framework_metadata?.length >
                                    0 && (
                                    <ViewInFile
                                      generatedID={String(
                                        frameworkSectionIndex
                                      )}
                                      section={frameworkSection}
                                      bbox={frameworkSection.framework_metadata}
                                      documentType="frameworks"
                                    />
                                  )}
                                </header>
                                {frameworkSection.framework_content && (
                                  <Disclosure>
                                    {({ open }) => (
                                      <section className="text-sm">
                                        <Disclosure.Button className="flex items-center gap-2">
                                          <FontAwesomeIcon
                                            icon={
                                              open
                                                ? faChevronCircleDown
                                                : faChevronCircleRight
                                            }
                                            className="dark:text-black"
                                          />
                                          <h4>
                                            {open ? "Hide" : "Show"} content
                                          </h4>
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="grid gap-2 p-3 break-all dark:bg-black/60 rounded-md">
                                          <textarea
                                            spellCheck="false"
                                            autoComplete="off"
                                            readOnly
                                            value={
                                              frameworkSection.framework_content
                                            }
                                            className="py-1 w-full h-40 text-sm focus:outline-none dark:placeholder:text-checkbox dark:text-white dark:bg-transparent dark:bg-account dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent resize-none overflow-auto scrollbar"
                                          />
                                        </Disclosure.Panel>
                                      </section>
                                    )}
                                  </Disclosure>
                                )}
                                <article className="flex flex-col flex-grow gap-7">
                                  {frameworkSection.mapped_policies?.map(
                                    (policy: any, policyIndex: number) => {
                                      return (
                                        <article
                                          key={policyIndex}
                                          className="grid gap-3 p-4 bg-gradient-to-r dark:from-admin/70 dark:to-white/10 rounded-2xl"
                                        >
                                          <span className="text-xs">
                                            POLICY
                                          </span>
                                          <header className="flex items-center gap-2">
                                            <img
                                              src={policy.thumbnail_uri}
                                              alt={policy.thumbnail_uri}
                                              className="w-7 h-7 rounded-full"
                                            />
                                            <h4 className="font-medium break-all">
                                              {policy.policy_name}
                                            </h4>
                                          </header>
                                          <ul className="flex flex-col flex-grow gap-3">
                                            {policy.policy_sections?.map(
                                              (
                                                policySection: any,
                                                policySectionIndex: number
                                              ) => {
                                                return (
                                                  <li
                                                    key={policySectionIndex}
                                                    className="grid gap-2 pl-2 border-l-1 dark:border-black"
                                                  >
                                                    <article className="flex items-center justify-between gap-5 text-sm">
                                                      <h4 className="text-base">
                                                        {
                                                          policySection.policy_sub_section_id
                                                        }{" "}
                                                        {policySection.policy_sub_section_title !==
                                                          "-" &&
                                                          policySection.policy_sub_section_title}
                                                      </h4>
                                                      {policySection
                                                        .policy_page_metadata
                                                        ?.length > 0 && (
                                                        <ViewInFile
                                                          generatedID={String(
                                                            policySectionIndex
                                                          )}
                                                          section={
                                                            policySection
                                                          }
                                                          bbox={
                                                            policySection.policy_page_metadata
                                                          }
                                                          documentType="policies"
                                                        />
                                                      )}
                                                    </article>
                                                    {policySection.policy_content && (
                                                      <Disclosure>
                                                        {({ open }) => (
                                                          <section className="text-sm">
                                                            <Disclosure.Button className="flex items-center gap-2">
                                                              <FontAwesomeIcon
                                                                icon={
                                                                  open
                                                                    ? faChevronCircleDown
                                                                    : faChevronCircleRight
                                                                }
                                                                className="dark:text-black"
                                                              />
                                                              <h4>
                                                                {open
                                                                  ? "Hide"
                                                                  : "Show"}{" "}
                                                                content
                                                              </h4>
                                                            </Disclosure.Button>
                                                            <Disclosure.Panel className="grid gap-2 p-3 break-all dark:bg-black/60 rounded-md">
                                                              <textarea
                                                                spellCheck="false"
                                                                autoComplete="off"
                                                                readOnly
                                                                value={
                                                                  policySection.policy_content
                                                                }
                                                                className="py-1 w-full h-40 text-sm focus:outline-none dark:placeholder:text-checkbox dark:text-white dark:bg-transparent dark:bg-account dark:border-transparent dark:focus:ring-0 dark:focus:border-transparent resize-none overflow-auto scrollbar"
                                                              />
                                                            </Disclosure.Panel>
                                                          </section>
                                                        )}
                                                      </Disclosure>
                                                    )}
                                                  </li>
                                                );
                                              }
                                            )}
                                          </ul>
                                        </article>
                                      );
                                    }
                                  )}
                                </article>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    ) : (
                      <p className="mx-auto">No policy sections available</p>
                    )
                  ) : null}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </section>
      ) : null}
    </section>
  );
};

export default PoliciesSelection;
