/* eslint-disable react-hooks/exhaustive-deps */
import {
  faArrowRightLong,
  faPencil,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useEffect, useState } from "react";
import SuggestNewSections from "../../../SuggestNewSections";
import ViewInFile from "../../../ViewInFile/ViewInFile";
import SubsectionContent from "./SubsectionContent";
import {
  GetSuggestSection,
  GenerateSOP,
  GetDuplicateSections,
} from "src/services/regulation-policy/policy";
import { KeyStringVal } from "src/types/general";
import { chartLegendColors } from "src/constants/general";
import DuplicateSections from "./DuplicateSections";
import { handleClickMapping } from "src/utils/grc";
import {
  GetSectionIDsAndTitles,
  UpdateSectionIDTitle,
} from "src/services/regulation-policy/framework";
import { Popover, Transition } from "@headlessui/react";
import { checkGRCAdmin } from "src/utils/general";

const Subsection = ({
  documentName,
  documentType,
  docID,
  selectedTab,
  subsection,
  sectionIndex,
  searchedRowIndex,
  subSectionIndex,
  pageNumber,
  filter,
  search,
  sectionRef,
  editSections,
  setEditSections,
  documentModified,
  setDocumentModified,
  selectedAddedSections,
  setSelectedAddedSections,
  suggestFramework,
  addSectionsToPolicy,
  hideLink,
}: {
  documentName: string;
  documentType: string;
  docID?: string;
  selectedTab?: string;
  subsection: any;
  sectionIndex: number;
  searchedRowIndex?: number;
  subSectionIndex: number;
  pageNumber?: number;
  filter?: string;
  search?: boolean;
  sectionRef?: any;
  editSections?: any;
  setEditSections?: any;
  documentModified?: any;
  setDocumentModified?: any;
  selectedAddedSections?: any;
  setSelectedAddedSections?: any;
  suggestFramework?: KeyStringVal;
  addSectionsToPolicy?: boolean;
  hideLink?: boolean;
}) => {
  const isGRCAdmin = checkGRCAdmin();

  const [opened, setOpened] = useState<boolean>(false);
  const [addNew, setAddNew] = useState<boolean>(false);
  const [newSectionID, setNewSectionID] = useState<string>("");
  const [newSectionTitle, setNewSectionTitle] = useState<string>("");

  const suggestSection = GetSuggestSection();
  const generateSOP = GenerateSOP();
  const duplicateSections = GetDuplicateSections();
  const updateSectionIdAndTitle = UpdateSectionIDTitle(String(docID));
  const { data: sectionIdsAndTitles } = GetSectionIDsAndTitles(String(docID));

  const isPolicy = documentType === "policies";
  const generatedID = subsection.generated_id;
  const showDuplicateSections =
    isPolicy && subsection.duplicate_section_count > 0;

  useEffect(() => {
    if (
      sessionStorage.clicked_mapping === "true" &&
      sessionStorage.generated_id === generatedID
    )
      sectionRef.current[
        (sectionIndex + 1) * subSectionIndex
      ]?.scrollIntoView();
  }, [sectionRef]);

  return (
    <article
      ref={(el) => {
        if (sectionRef && sectionRef.current)
          sectionRef.current[(sectionIndex + 1) * subSectionIndex] = el;
      }}
      className={`grid content-start gap-3 p-4 bg-gradient-to-r ${
        !isPolicy || filter === "Suggest New Mapping"
          ? "dark:from-checkbox/70 dark:to-white/10"
          : "dark:from-admin/70 dark:to-white/10"
      } border-l-1 dark:border-black/60 rounded-2xl`}
    >
      {subsection.framework_name && (
        <h3 className="text-xl">{subsection.framework_name}</h3>
      )}
      <article className="flex flex-col flex-grow gap-5 text-sm">
        <article className="flex items-center gap-2">
          {addSectionsToPolicy && (
            <input
              type="checkbox"
              checked={selectedAddedSections.some(
                (addedSection: any) =>
                  addedSection.index === `${sectionIndex}-${subSectionIndex}`
              )}
              className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50"
              onChange={() => {
                if (
                  selectedAddedSections.some(
                    (addedSection: any) =>
                      `${sectionIndex}-${subSectionIndex}` ===
                      addedSection.index
                  )
                ) {
                  setSelectedAddedSections(
                    selectedAddedSections.filter(
                      (addedSection: any) =>
                        `${sectionIndex}-${subSectionIndex}` !==
                        addedSection.index
                    )
                  );
                } else {
                  suggestSection.mutate(
                    {
                      versionID: docID,
                      index: subSectionIndex,
                    },
                    {
                      onSuccess: (suggestNumber) => {
                        generateSOP.mutate(
                          {
                            versionID: docID,
                            documentID: subsection.document_id,
                            generatedID: generatedID,
                          },
                          {
                            onSuccess: (generateSOP) => {
                              setSelectedAddedSections([
                                ...selectedAddedSections,
                                {
                                  index: `${sectionIndex}-${subSectionIndex}`,
                                  section_number: suggestNumber,
                                  content: generateSOP,
                                },
                              ]);
                            },
                          }
                        );
                      },
                    }
                  );
                }
              }}
            />
          )}
          <article className="flex items-center justify-between gap-10 w-full">
            <h4 className="text-lg break-all">
              {filter !== "Suggest New Mapping" && subsection.sub_section_id}.{" "}
              {subsection.sub_section_title !== "-" &&
                subsection.sub_section_title}
            </h4>
            {isGRCAdmin && documentType === "frameworks" && (
              <Popover className="relative">
                <Popover.Button className="group flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faPencil}
                    className="dark:group-hover:text-signin"
                  />
                  Move To
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                  afterEnter={() => {
                    setAddNew(false);
                    setNewSectionID("");
                    setNewSectionTitle("");
                  }}
                >
                  <Popover.Panel className="pointer-events-auto absolute top-5 right-0 break-words z-50">
                    {({ close }) => (
                      <ul className="grid gap-5 p-4 w-max max-h-[20rem] dark:bg-black rounded-md overflow-auto scrollbar">
                        {!addNew ? (
                          <li
                            className="flex items-center gap-2 px-3 py-1 w-full text-center cursor-pointer bg-gradient-to-r dark:from-no/70 dark:to-white/10 dark:hover:to-white/30 rounded-md"
                            onClick={() => setAddNew(true)}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                            Add New Section
                          </li>
                        ) : (
                          <li className="grid gap-2">
                            <article className="flex items-center gap-2">
                              <input
                                type="input"
                                placeholder="Section Id"
                                className="px-5 w-2/5 h-10 bg-transparent focus:outline-none border-none focus:ring-1 dark:focus:ring-signin dark:bg-task rounded-md"
                                onChange={(e) =>
                                  setNewSectionID(e.target.value)
                                }
                              />
                              <input
                                type="input"
                                placeholder="Section Title"
                                className="px-5 w-full h-10 bg-transparent focus:outline-none border-none focus:ring-1 dark:focus:ring-signin dark:bg-task rounded-md"
                                onChange={(e) =>
                                  setNewSectionTitle(e.target.value)
                                }
                              />
                            </article>
                            <article className="flex items-center gap-3">
                              <button
                                className="discard-button"
                                onClick={() => {
                                  setAddNew(false);
                                  setNewSectionID("");
                                  setNewSectionTitle("");
                                }}
                              >
                                Discard
                              </button>
                              <button
                                className="save-button"
                                onClick={() => {
                                  updateSectionIdAndTitle.mutate({
                                    generatedID: generatedID,
                                    sectionID: newSectionID,
                                    sectionTitle: newSectionTitle,
                                  });
                                  setAddNew(false);
                                  setNewSectionID("");
                                  setNewSectionTitle("");
                                  close();
                                }}
                              >
                                Add
                              </button>
                            </article>
                          </li>
                        )}
                        {sectionIdsAndTitles?.map(
                          (section: KeyStringVal, sectionIndex: number) => {
                            return (
                              <li
                                key={sectionIndex}
                                className="p-4 w-full cursor-pointer bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30"
                                onClick={() => {
                                  updateSectionIdAndTitle.mutate({
                                    generatedID: generatedID,
                                    sectionID: section.section_id,
                                    sectionTitle: section.section_title,
                                  });
                                  close();
                                }}
                              >
                                {section.section_id}. {section.section_title}
                              </li>
                            );
                          }
                        )}
                      </ul>
                    )}
                  </Popover.Panel>
                </Transition>
              </Popover>
            )}
          </article>
        </article>
        <article className="flex flex-wrap items-center place-content-end gap-10 w-full">
          {!hideLink && (
            <>
              {!isPolicy ? (
                <>
                  <a
                    href="/grc/mapping"
                    className="flex flex-wrap items-center gap-2 dark:hover:text-checkbox/80 duration-100"
                    onClick={() =>
                      handleClickMapping(
                        documentType,
                        documentName,
                        docID,
                        selectedTab,
                        subsection,
                        "Policy",
                        subsection.mapped_policy_sections
                      )
                    }
                  >
                    <p>
                      {subsection.mapped_policy_sections === 0
                        ? "Policy"
                        : `${subsection.mapped_policy_sections} Mapped to Policy`}{" "}
                    </p>{" "}
                    <FontAwesomeIcon icon={faArrowRightLong} />
                  </a>
                  {selectedTab === "Controls" && (
                    <a
                      href="/grc/mapping"
                      className="flex flex-wrap items-center gap-2 dark:hover:text-checkbox/80 duration-100"
                      onClick={() =>
                        handleClickMapping(
                          documentType,
                          documentName,
                          docID,
                          selectedTab,
                          subsection,
                          "Relevant Sections",
                          subsection.mapped_self_control_sections
                        )
                      }
                    >
                      <p>
                        {subsection.mapped_self_control_sections === 0
                          ? "Relevant Sections"
                          : `${
                              subsection.mapped_self_control_sections
                            } Relevant Section${
                              subsection.mapped_self_control_sections === 1
                                ? ""
                                : "s"
                            }`}
                      </p>{" "}
                      <FontAwesomeIcon icon={faArrowRightLong} />
                    </a>
                  )}
                  <a
                    href="/grc/mapping"
                    className="flex flex-wrap items-center gap-2 dark:hover:text-checkbox/80 duration-100"
                    onClick={() =>
                      handleClickMapping(
                        documentType,
                        documentName,
                        docID,
                        selectedTab,
                        subsection,
                        "RFS",
                        subsection.mapped_framework_sections
                      )
                    }
                  >
                    <p>
                      {subsection.mapped_framework_sections === 0
                        ? "Framework"
                        : `${subsection.mapped_framework_sections} Overlap${
                            subsection.mapped_framework_sections === 1
                              ? "s"
                              : ""
                          } with Framework`}
                    </p>{" "}
                    <FontAwesomeIcon icon={faArrowRightLong} />
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/grc/mapping"
                    className="flex flex-wrap items-center gap-2 dark:hover:text-checkbox/80 duration-100"
                    onClick={() =>
                      handleClickMapping(
                        documentType,
                        documentName,
                        docID,
                        selectedTab,
                        subsection,
                        "RFS",
                        subsection.mapped_sections
                      )
                    }
                  >
                    <p>
                      {subsection.mapped_sections === 0
                        ? "Framework"
                        : `${subsection.mapped_sections} Mapped to Framework`}
                    </p>{" "}
                    <FontAwesomeIcon icon={faArrowRightLong} />
                  </a>
                  {subsection.content && filter === "Suggest New Mapping" && (
                    <SuggestNewSections
                      section={subsection}
                      index={Number(pageNumber) * (sectionIndex + 1)}
                      versionID={String(docID)}
                      suggestFramework={suggestFramework}
                    />
                  )}
                </>
              )}
            </>
          )}
        </article>
      </article>
      {subsection.metadata_ && (
        <ul className="flex flex-wrap items-center gap-10">
          {Object.entries(subsection.metadata_).map((keyVal, index: number) => {
            return (
              <li
                key={keyVal[0]}
                className="flex flex-wrap items-center gap-2 text-sm"
              >
                <h4 className="capitalize">{keyVal[0].replaceAll("_", " ")}</h4>
                {Array.isArray(keyVal[1]) ? (
                  keyVal[1].map((value) => {
                    return (
                      <span
                        key={value}
                        className="px-3 py-1 text-black bg-yellow-500 rounded-md"
                      >
                        {value}
                      </span>
                    );
                  })
                ) : (
                  <span
                    className={`px-3 py-1 ${
                      chartLegendColors[String((index + 1) % 19)]
                    } rounded-full`}
                  >
                    {keyVal[1]}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <section className="grid grid-cols-2 content-start gap-10 w-full">
        {subsection.content && (
          <SubsectionContent
            documentType={documentType}
            subsection={subsection}
            duplicateSections={duplicateSections}
            filter={filter}
            search={search}
            searchedRowIndex={searchedRowIndex}
            sectionIndex={sectionIndex}
            subSectionIndex={subSectionIndex}
            editSections={editSections}
            setEditSections={setEditSections}
            documentModified={documentModified}
            setDocumentModified={setDocumentModified}
            opened={opened}
            setOpened={setOpened}
          />
        )}
        {subsection.page_metadata?.length > 0 && (
          <ViewInFile
            generatedID={generatedID}
            section={subsection}
            bbox={subsection.page_metadata}
            editSections={editSections}
            setEditSections={setEditSections}
            documentModified={documentModified}
            setDocumentModified={setDocumentModified}
            documentType={documentType}
            opened={opened}
            setOpened={setOpened}
            isNotModal
          />
        )}
      </section>
      {showDuplicateSections && (
        <DuplicateSections
          documentType={documentType}
          generatedID={generatedID}
          duplicateSections={duplicateSections}
        />
      )}
    </article>
  );
};

export default Subsection;
