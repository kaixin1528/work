/* eslint-disable no-restricted-globals */
import React, { RefObject, useEffect, useRef, useState } from "react";
import KeyValuePair from "../../../../../components/General/KeyValuePair";
import VulnerabilitySpans from "./VulnerabilitySpans";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import SeverityCountsChart from "./SeverityCountsChart";
import ExpandedViewLayout from "../../../../../layouts/ExpandedViewLayout";
import { closestTime } from "../../../../../utils/graph";
import { RepoImage } from "../../../../../types/dashboard";
import {
  convertToUTCString,
  parseURL,
  sortNumericData,
} from "../../../../../utils/general";
import { useGeneralStore } from "src/stores/general";
import {
  GetMostRecentImages,
  GetSeverityCounts,
  GetVulnerabilitiesSpan,
} from "src/services/dashboard/infra";
const CCR = ({ selectedNodeID }: { selectedNodeID: string }) => {
  const parsed = parseURL();

  const { env } = useGeneralStore();

  const imageRef = useRef([]) as RefObject<HTMLLIElement[]>;
  const [imageTimestamp, setImageTimestamp] = useState<number>(-1);

  const { data: mostRecentImages } = GetMostRecentImages(
    env,
    parsed.integration,
    encodeURIComponent(encodeURIComponent(selectedNodeID)),
    parsed.node_type
  );
  const { data: vulnerabilities } = GetSeverityCounts(
    env,
    parsed.integration,
    selectedNodeID,
    parsed.node_type
  );
  const { data: vulnerabilitiesSpan } = GetVulnerabilitiesSpan(
    env,
    parsed.integration,
    selectedNodeID,
    parsed.node_type
  );

  useEffect(() => {
    const imageTimestamps = mostRecentImages?.latest_images.reduce(
      (pV: number[], cV: RepoImage) => [...pV, cV.pushed_at],
      []
    );
    const imageIndex = mostRecentImages?.latest_images.findIndex(
      (image: RepoImage) =>
        image.pushed_at === closestTime(imageTimestamp, imageTimestamps)
    );
    if (imageRef?.current && imageRef.current[imageIndex])
      imageRef.current[imageIndex].scrollIntoView();
  }, [imageTimestamp, mostRecentImages]);

  return (
    <ExpandedViewLayout selectedNodeID={selectedNodeID}>
      {/* most recent images (up to 10) */}
      {mostRecentImages ? (
        mostRecentImages.latest_images.length > 0 ? (
          <section className="grid gap-2 mr-20">
            <KeyValuePair
              label="Most Recent # Images"
              value={mostRecentImages.latest_images.length}
            />
            <ul className="flex items-center gap-3 my-5 w-full overflow-auto scrollbar">
              {sortNumericData(
                mostRecentImages.latest_images,
                "pushed_at",
                "asc"
              )?.map((image: RepoImage, index: number) => {
                const imageTimestamps = mostRecentImages?.latest_images.reduce(
                  (pV: number[], cV: RepoImage) => [...pV, cV.pushed_at],
                  []
                );
                const imageIndex = mostRecentImages?.latest_images.findIndex(
                  (image: RepoImage) =>
                    image.pushed_at ===
                    closestTime(imageTimestamp, imageTimestamps)
                );

                return (
                  <li
                    key={image.pushed_at}
                    ref={(el) => {
                      if (imageRef?.current && el) imageRef.current[index] = el;
                    }}
                    className={`relative grid gap-2 p-4 px-10 h-full text-center text-xs ${
                      imageRef.current &&
                      imageRef.current[imageIndex] &&
                      imageIndex === index
                        ? "border dark:border-note"
                        : "border dark:border-checkbox"
                    } rounded-md`}
                  >
                    <article className="grid mx-auto">
                      <h4>Image Sha:</h4>
                      <p className="dark:text-signin">
                        ...{image.sha.slice(-8)}
                      </p>
                    </article>
                    <article className="grid mx-auto break-all">
                      <h4>Image Tag:</h4>
                      <p className="dark:text-signin">{image.tag}</p>
                    </article>
                    <p className="w-max mx-auto">
                      {convertToUTCString(image.pushed_at)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : (
          <p className="mx-auto">No latest images available</p>
        )
      ) : null}

      {/* gets the severity counts by level for each image tag  */}
      {vulnerabilities ? (
        vulnerabilities.severity_counts?.length > 0 ? (
          <SeverityCountsChart
            vulnerabilities={vulnerabilities}
            setImageTimestamp={setImageTimestamp}
          />
        ) : (
          <p className="mx-auto">No vulnerability scan information available</p>
        )
      ) : null}

      {/* 5 longest spanning critical cves, if any */}
      {vulnerabilitiesSpan ? (
        vulnerabilitiesSpan?.length > 0 ? (
          <section className="w-full h-full">
            <header className="flex items-center gap-5">
              <h4 className="dark:text-checkbox">Vulnerability Span</h4>
            </header>
            <ParentSize>
              {({ width }) => (
                <VulnerabilitySpans
                  vulnerabilitiesSpan={vulnerabilitiesSpan}
                  width={width}
                  height={200 * ((vulnerabilitiesSpan.length + 1) / 6)}
                />
              )}
            </ParentSize>
          </section>
        ) : (
          <p className="mx-auto">
            No critical vulnerabilities found in this repo
          </p>
        )
      ) : null}
    </ExpandedViewLayout>
  );
};

export default CCR;
