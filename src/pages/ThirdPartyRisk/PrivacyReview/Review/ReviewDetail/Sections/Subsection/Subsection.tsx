/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { chartLegendColors } from "src/constants/general";
import SubsectionContent from "./SubsectionContent";
import ViewInFile from "src/pages/RegulationPolicy/Document/ViewInFile/ViewInFile";

const Subsection = ({
  documentType,
  subsection,
}: {
  documentType: string;
  subsection: any;
}) => {
  const generatedID = subsection.generated_id;

  return (
    <article className="grid content-start gap-3 p-4 bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10border-l-1 dark:border-black/60 rounded-2xl">
      <header className="flex items-center justify-between gap-10">
        <h4 className="text-lg break-words">
          {subsection.sub_section_id}{" "}
          {subsection.sub_section_title !== "-" && subsection.sub_section_title}
        </h4>
        <ViewInFile
          generatedID={generatedID}
          section={subsection}
          bbox={subsection.page_metadata}
          documentType={documentType}
        />
      </header>
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
      {subsection.content && <SubsectionContent subsection={subsection} />}
    </article>
  );
};

export default Subsection;
