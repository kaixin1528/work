import {
  faArrowDown,
  faArrowUp,
  faCheck,
  faExclamation,
  faSkullCrossbones,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useState } from "react";
import KeyValuePair from "src/components/General/KeyValuePair";
import { attributeColors, pageSize } from "src/constants/general";
import { riskLevelColors } from "src/constants/summaries";
import { parseURL, sortNumericData } from "src/utils/general";
import ReactJson from "react-json-view";
import { KeyStringVal } from "src/types/general";
import TablePagination from "src/components/General/TablePagination";
import {
  GetPAEvolution,
  GetPostureAssessmentServiceDetails,
  GetPostureAssessmentSummary,
} from "src/services/summaries/posture-assessment";
import StackedAreaChart from "src/components/Chart/StackedAreaChart";
import AreaLineChart from "src/components/Chart/AreaLineChart";

const ServiceDetails = ({
  integrationType,
  sourceAccountID,
  service,
}: {
  integrationType: string;
  sourceAccountID: string;
  service: string;
}) => {
  const parsed = parseURL();

  const { data: postureAssessmentSummary } = GetPostureAssessmentSummary(
    integrationType,
    sourceAccountID
  );
  const { data: serviceDetails } = GetPostureAssessmentServiceDetails(
    String(parsed.service_name)
  );
  const { data: evolution } = GetPAEvolution(
    integrationType,
    sourceAccountID,
    service
  );

  const [filter, setFilter] = useState<string[]>(["good", "warning", "danger"]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [inventorySectionProps, setInventorySectionProps] = useState({});
  const [checkedSectionProps, setCheckedSectionProps] = useState({});

  const filteredServiceDetails = serviceDetails?.data.filter(
    (item: KeyStringVal) => filter.includes(item.level.toLowerCase())
  );
  const totalCount = filteredServiceDetails?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;
  const diff = postureAssessmentSummary?.diff.find(
    (data: KeyStringVal) => data.service_name === service
  );

  const checks = sortNumericData(evolution?.checks, "record_time", "asc");

  return (
    <section className="grid gap-10">
      <h5 className="py-2 px-4 mx-auto w-max text-sm selected-button">
        {parsed.service_name}
      </h5>
      {diff && (
        <section className="grid gap-2">
          <h4>Delta since last run</h4>
          <ul className="flex items-center gap-5 text-sm">
            {Object.entries(diff).map((keyVal: any) => {
              if (keyVal[0].includes("service")) return null;
              return (
                <li key={keyVal[0]} className="flex items-center gap-2">
                  <h4 className="capitalize dark:text-checkbox">
                    {keyVal[0].replaceAll("_", " ")}
                  </h4>
                  <article
                    className={`flex items-center gap-1 ${
                      keyVal[1] > 0
                        ? "dark:text-no"
                        : keyVal[1] < 0
                        ? "dark:text-reset"
                        : "dark:text-gray-500"
                    }`}
                  >
                    <p>{keyVal[1]}</p>
                    {keyVal[1] !== 0 && (
                      <FontAwesomeIcon
                        icon={keyVal[1] > 0 ? faArrowUp : faArrowDown}
                        className="w-3 h-3"
                      />
                    )}
                  </article>
                  {keyVal[1] === 0 && (
                    <span className="dark:text-gray-500">—</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
      {evolution && (
        <section className="grid gap-10">
          <StackedAreaChart
            data={sortNumericData(evolution.inventory, "record_time", "asc")}
            title="Inventory over time"
            xKey="record_time"
            yLabel="Count"
            sectionProps={inventorySectionProps}
            setSectionProps={setInventorySectionProps}
          />
          <AreaLineChart
            data={checks}
            title="Checked vs Flagged over time"
            xKey="record_time"
            areaKey="checked_items"
            lineKey="flagged_items"
            yLabel="Count"
            sectionProps={checkedSectionProps}
            setSectionProps={setCheckedSectionProps}
          />
        </section>
      )}
      {serviceDetails ? (
        serviceDetails.data.length > 0 ? (
          <section className="grid gap-5">
            <header className="flex items-center gap-5 justify-between">
              <article className="flex items-center gap-5">
                <h4>
                  {filteredServiceDetails?.length} finding
                  {filteredServiceDetails?.length !== 1 && "s"} found
                </h4>
                <ul className="flex items-center gap-5 mx-auto">
                  {["good", "warning", "danger"].map((level: string) => {
                    return (
                      <li
                        key={level}
                        className={`flex items-center gap-2 py-1 px-4 text-sm capitalize cursor-pointer ${
                          filter.includes(level)
                            ? attributeColors[level]
                            : "dark:hover:bg-signin/30"
                        } rounded-sm`}
                        onClick={() => {
                          if (filter.includes(level))
                            setFilter(
                              filter.filter(
                                (curLevel) => curLevel !== level.toLowerCase()
                              )
                            );
                          else setFilter([...filter, level.toLowerCase()]);
                        }}
                      >
                        {level === "good" ? (
                          <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                        ) : level === "warning" ? (
                          <FontAwesomeIcon
                            icon={faExclamation}
                            className="w-3 h-3"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faSkullCrossbones}
                            className="w-3 h-3"
                          />
                        )}
                        <span>{level}</span>
                      </li>
                    );
                  })}
                </ul>
              </article>
              <TablePagination
                totalPages={totalPages}
                beginning={beginning}
                end={end}
                totalCount={totalCount}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
            </header>
            <ul className="grid divide-y dark:divide-signin/30 overflow-auto scrollbar">
              {filteredServiceDetails
                .slice(beginning - 1, end + 1)
                .map((item: any, index: number) => {
                  return (
                    <Disclosure key={`${item.assessment_id}-${index}`}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full justify-between px-4 py-2 text-left text-sm font-medium dark:bg-filter/60 focus:outline-none">
                            <header className="flex items-center gap-2">
                              <span
                                className={`py-1 px-4 ${
                                  riskLevelColors[item.level.toLowerCase()]
                                } rounded-full`}
                              >
                                {item.level === "good" ? (
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    className="w-3 h-3"
                                  />
                                ) : item.level === "warning" ? (
                                  <FontAwesomeIcon
                                    icon={faExclamation}
                                    className="w-3 h-3"
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    icon={faSkullCrossbones}
                                    className="w-3 h-3"
                                  />
                                )}
                              </span>
                              <h4>{item.description || item.finding_title}</h4>
                            </header>
                            <ChevronDownIcon
                              className={`${
                                open ? "rotate-180 transform" : ""
                              } h-5 w-5 text-white`}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="grid gap-5 p-4 text-sm bg-gradient-to-b dark:from-expand dark:to-expand/60">
                            <p>{item.rationale}</p>

                            <article className="flex items-center gap-5">
                              <KeyValuePair
                                label="Checked Items"
                                value={item.checked_items}
                              />
                              <KeyValuePair
                                label="Flagged Items"
                                value={item.flagged_items}
                              />
                            </article>

                            {item.remediation && (
                              <section className="grid gap-3">
                                <h4 className="py-2 text-base full-underlined-label">
                                  Remediation
                                </h4>
                                <p>{item.remediation}</p>
                              </section>
                            )}

                            {item.compliance?.length > 0 && (
                              <section className="grid gap-3">
                                <h4 className="py-2 text-base full-underlined-label">
                                  GRC Copilot
                                </h4>
                                <ul className="grid gap-2 px-4 break-all list-disc">
                                  {item.compliance?.map(
                                    (compliance: KeyStringVal) => {
                                      return (
                                        <li
                                          key={`${compliance.name}-${compliance.version}-${compliance.reference}`}
                                          className="w-max"
                                        >
                                          <p className="break-all">
                                            {compliance.name} version{" "}
                                            {compliance.version}, reference{" "}
                                            {compliance.reference}
                                          </p>
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </section>
                            )}

                            {item.finding_references?.length > 0 && (
                              <section className="grid gap-3">
                                <h4 className="py-2 text-base full-underlined-label">
                                  References
                                </h4>
                                <ul className="grid gap-2 px-4 break-all list-disc">
                                  {item.finding_references?.map(
                                    (reference: string) => {
                                      return (
                                        <li
                                          key={reference}
                                          className="w-max hover:text-signin hover:underline"
                                        >
                                          <a
                                            href={reference}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {reference}
                                          </a>
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </section>
                            )}

                            {Object.keys(item.related_information).length >
                              0 && (
                              <section className="grid gap-3">
                                <h4 className="py-2 text-base full-underlined-label">
                                  Additional Information
                                </h4>
                                <ReactJson
                                  name={null}
                                  src={item.related_information}
                                  displayDataTypes={false}
                                  theme="harmonic"
                                  collapsed={2}
                                />
                              </section>
                            )}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  );
                })}
            </ul>
          </section>
        ) : (
          <p>No findings found</p>
        )
      ) : null}
    </section>
  );
};
export default ServiceDetails;
