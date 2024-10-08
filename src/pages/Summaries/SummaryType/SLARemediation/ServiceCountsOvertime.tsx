/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Tooltip } from "recharts";
import CustomInfoTooltip from "src/components/Chart/Tooltip/CustomInfoTooltip";
import TextFilter from "src/components/Filter/General/TextFilter";
import {
  GetSLAServiceActivityStatus,
  GetSLAServiceCountsBySeverity,
  GetSLAServices,
} from "src/services/summaries/sla-remediation";
import { KeyStringVal } from "src/types/general";
import { convertToDate, convertToMicrosec } from "src/utils/general";
import Detail from "./Detail";
import GeneralTemporalDatepicker from "src/components/Datepicker/GeneralTemporalDatepicker";
import StackedAreaChart from "src/components/Chart/StackedAreaChart";
import { attributeColors } from "src/constants/general";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ServiceCountsOvertime = ({
  selectedSource,
  selectedVersion,
  selectedIntegrationType,
  selectedSourceAccountID,
  selectedService,
  setSelectedService,
}: {
  selectedSource: string;
  selectedVersion: string;
  selectedIntegrationType: string;
  selectedSourceAccountID: string;
  selectedService: string;
  setSelectedService: (selectedService: string) => void;
}) => {
  const [sectionProps, setSectionProps] = useState<any>({});
  const [temporalStartDate, setTemporalStartDate] = useState<Date>(
    convertToDate((Date.now() - 8.64e7) * 1000)
  );
  const [temporalEndDate, setTemporalEndDate] = useState<Date>(new Date());
  const [applyTime, setApplyTime] = useState<boolean>(false);
  const [selectedScanTime, setSelectedScanTime] = useState<number>(0);
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [selectedType, setSelectedType] = useState("violations");

  const startTime = convertToMicrosec(temporalStartDate);
  const endTime = convertToMicrosec(temporalEndDate);

  const { data: services } = GetSLAServices(
    selectedSource,
    selectedVersion,
    selectedIntegrationType,
    selectedSourceAccountID
  );
  const { data: serviceCounts } = GetSLAServiceCountsBySeverity(
    selectedSource,
    selectedVersion,
    selectedIntegrationType,
    selectedSourceAccountID,
    selectedService,
    startTime,
    endTime,
    applyTime
  );
  const { data: serviceActivityStatus } = GetSLAServiceActivityStatus(
    selectedIntegrationType,
    selectedSourceAccountID,
    selectedService
  );

  const imageGroupIDs = services?.find(
    (account: KeyStringVal) =>
      selectedIntegrationType === account.integration_type &&
      selectedSourceAccountID === account.source_account_id
  )?.services;
  const earliestTime =
    (convertToDate(serviceCounts?.start_time_global).setUTCHours(24, 0, 0, 0) -
      8.64e7) *
    1000;
  const latestTime =
    convertToDate(serviceCounts?.end_time_global).setUTCHours(24, 0, 0, 0) *
    1000;

  useEffect(() => {
    if (imageGroupIDs?.length > 0 && selectedService === "")
      setSelectedService(imageGroupIDs[0]);
  }, [imageGroupIDs, selectedService]);

  useEffect(() => {
    if (serviceCounts?.counts.length > 0 && selectedScanTime === 0) {
      setSelectedScanTime(serviceCounts?.counts[0].timestamp);
      setTemporalStartDate(convertToDate(earliestTime));
      setTemporalEndDate(convertToDate(latestTime));
    }
  }, [serviceCounts, selectedService]);

  useEffect(() => {
    if (selectedService !== "") {
      setSelectedService("");
      setSelectedScanTime(0);
      setSelectedSeverity("critical");
      setSelectedType("violations");
      setTemporalStartDate(new Date());
      setTemporalEndDate(new Date());
    }
  }, [
    selectedSource,
    selectedVersion,
    selectedIntegrationType,
    selectedSourceAccountID,
  ]);

  useEffect(() => {
    setSelectedScanTime(0);
    setSelectedSeverity("critical");
    setSelectedType("violations");
  }, [selectedService]);

  useEffect(() => {
    setApplyTime(false);
  }, [temporalStartDate, temporalEndDate]);

  return (
    <section className="grid gap-10">
      {services ? (
        imageGroupIDs?.length > 0 ? (
          <section className="grid gap-5">
            <article className="flex flex-wrap items-center gap-2">
              {serviceActivityStatus && (
                <>
                  <article className="group relative flex flex-wrap items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCircleInfo}
                      className="w-3 h-3 dark:text-checkbox z-0 focus:outline-none"
                    />
                    <p className="hidden group-hover:block absolute top-6 left-0 p-3 w-max text-left text-sm dark:text-white dark:bg-filter black-shadow rounded-sm z-10">
                      Any Grouping ID that has not been scanned over{" "}
                      {serviceActivityStatus.open_for_time}{" "}
                      {serviceActivityStatus.unit_of_measure} is{" "}
                      <span className={`mr-1 ${attributeColors.stale}`}>
                        STALE{" "}
                      </span>
                      , otherwise it is{" "}
                      <span className={`${attributeColors.active}`}>
                        ACTIVE
                      </span>
                    </p>
                  </article>
                  <span
                    className={`text-sm ${
                      attributeColors[
                        serviceActivityStatus?.status.toLowerCase()
                      ]
                    }`}
                  >
                    {serviceActivityStatus?.status}
                  </span>
                </>
              )}

              <TextFilter
                label={
                  selectedIntegrationType !== "InsightVM"
                    ? "Resource Grouping"
                    : "Asset"
                }
                list={imageGroupIDs}
                value={selectedService}
                setValue={setSelectedService}
                width="w-[50rem]"
                searchable
              />
            </article>
            <article className="flex items-center gap-5">
              <GeneralTemporalDatepicker
                temporalStartDate={temporalStartDate}
                setTemporalStartDate={setTemporalStartDate}
                temporalEndDate={temporalEndDate}
                setTemporalEndDate={setTemporalEndDate}
                earliest={earliestTime}
                latest={latestTime}
              />
              <button
                className="px-4 py-2 text-xs dark:text-signin dark:hover:text-signin/70 border dark:border-signin dark:hover:border-signin/70 duration-100 rounded-sm"
                onClick={() => setApplyTime(true)}
              >
                Apply
              </button>
              <button
                className="px-4 py-2 text-xs red-button border dark:border-reset dark:hover:border-reset/70 duration-100 rounded-sm"
                onClick={() => {
                  setTemporalStartDate(new Date());
                  setTemporalEndDate(new Date());
                  setApplyTime(false);
                }}
              >
                Reset
              </button>
            </article>

            <StackedAreaChart
              title="Severity Across All Scans"
              data={serviceCounts?.counts}
              xKey="timestamp"
              xLabel="Scan End Time"
              yLabel="Count"
              hasSeverity
              sectionProps={sectionProps}
              setSectionProps={setSectionProps}
            >
              <Tooltip
                content={
                  <CustomInfoTooltip
                    details={serviceCounts?.ranges}
                    hasSeverity
                  />
                }
              />
            </StackedAreaChart>
          </section>
        ) : (
          <p>No data available</p>
        )
      ) : null}
      {selectedService !== "" && serviceCounts?.counts?.length > 0 && (
        <Detail
          selectedSource={selectedSource}
          selectedVersion={selectedVersion}
          selectedIntegrationType={selectedIntegrationType}
          selectedSourceAccountID={selectedSourceAccountID}
          selectedService={selectedService}
          earliestTime={convertToMicrosec(temporalStartDate)}
          latestTime={convertToMicrosec(temporalEndDate)}
          selectedSeverity={selectedSeverity}
          setSelectedSeverity={setSelectedSeverity}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      )}
    </section>
  );
};

export default ServiceCountsOvertime;
