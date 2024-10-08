/* eslint-disable react-hooks/exhaustive-deps */
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { chartLegendColors } from "src/constants/general";
import { handleClickMapping } from "src/utils/grc";
import SubsectionContent from "./SubsectionContent";
import ViewInFile from "src/pages/RegulationPolicy/Document/ViewInFile/ViewInFile";

const Subsection = ({
  documentType,
  documentID,
  documentName,
  reviewID,
  auditID,
  subsection,
  selectedTab,
  editSections,
  setEditSections,
  documentModified,
  setDocumentModified,
}: {
  documentType: string;
  documentID: string;
  documentName: string;
  reviewID: string;
  auditID: string;
  subsection: any;
  selectedTab: string;
  editSections: any;
  setEditSections: any;
  documentModified: any;
  setDocumentModified: any;
}) => {
  const [opened, setOpened] = useState<boolean>(false);
  const sectionRef = useRef() as MutableRefObject<HTMLElement>;

  const isControls = selectedTab === "Controls Coverage";
  const generatedID = subsection.generated_id;

  useEffect(() => {
    if (
      sessionStorage.clicked_mapping === "true" &&
      sessionStorage.generated_id === generatedID
    )
      sectionRef?.current?.scrollIntoView();
  }, [sectionRef]);

  return (
    <article
      ref={sectionRef}
      className="grid content-start gap-3 p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10border-l-1 dark:border-black/60 rounded-2xl"
    >
      <h4 className="text-lg break-words">
        {subsection.sub_section_id}{" "}
        {subsection.sub_section_title !== "-" && subsection.sub_section_title}
      </h4>
      <article className="flex items-center place-content-end gap-10 text-sm">
        {isControls && (
          <>
            <a
              href="/grc/mapping"
              className="flex items-center gap-2 dark:hover:text-checkbox/80 duration-100"
              onClick={() =>
                handleClickMapping(
                  documentType,
                  documentName,
                  documentID,
                  selectedTab,
                  subsection,
                  "Relevant Sections",
                  subsection.mapped_self_control_sections,
                  auditID
                )
              }
            >
              <p>
                {subsection.mapped_self_control_sections === 0
                  ? "Relevant Sections"
                  : `${
                      subsection.mapped_self_control_sections
                    } Relevant Section${
                      subsection.mapped_self_control_sections === 1 ? "" : "s"
                    }`}
              </p>{" "}
              <FontAwesomeIcon icon={faArrowRightLong} />
            </a>
          </>
        )}
        <a
          href="/grc/mapping"
          className="flex items-center gap-2 dark:hover:text-filter/80 duration-100"
          onClick={() =>
            handleClickMapping(
              documentType,
              documentName,
              documentID,
              selectedTab,
              subsection,
              "RFS",
              subsection.mapped_framework_sections,
              auditID
            )
          }
        >
          <p>
            {subsection.mapped_framework_sections === 0
              ? "Framework"
              : `${subsection.mapped_framework_sections} Overlap${
                  subsection.mapped_framework_sections === 1 ? "s" : ""
                } with Framework`}
          </p>{" "}
          <FontAwesomeIcon icon={faArrowRightLong} />
        </a>
      </article>
      {subsection.metadata_ && (
        <ul className="flex flex-wrap items-center gap-10">
          {Object.entries(subsection.metadata_).map((keyVal, index) => {
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
                      chartLegendColors[(index + 1) % 19]
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
      <article
        className={`grid ${
          subsection.page_metadata?.length > 0 ? "md:grid-cols-2" : ""
        } gap-10 text-sm`}
      >
        {subsection.content && (
          <SubsectionContent
            documentID={documentID}
            reviewID={reviewID}
            auditID={auditID}
            subsection={subsection}
            selectedTab={selectedTab}
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
            documentType={documentType}
            opened={opened}
            setOpened={setOpened}
            isNotModal
          />
        )}
      </article>
    </article>
  );
};

export default Subsection;
