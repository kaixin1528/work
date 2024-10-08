/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { Fragment, useState } from "react";
import { Finding } from "../../../../../types/dashboard";
import KeyValuePair from "../../../../../components/General/KeyValuePair";
import VulnerabilityTree from "./VulnerabilityTree";
import CVEImpact from "./CVEImpact";
import ExpandedViewLayout from "../../../../../layouts/ExpandedViewLayout";
import ModalLayout from "../../../../../layouts/ModalLayout";
import { parseURL } from "../../../../../utils/general";
import { GetMetadata } from "src/services/general/general";
import { KeyStringVal } from "src/types/general";
import { useGeneralStore } from "src/stores/general";
import { GetImageScans, GetCVEInfo } from "src/services/dashboard/infra";
import { severities, severityMappingToNumerals } from "src/constants/general";
import { severityColors } from "src/constants/summaries";

const CRI = ({ selectedNodeID }: { selectedNodeID: string }) => {
  const parsed = parseURL();

  const { env } = useGeneralStore();

  const [curCVE, setCurCVE] = useState<string>("");
  const [showMore, setShowMore] = useState<boolean>(false);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("critical");

  const { data: cvssMetadata } = GetMetadata("cvss_vector");
  const { data: imageScans } = GetImageScans(
    env,
    parsed.integration,
    encodeURIComponent(encodeURIComponent(selectedNodeID)),
    parsed.node_type
  );
  const { data: cveInfo } = GetCVEInfo(
    env,
    parsed.integration,
    curCVE,
    parsed.node_type
  );

  const filteredFindings =
    selectedSeverity !== ""
      ? imageScans?.findings?.filter((scan: Finding) =>
          [
            selectedSeverity,
            String(severityMappingToNumerals[selectedSeverity]),
          ].includes(scan.severity.toLowerCase())
        )
      : imageScans?.findings;

  const handleOnClose = () => setCurCVE("");

  return (
    <ExpandedViewLayout selectedNodeID={selectedNodeID}>
      {imageScans && (
        <article className="flex items-center gap-2">
          <KeyValuePair
            label="Vulnerability Scan Completed at"
            value={imageScans.image_scan_completed_at}
          />
        </article>
      )}
      {imageScans && (
        <nav className="flex flex-row-reverse items-center justify-between gap-5 w-full">
          {severities.map((severity: string) => {
            return (
              <button
                key={severity}
                className={`grid px-2 py-1 w-full text-center ${
                  selectedSeverity === severity ? "outer-ring" : ""
                } ${severityColors[severity]}`}
                onClick={() => setSelectedSeverity(severity)}
              >
                <h4 className="capitalize">{severity}</h4>
                <span>
                  {imageScans.finding_severity_counts[
                    severityMappingToNumerals[severity]
                  ] ||
                    imageScans.finding_severity_counts[
                      severity.toUpperCase()
                    ] ||
                    0}
                </span>
              </button>
            );
          })}
        </nav>
      )}
      {imageScans ? (
        filteredFindings?.length > 0 ? (
          <ul className="grid gap-2 h-52 content-start dark:bg-panel overflow-y-auto scrollbar">
            <li className="sticky top-0 flex items-center justify-between px-4 py-2 -mb-2 font-medium dark:text-checkbox dark:bg-card">
              <h4>CVE</h4>
              <h4 className="w-1/3">Package</h4>
            </li>
            {filteredFindings.map((scan: Finding, index: number) => {
              const cvssScore = Number(
                scan.attributes.find(
                  (attribute: KeyStringVal) => attribute.Key === "CVSS2_SCORE"
                )?.Value
              );
              const cvssVector = scan.attributes
                .find(
                  (attribute: KeyStringVal) => attribute.Key === "CVSS2_VECTOR"
                )
                ?.Value.split("/");

              return (
                <Fragment key={index}>
                  <li
                    className="flex items-center justify-between px-4 py-2 -mb-2 dark:bg-card dark:even:bg-panel dark:hover:bg-filter duration-100 cursor-pointer"
                    onClick={() => setCurCVE(scan.cve_name)}
                  >
                    <h4>{scan.cve_name}</h4>
                    <h4 className="w-1/3 truncate">
                      {
                        scan.attributes?.find(
                          (k: { Key: string; Value: string }) =>
                            k.Key === "package_name"
                        )?.Value
                      }
                    </h4>
                  </li>
                  <ModalLayout
                    showModal={scan.cve_name === curCVE}
                    onClose={handleOnClose}
                  >
                    <header className="flex items-center gap-5">
                      <h4 className="text-lg dark:text-white">
                        {scan.cve_name}
                      </h4>
                      <p className="mt-1 text-xs dark:text-checkbox">
                        {scan.uri}
                      </p>
                    </header>
                    <section className="flex flex-wrap items-start justify-between gap-5 mt-5 mr-5 overflow-auto scrollbar">
                      <article className="grid gap-3 w-4/6 text-sm">
                        <article className="flex flex-wrap items-center gap-x-10 gap-y-2">
                          <article className="grid gap-2">
                            {scan.attributes?.map(
                              (attribute: { [key: string]: string }) => {
                                if (
                                  ["CVSS2_SCORE", "CVSS2_VECTOR"].includes(
                                    attribute.Key
                                  )
                                )
                                  return null;
                                else
                                  return (
                                    <KeyValuePair
                                      key={attribute.Value}
                                      label={attribute.Key.replace("_", " ")}
                                      value={attribute.Value}
                                    />
                                  );
                              }
                            )}
                          </article>
                          <article className="flex items-center gap-2">
                            <h4 className="dark:text-checkbox">CVSS2 Score:</h4>
                            <span
                              className={`py-2 px-3 border-2 ${
                                cvssScore > 3.3
                                  ? cvssScore > 6.7
                                    ? "dark:border-critical"
                                    : "dark:border-medium"
                                  : "dark:border-low"
                              } rounded-md`}
                            >
                              {cvssScore === -1 ? "N/A" : cvssScore}
                            </span>
                          </article>
                        </article>
                        <article className="flex items-center gap-2">
                          <h4 className="dark:text-checkbox">CVSS2 Vector:</h4>
                          <ul className="flex items-center gap-1 break-all">
                            {cvssVector?.map(
                              (metricValue: string, index: number) => {
                                const metric = cvssMetadata?.find(
                                  (obj: { key: string }) =>
                                    obj.key ===
                                    metricValue.split(":")[0].toLowerCase()
                                )?.value;
                                const value = cvssMetadata?.find(
                                  (obj: { key: string }) =>
                                    obj.key === metricValue.toLowerCase()
                                )?.value;
                                return (
                                  <li
                                    key={metricValue}
                                    className="relative group flex items-center gap-2 cursor-pointer"
                                  >
                                    <p className="flex items-center gap-2">
                                      <span className="px-2 py-1 w-max dark:bg-info">
                                        {metricValue}
                                      </span>
                                      {index < cvssVector.length - 1 && (
                                        <span className="dark:text-checkbox">
                                          /
                                        </span>
                                      )}
                                    </p>
                                    {metric && (
                                      <article className="absolute top-8 left-2 hidden group-hover:block">
                                        <svg
                                          width="23"
                                          height="23"
                                          viewBox="0 0 23 23"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M11.3132 22.6282L22.627 11.3145L11.3132 0.00074482L-0.000463486 11.3145L11.3132 22.6282Z"
                                            fill="#23394F"
                                          />
                                        </svg>
                                        <p className="absolute top-3 -left-10 grid gap-2 p-4 w-[15rem] dark:bg-tooltip">
                                          {metric}: {value}
                                        </p>
                                      </article>
                                    )}
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </article>
                        <p
                          className={`w-4/5 text-sm overflow-auto scrollbar ${
                            showMore
                              ? "h-max"
                              : "max-h-20 text-ellipsis overflow-hidden"
                          }`}
                        >
                          {scan.description}{" "}
                        </p>
                        <button
                          className="text-left text-xs dark:text-checkbox dark:text-checkbox/60 duration-100"
                          onClick={() => setShowMore(!showMore)}
                        >
                          Show {showMore ? "less" : "more"}
                        </button>
                      </article>
                      {cveInfo && (
                        <>
                          <CVEImpact cveInfo={cveInfo} />
                          <VulnerabilityTree
                            selectedNodeID={selectedNodeID}
                            curCVE={curCVE}
                            selectedRepo={selectedRepo}
                            setSelectedRepo={setSelectedRepo}
                            selectedImage={selectedImage}
                            setSelectedImage={setSelectedImage}
                          />
                        </>
                      )}
                    </section>
                  </ModalLayout>
                </Fragment>
              );
            })}
          </ul>
        ) : (
          <p>No findings available</p>
        )
      ) : null}
    </ExpandedViewLayout>
  );
};

export default CRI;
