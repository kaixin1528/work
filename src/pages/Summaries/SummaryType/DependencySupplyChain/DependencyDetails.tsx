import { faFlag, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { utcFormat } from "d3-time-format";
import React, { Fragment } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  ReferenceLine,
} from "recharts";
import ModalLayout from "../../../../layouts/ModalLayout";
import KeyValuePair from "../../../../components/General/KeyValuePair";
import {
  convertToDate,
  convertToUTCString,
  sortNumericData,
} from "src/utils/general";
import { useNavigate } from "react-router-dom";
import { GetDependencyDetails } from "src/services/summaries/dependency-supply-chain";
import { useSummaryStore } from "src/stores/summaries";

const versionColors = [
  "#7993B0",
  "#FCEE21",
  "#22B573",
  "#F87415",
  "#FF0000",
  "#870A0A",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <section className="grid px-4 py-2 gap-2 text-xs dark:bg-filter">
        {payload.map((entry: any, index: number) => {
          return (
            <article key={index} className="grid gap-2">
              <p>{convertToUTCString(entry.payload.timestamp)}</p>
              <h4>Versions</h4>
              <ul className="grid px-4 max-h-40 list-disc overflow-auto scrollbar">
                {entry.payload.version.map((version: string) => {
                  return <li key={version}>{version}</li>;
                })}
              </ul>
            </article>
          );
        })}
      </section>
    );
  }

  return null;
};

const CustomizedLabel = ({ props, marker }: any) => {
  const { x, y } = props.viewBox;
  return (
    <g>
      <foreignObject
        x={x - 35}
        y={y - 10}
        width={70}
        height={100}
        style={{ border: "none" }}
      >
        <article className="group text-center">
          <FontAwesomeIcon
            icon={marker.type === "release" ? faFlag : faTag}
            className="w-3 h-3 mt-2 dark:text-white"
          />
          <p className="hidden group-hover:block p-2 text-xs w-full break-all dark:bg-tooltip rounded-sm">
            {marker.name}
          </p>
        </article>
      </foreignObject>
    </g>
  );
};

const DependencyDetails = ({
  selectedOrg,
  selectedRepo,
  selectedBranch,
  selectedPackageManager,
  dependency,
  selectedDependency,
  setSelectedDependency,
}: {
  selectedOrg: string;
  selectedRepo: string;
  selectedBranch: string;
  selectedPackageManager: string;
  dependency: string;
  selectedDependency: string;
  setSelectedDependency: (selectedDependency: string) => void;
}) => {
  const navigate = useNavigate();

  const { period } = useSummaryStore();

  const { data: getDependencyDetails } = GetDependencyDetails(
    period,
    "GITHUB",
    selectedOrg,
    selectedRepo,
    selectedBranch,
    selectedPackageManager,
    dependency
  );

  const handleOnClose = () => {
    setSelectedDependency("");
  };

  const filteredData =
    getDependencyDetails?.data?.length === 1
      ? [
          getDependencyDetails?.data[0],
          {
            timestamp: Date.now() * 1000,
            value: 150,
            version: [getDependencyDetails?.data[0].version[0]],
          },
        ]
      : sortNumericData(getDependencyDetails?.data, "timestamp", "asc");

  const minTimestamp = filteredData?.length > 0 ? filteredData[0].timestamp : 0;
  const maxTimestamp =
    filteredData?.length > 0
      ? filteredData[filteredData.length - 1].timestamp
      : 0;

  const timestamps = filteredData?.reduce(
    (pV: number[], cV: any) => [...pV, cV.timestamp],
    []
  );

  const CustomTick = (props: any) => {
    const { x, y, payload } = props.props;

    const versions = filteredData?.find(
      (d: { timestamp: number }) => d.timestamp === payload.value
    )?.version;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="start"
          fill="#fff"
          fontSize="0.65rem"
        >
          {utcFormat("%m/%d/%y")(convertToDate(payload.value))}
        </text>
        {versions.slice(0, 2).map((version: string, index: number) => {
          return (
            <text
              key={version}
              x={0}
              y={0}
              dy={32 + index * 12}
              textAnchor="start"
              fill="#fff"
              fontSize="0.65rem"
            >
              {version}
            </text>
          );
        })}
        {versions.length > 2 && (
          <text
            x={0}
            y={0}
            dy={56}
            textAnchor="start"
            fill="#fff"
            fontSize="0.65rem"
          >
            ...
          </text>
        )}
      </g>
    );
  };

  return (
    <ModalLayout
      showModal={selectedDependency === dependency}
      onClose={handleOnClose}
    >
      {getDependencyDetails && (
        <section className="grid gap-5">
          <header className="grid gap-1">
            <h4 className="text-base">{dependency}</h4>
            <a
              href={getDependencyDetails.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-xs dark:text-checkbox hover:underline"
            >
              {getDependencyDetails.source_url}
            </a>
          </header>

          <section className="grid lg:flex items-start gap-5 pr-10">
            <section className="grid content-start gap-5 w-full">
              {/* dependency details */}
              <section className="grid lg:grid-cols-2 gap-x-10 gap-y-3">
                <KeyValuePair
                  label="Author"
                  value={getDependencyDetails.author || "N/A"}
                />
                <KeyValuePair
                  label="Latest Version"
                  value={getDependencyDetails.latest_version || "N/A"}
                />
                <KeyValuePair
                  label="Latest Version in Use"
                  value={getDependencyDetails.latest_version_in_use || "N/A"}
                />
              </section>

              {/* version history */}
              <section className="grid grid-cols-1 w-full h-[15rem]">
                <h4 className="dark:text-checkbox">Version History</h4>
                {filteredData?.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={filteredData}
                      margin={{
                        top: 20,
                        right: 0,
                        bottom: 40,
                        left: 0,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="versions"
                          x1="0"
                          y1="0"
                          x2="100%"
                          y2="0"
                        >
                          {filteredData
                            .slice(0, -1)
                            .map((d: any, index: number) => {
                              const start =
                                ((d.timestamp - minTimestamp) /
                                  (maxTimestamp - minTimestamp)) *
                                100;
                              const end =
                                ((filteredData[index + 1].timestamp -
                                  minTimestamp) /
                                  (maxTimestamp - minTimestamp)) *
                                100;
                              return (
                                <Fragment key={index}>
                                  <stop
                                    offset={`${start}%`}
                                    stopColor={versionColors[index]}
                                  />
                                  <stop
                                    offset={`${end}%`}
                                    stopColor={versionColors[index]}
                                  />
                                </Fragment>
                              );
                            })}
                        </linearGradient>
                      </defs>
                      <Area
                        type="linear"
                        dataKey="value"
                        stroke="url(#versions)"
                        fillOpacity={1}
                        fill="url(#versions)"
                      />

                      <Tooltip content={<CustomTooltip />} />

                      <XAxis
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        dataKey="timestamp"
                        tick={(props) => <CustomTick props={props} />}
                        ticks={timestamps}
                        interval="preserveStartEnd"
                        tickLine={{ stroke: "white" }}
                        style={{
                          fontSize: "0.65rem",
                        }}
                      />

                      {getDependencyDetails.markers?.map((marker: any) => {
                        return (
                          <ReferenceLine
                            key={`${marker.timestamp}-${marker.name}`}
                            x={marker.timestamp}
                            stroke="white"
                            label={(props) => (
                              <CustomizedLabel
                                props={props}
                                marker={marker}
                                middleTimestamp={
                                  getDependencyDetails.data[
                                    Math.floor(
                                      getDependencyDetails.data.length / 2
                                    )
                                  ]?.timestamp
                                }
                              />
                            )}
                          />
                        );
                      })}
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </section>
            </section>

            {/* cve list */}
            {getDependencyDetails.cves.length > 0 && (
              <section className="grid content-start gap-3">
                <h4 className="dark:text-checkbox">CVE</h4>
                <ul className="grid px-4 list-disc w-full max-h-[15rem] overflow-auto scrollbar">
                  {getDependencyDetails.cves.map((cve: string) => {
                    return (
                      <li
                        key={cve}
                        className="w-max hover:underline dark:hover:text-signin cursor-pointer"
                        onClick={() => navigate(`/cves/details?cve_id=${cve}`)}
                      >
                        {cve}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </section>
        </section>
      )}
    </ModalLayout>
  );
};

export default DependencyDetails;
