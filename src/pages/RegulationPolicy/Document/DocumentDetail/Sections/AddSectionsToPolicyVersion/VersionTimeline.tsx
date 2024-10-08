import React from "react";
import { versionTimelineColors } from "src/constants/grc";
import { GetPolicyVersions } from "src/services/regulation-policy/policy";
import { convertToUTCString, sortNumericData } from "src/utils/general";

const VersionTimeline = ({
  documentType,
  documentID,
}: {
  documentType: string;
  documentID: string;
}) => {
  const { data: policyVersions } = GetPolicyVersions(documentType, documentID);

  const sortedVersions = sortNumericData(policyVersions, "upload_time", "asc");

  return (
    <section className="grid gap-5">
      <h4 className="text-lg text-center underlined-label">Version Timeline</h4>
      <ul className="flex py-4 w-full overflow-auto scrollbar">
        {sortedVersions?.map((policyVersion: any, index: number) => (
          <li
            key={policyVersion.version}
            className="flex flex-col w-full h-full text-center"
          >
            <h4
              className={`flex items-center justify-center p-4 mx-auto ${
                versionTimelineColors[index % 5].text
              } dark:bg-white ring-8 ${
                versionTimelineColors[index % 5].ring
              } rounded-full`}
            >
              {policyVersion.version}
            </h4>
            <span
              className={`mx-auto w-1 h-10 ${
                versionTimelineColors[index % 5].bg
              }`}
            ></span>
            <span
              className={`w-full h-5 ${versionTimelineColors[index % 5].bg}`}
            ></span>
            <p
              className={`my-4 mx-auto text-lg font-extralight border-b-4 ${
                versionTimelineColors[index % 5].border
              }`}
            >
              {convertToUTCString(policyVersion.upload_time)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default VersionTimeline;
