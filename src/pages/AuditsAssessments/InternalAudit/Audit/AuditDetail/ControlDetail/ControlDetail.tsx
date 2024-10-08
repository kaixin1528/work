import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { chartLegendColors } from "src/constants/general";
import EvidenceList from "./EvidenceList";
import { handleClickMapping } from "src/utils/grc";
import ControlContent from "./ControlContent";

const Control = ({
  documentType,
  documentID,
  documentName,
  auditID,
  control,
}: {
  documentType: string;
  documentID: string;
  documentName: string;
  auditID: string;
  control: any;
}) => {
  const controlID = control.generated_id;
  const selectedTab = "Controls Coverage";

  return (
    <article className="grid content-start gap-3 p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10border-l-1 dark:border-black/60 rounded-2xl">
      <article className="flex items-center justify-between gap-20 text-sm">
        <article className="flex items-center gap-2">
          <h4 className="text-lg break-words">
            {control.sub_section_id}{" "}
            {control.sub_section_title !== "-" && control.sub_section_title}
          </h4>
        </article>
        <article className="flex items-center place-content-end gap-10">
          <a
            href="/grc/mapping"
            className="flex items-center gap-2 dark:hover:text-checkbox/80 duration-100"
            onClick={() =>
              handleClickMapping(
                documentType,
                documentName,
                documentID,
                selectedTab,
                control,
                "Relevant Sections",
                control.mapped_self_control_sections
              )
            }
          >
            <p>
              {control.mapped_self_control_sections === 0
                ? "Relevant Sections"
                : `${control.mapped_self_control_sections} Relevant Section${
                    control.mapped_self_control_sections === 1 ? "" : "s"
                  }`}
            </p>{" "}
            <FontAwesomeIcon icon={faArrowRightLong} />
          </a>
        </article>
      </article>
      {control.metadata_ && (
        <ul className="flex flex-wrap items-center gap-10">
          {Object.entries(control.metadata_).map((keyVal, index) => {
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
      {control.content && <ControlContent subsection={control} />}
      <EvidenceList auditID={auditID} controlID={controlID} />
    </article>
  );
};

export default Control;
