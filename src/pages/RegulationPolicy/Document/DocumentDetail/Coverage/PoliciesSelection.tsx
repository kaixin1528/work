/* eslint-disable react-hooks/exhaustive-deps */
import {
  faArrowDownLong,
  faCheck,
  faChevronCircleDown,
  faChevronCircleRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Menu, Switch, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import Loader from "src/components/Loader/Loader";
import { GetFrameworkToPolicyGroupMappings } from "src/services/regulation-policy/framework";
import {
  GetPoliciesFromGroup,
  GetPolicyGroups,
} from "src/services/regulation-policy/policy";
import { KeyStringVal } from "src/types/general";
import DiffGraph from "./DiffGraph";
import { GetGRCDocumentMetadata } from "src/services/grc";
import ViewInFile from "../../ViewInFile/ViewInFile";
import Subsection from "../Sections/Subsection/Subsection";

const PoliciesSelection = ({
  index,
  documentID,
  selectedPolicyGroups,
  setSelectedPolicyGroups,
  policyGroupSpace,
  setPolicyGroupSpace,
}: {
  index: number;
  documentID: string;
  selectedPolicyGroups: KeyStringVal[];
  setSelectedPolicyGroups: (selectedPolicyGroups: KeyStringVal[]) => void;
  policyGroupSpace: number;
  setPolicyGroupSpace: (policyGroupSpace: number) => void;
}) => {
  const [selectedPolicyIDs, setSelectedPolicyIDs] = useState<string[]>([]);
  const [coverage, setCoverage] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(index > 0);

  const { data: info } = GetGRCDocumentMetadata("frameworks", documentID);
  const { data: policyGroups } = GetPolicyGroups();
  const { data: policies } = GetPoliciesFromGroup(
    selectedPolicyGroups[index]?.policy_group_id
      ? selectedPolicyGroups[index].policy_group_id
      : ""
  );
  const { data: policyMappings, status: mappingStatus } =
    GetFrameworkToPolicyGroupMappings(documentID, selectedPolicyIDs);

  const coveragePct = coverage
    ? Number(policyMappings?.coverage)
    : Math.round((100 - Number(policyMappings?.coverage)) * 100) / 100;
  const documentName = info?.framework_name || info?.policy_name;

  useEffect(() => {
    if (policies?.data.length > 0 && selectedPolicyIDs.length === 0)
      setSelectedPolicyIDs(
        policies?.data?.reduce(
          (pV: string[], cV: KeyStringVal) => [...pV, cV.policy_id],
          []
        )
      );
  }, [policies]);

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

  return (
    <section className="grid content-start gap-5 mb-4 w-full">
      <header className="flex items-center justify-between gap-2 w-full border-b-1 dark:border-signin">
        <Menu as="article" className="relative inline-block text-left">
          <Menu.Button
            onClick={() => setOpen(!open)}
            className="group flex items-center gap-2 px-2 py-1 mx-auto text-xl dark:hover:bg-filter/30 duration-100"
          >
            <FontAwesomeIcon icon={faArrowDownLong} />
            {selectedPolicyGroups[index]?.policy_group_id ? (
              <h4>{selectedPolicyGroups[index].title}</h4>
            ) : (
              <span>Select Policy Group</span>
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
            show={open}
            afterLeave={() => setOpen(false)}
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
                            setSelectedPolicyIDs([]);
                            setOpen(false);
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
        {index !== 0 && (
          <button
            className="text-reset hover:text-reset/60 duration-100"
            onClick={() => {
              setPolicyGroupSpace(policyGroupSpace - 1);
              if (selectedPolicyGroups[index]) {
                const newPolicyGroups = selectedPolicyGroups;
                newPolicyGroups.splice(index, 1);
                setSelectedPolicyGroups(newPolicyGroups);
              }
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
      </header>
      {selectedPolicyGroups[index]?.title && (
        <section className="grid gap-3">
          <Menu as="article" className="relative inline-block text-left">
            <Menu.Button className="flex items-center gap-2 ml-2 group dark:text-checkbox">
              <img src="/grc/policies.svg" alt="policies" className="w-6 h-6" />
              <h4>
                {selectedPolicyIDs.length}{" "}
                {selectedPolicyIDs.length !== 1 ? "Policies" : "Policy"}{" "}
                Selected
              </h4>
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
              <Menu.Items className="absolute left-0 grid -mr-5 mt-2 w-max origin-top-right focus:outline-none text-sm dark:text-white dark:bg-account rounded-sm z-10">
                <article className="flex items-center gap-5 p-4 divide-x dark:divide-checkbox">
                  <button
                    disabled={policies?.data?.length === 0}
                    className="dark:hover:text-checkbox/60 duration-100"
                    onClick={() => {
                      setSelectedPolicyIDs(
                        policies?.data?.reduce(
                          (pV: string[], cV: KeyStringVal) => [
                            ...pV,
                            cV.policy_id,
                          ],
                          []
                        )
                      );
                    }}
                  >
                    Select All
                  </button>
                  <button
                    disabled={policies?.data?.length === 0}
                    className="pl-5 dark:hover:text-checkbox/60 duration-100"
                    onClick={() => setSelectedPolicyIDs([])}
                  >
                    Deselect All
                  </button>
                </article>
                {policies?.data?.length > 0 ? (
                  <nav className="grid content-start w-full max-h-60 z-50 overflow-auto scrollbar">
                    {policies?.data.map(
                      (policy: KeyStringVal, policyIndex: number) => {
                        return (
                          <button
                            key={policyIndex}
                            className="flex items-center gap-3 px-4 pr-10 py-2 w-full text-left dark:bg-account dark:hover:bg-mention duration-100"
                            onClick={() => {
                              if (selectedPolicyIDs.includes(policy.policy_id))
                                setSelectedPolicyIDs(
                                  selectedPolicyIDs.filter(
                                    (policyID) => policyID !== policy.policy_id
                                  )
                                );
                              else
                                setSelectedPolicyIDs([
                                  ...selectedPolicyIDs,
                                  policy.policy_id,
                                ]);
                            }}
                          >
                            {selectedPolicyIDs.includes(policy.policy_id) && (
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="text-no"
                              />
                            )}
                            <article className="flex items-center gap-2">
                              <img
                                src={policy.thumbnail_uri}
                                alt={policy.policy_name}
                                className="w-7 h-7 rounded-full"
                              />
                              <h4 className="font-medium">
                                {policy.policy_name}
                              </h4>
                            </article>
                          </button>
                        );
                      }
                    )}
                  </nav>
                ) : (
                  <p className="p-4">No policies</p>
                )}
              </Menu.Items>
            </Transition>
          </Menu>
        </section>
      )}

      {mappingStatus === "loading" ? (
        <Loader />
      ) : mappingStatus === "success" ? (
        <section className="flex flex-col flex-grow gap-12 w-full">
          <article className="flex items-center gap-2 mx-auto">
            <span className="text-coverage">Coverage</span>
            <Switch
              checked={coverage}
              onChange={setCoverage}
              className={`${
                coverage ? "bg-coverage" : "bg-gray-500"
              } relative inline-flex h-6 w-11 items-center rounded-sm`}
            >
              <span
                className={`${
                  coverage ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-sm bg-white transition`}
              />
            </Switch>
            <span className="text-gray-500">Gaps</span>
          </article>
          {policyMappings && (
            <article className="grid gap-3 mx-auto text-center text-xl">
              <h4>{coverage ? "Coverage" : "Gaps"}</h4>
              <CircularProgressbarWithChildren
                strokeWidth={10}
                value={coveragePct}
                maxValue={100}
                styles={buildStyles({
                  trailColor: "#FFF",
                  pathColor: coverage ? "#fcba03" : "#6b7280",
                })}
                className="w-32 h-32"
              >
                <span>{coveragePct}%</span>
              </CircularProgressbarWithChildren>
            </article>
          )}
          {selectedPolicyIDs.length === 1 && coverage && (
            <DiffGraph
              documentID={documentID}
              selectedPolicyID={selectedPolicyIDs[0]}
            />
          )}
          {policyMappings ? (
            coverage ? (
              policyMappings.mappings.length > 0 ? (
                <ul className="grid gap-5">
                  {policyMappings.mappings.map(
                    (frameworkSection: any, frameworkSectionIndex: number) => {
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
                              ) && frameworkSection.framework_sub_section_title}
                            </h4>
                            {frameworkSection.framework_metadata?.length >
                              0 && (
                              <ViewInFile
                                generatedID={String(frameworkSectionIndex)}
                                section={frameworkSection}
                                bbox={frameworkSection.framework_metadata}
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
                                    <h4>{open ? "Hide" : "Show"} content</h4>
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="grid gap-2 p-3 break-all dark:bg-black/60 rounded-md">
                                    <textarea
                                      spellCheck="false"
                                      autoComplete="off"
                                      readOnly
                                      value={frameworkSection.framework_content}
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
                                    <span className="text-xs">POLICY</span>
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
                                                    section={policySection}
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
            ) : policyMappings.no_mappings.length > 0 ? (
              <ul className="grid gap-5">
                {policyMappings.no_mappings.map(
                  (section: any, sectionIndex: number) => {
                    return (
                      <li
                        key={sectionIndex}
                        className="grid content-start gap-3 p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-2xl"
                      >
                        <h4 className="text-lg border-b dark:border-black">
                          {section.section_id}{" "}
                          {!["-", "", null].includes(section.section_title) &&
                            section.section_title}
                        </h4>
                        <article className="grid gap-5">
                          {section.sub_sections.map(
                            (subsection: any, subSectionIndex: number) => {
                              return (
                                <Subsection
                                  key={subSectionIndex}
                                  documentName={documentName}
                                  documentType="frameworks"
                                  docID={documentID}
                                  subsection={subsection}
                                  sectionIndex={sectionIndex}
                                  subSectionIndex={subSectionIndex}
                                  hideLink
                                />
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
        </section>
      ) : null}
    </section>
  );
};

export default PoliciesSelection;
