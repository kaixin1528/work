/* eslint-disable react-hooks/exhaustive-deps */
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { utcFormat } from "d3-time-format";
import { Fragment, useEffect, useState } from "react";
import StackedAreaChart from "src/components/Chart/StackedAreaChart";
import KeyValuePair from "src/components/General/KeyValuePair";
import { initialSort } from "src/constants/general";
import { severityColors } from "src/constants/summaries";
import ListLayout from "src/layouts/ListLayout";
import {
  GetCCEvolution,
  GetCCEvolutionValues,
  GetCCSummary,
} from "src/services/summaries/cloud-controls";
import { useSummaryStore } from "src/stores/summaries";
import { KeyStringVal, ListHeader } from "src/types/general";
import { convertToDate, sortNumericData, sortRows } from "src/utils/general";

const AssessmentOverview = ({
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedService,
  setSelectedService,
}: {
  selectedCategory: string;
  setSelectedCategory: (selectedCategory: string) => void;
  selectedStatus: string;
  setSelectedStatus: (selectedStatus: string) => void;
  selectedService: string;
  setSelectedService: (selectedService: string) => void;
}) => {
  const { selectedReportAccount } = useSummaryStore();

  const [sort, setSort] = useState(initialSort);
  const [selectedExpanded, setSelectedExpanded] = useState<string>("");
  const [sectionProps, setSectionProps] = useState({});

  const integrationType = selectedReportAccount?.integration_type || "";
  const sourceAccountID = selectedReportAccount?.customer_cloud_id || "";

  const { data: summary } = GetCCSummary(integrationType, sourceAccountID);
  const { data: evolutionValues } = GetCCEvolutionValues(
    integrationType,
    sourceAccountID
  );
  const { data: evolution } = GetCCEvolution(
    integrationType,
    sourceAccountID,
    selectedExpanded.split("+")[0],
    selectedExpanded.split("+")[1]
  );

  const services = evolutionValues && Object.keys(evolutionValues);
  const sortedServices =
    summary?.data.length > 0
      ? sortRows(summary.data[0].details_by_service, sort)
      : [];
  const filteredServices =
    selectedCategory === "status"
      ? sortedServices?.filter(
          (service: KeyStringVal) => service.status === selectedStatus
        )
      : sortedServices?.filter(
          (service: KeyStringVal) => service.service_name === selectedService
        );

  const handleCloseExpandedView = () => setSelectedExpanded("");

  useEffect(() => {
    setSelectedService("");
  }, [selectedReportAccount]);

  useEffect(() => {
    if (selectedCategory === "status") setSelectedStatus("FAIL");
  }, [selectedCategory]);

  useEffect(() => {
    if (
      services?.length > 0 &&
      selectedCategory === "service_name" &&
      selectedService === ""
    )
      setSelectedService(services[0]);
  }, [services]);

  return (
    <section className="grid gap-5 p-4 dark:bg-card black-shadow">
      <h4 className="underlined-label">Assesment Overview</h4>
      <header className="flex items-center gap-5 text-sm">
        {summary?.data.length > 0 && (
          <KeyValuePair
            label="Assessment run at"
            value={`${utcFormat("%b %d %Y %H:%M")(
              convertToDate(summary.data[0].assessment_time_musecs)
            )} UTC`}
          />
        )}
      </header>
      <article className="grid gap-3 text-sm">
        <article className="flex items-center gap-5">
          {["status", "service_name"].map((category) => {
            return (
              <button
                key={category}
                className={`px-2 py-1 capitalize ${
                  selectedCategory === category
                    ? "dark:bg-admin/60 border dark:border-admin"
                    : "dark:hover:bg-admin/60 duration-100"
                } rounded-md`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.replace("_", " ")}
              </button>
            );
          })}
        </article>
        {selectedCategory === "status" ? (
          <nav className="flex items-center gap-2 py-2 w-full text-sm overflow-auto scrollbar">
            {["FAIL", "PASS"].map((status: string) => (
              <button
                key={status}
                className={`px-2 py-1 w-max ${
                  status.toLowerCase() === "fail"
                    ? "text-reset"
                    : status.toLowerCase() === "pass"
                    ? "text-contact"
                    : ""
                } ${
                  selectedStatus === status
                    ? "border dark:border-signin"
                    : "hover:border dark:hover:border-signin/60"
                } rounded-md`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </button>
            ))}
          </nav>
        ) : (
          <nav className="flex items-center gap-2 py-2 w-full overflow-auto scrollbar">
            {services?.map((service: string) => (
              <button
                key={service}
                className={`px-2 py-1 w-max ${
                  selectedService === service
                    ? "selected-button"
                    : "dark:hover:bg-signin/30"
                } rounded-md`}
                onClick={() => setSelectedService(service)}
              >
                {service}
              </button>
            ))}
          </nav>
        )}
      </article>
      <ListLayout
        height="max-h-[20rem]"
        listHeader={summary?.metadata.headers}
        setSort={setSort}
      >
        {filteredServices?.map((service: KeyStringVal, index: number) => {
          const expandedID = `${service.service_name}+${service.status}`;
          const diff = summary?.diff.find(
            (curService: KeyStringVal) =>
              curService.svc === service.service_name &&
              curService.status === service.status
          );
          return (
            <Fragment key={index}>
              <tr
                className={`px-3 py-2 cursor-pointer ${
                  selectedExpanded === expandedID
                    ? "dark:bg-expand border-b dark:border-filter/80"
                    : "dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70 dark:hover:bg-gradient-to-b dark:hover:from-expand dark:hover:to-filter/60"
                }`}
                onClick={(e) => {
                  if (document.getSelection()?.type === "Range")
                    e.preventDefault();
                  else {
                    if (selectedExpanded === expandedID)
                      handleCloseExpandedView();
                    else {
                      setSelectedExpanded(expandedID);
                    }
                  }
                }}
              >
                {summary?.metadata.headers.map(
                  (col: ListHeader, colIndex: number) => {
                    return (
                      <td
                        key={col.property_name}
                        className={`relative pl-3 py-2 w-max ${
                          String(service[col.property_name]).toLowerCase() ===
                          "fail"
                            ? "text-reset"
                            : String(
                                service[col.property_name]
                              ).toLowerCase() === "pass"
                            ? "text-contact"
                            : ""
                        }`}
                      >
                        {service[col.property_name]}
                        {colIndex === summary?.metadata.headers.length - 1 && (
                          <button className="absolute right-5 top-1/3 w-3 h-3 dark:hover:text-clear dark:text-checkbox duration-100 justify-self-end cursor-pointer">
                            <FontAwesomeIcon
                              icon={
                                selectedExpanded === expandedID
                                  ? faChevronUp
                                  : faChevronDown
                              }
                            />
                          </button>
                        )}
                      </td>
                    );
                  }
                )}
              </tr>
              {selectedExpanded === expandedID && (
                <tr
                  key={`${expandedID}-expanded`}
                  className="relative py-5 px-10 gap-10 bg-gradient-to-b dark:from-expand dark:to-expand/60"
                >
                  <td
                    colSpan={summary?.metadata.headers.length}
                    className="p-5 w-5"
                  >
                    <section className="relative grid grid-cols-1 gap-10 w-full pb-5 pr-20">
                      {diff && (
                        <section className="grid gap-3">
                          <KeyValuePair
                            label="Delta since last run"
                            value={diff.count}
                          />
                          <ul className="flex items-center gap-10 w-full">
                            {Object.entries(diff).map((keyVal: any) => {
                              if (
                                ["svc", "status", "count"].includes(keyVal[0])
                              )
                                return null;
                              return (
                                <li
                                  key={keyVal[0]}
                                  className={`grid gap-2 px-4 py-1 w-full text-center capitalize ${
                                    severityColors[keyVal[0].toLowerCase()]
                                  }`}
                                >
                                  <h4>{keyVal[0]}</h4>
                                  <span>{keyVal[1]}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </section>
                      )}
                      <StackedAreaChart
                        data={sortNumericData(evolution, "timestamp", "asc")}
                        xKey="timestamp"
                        yLabel="Count"
                        sectionProps={sectionProps}
                        setSectionProps={setSectionProps}
                      />
                    </section>
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </ListLayout>
    </section>
  );
};

export default AssessmentOverview;
