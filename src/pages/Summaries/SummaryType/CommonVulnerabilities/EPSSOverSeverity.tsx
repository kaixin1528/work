/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  Label,
  YAxis,
  Tooltip,
  Scatter,
  ZAxis,
} from "recharts";
import CustomTooltip from "src/components/Chart/Tooltip/CustomTooltip";
import { GetEPSSOverSeverity } from "src/services/summaries/common-vulnerabilities";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { KeyNumVal } from "src/types/general";

const EPSSOverSeverity = ({
  selectedVersion,
  selectedSeverity,
  selectedYear,
}: {
  selectedVersion: string;
  selectedSeverity: string;
  selectedYear: string;
}) => {
  const navigate = useNavigate();

  const [minY, setMinY] = useState<number>(0);
  const [maxY, setMaxY] = useState<number>(1);
  const [minX, setMinX] = useState<number>(Infinity);
  const [maxX, setMaxX] = useState<number>(-Infinity);
  const [filter, setFilter] = useState<boolean>(false);
  const [epssInfo, setEpssInfo] = useState<KeyNumVal>({
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
  });

  const epss = GetEPSSOverSeverity();

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (epss?.data) {
      setFilteredData(epss?.data);
      if (epssInfo.minX === Infinity && epssInfo.maxX === -Infinity) {
        const epssScores = epss?.data.reduce(
          (pV: number[], cV: KeyNumVal) => [...pV, cV.epss],
          []
        );
        const severityScores = epss?.data.reduce(
          (pV: number[], cV: KeyNumVal) => [...pV, cV.severity_score],
          []
        );
        const curMinY = Math.min(...epssScores);
        const curMaxY = Math.max(...epssScores);
        const curMinX = Math.min(...severityScores);
        const curMaxX = Math.max(...severityScores);
        setMinY(curMinY);
        setMaxY(curMaxY);
        setMinX(curMinX);
        setMaxX(curMaxX);
        setEpssInfo({
          minX: curMinX,
          maxX: curMaxX,
          minY: curMinY,
          maxY: curMaxY,
        });
      }
    }
  }, [epss, selectedYear]);

  useEffect(() => {
    setEpssInfo({
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    });
    setFilter(false);
    if (selectedYear !== "")
      epss.mutate({
        version: selectedVersion,
        severity: selectedSeverity,
        year: selectedYear,
        minY: 0,
        maxY: 1,
      });
  }, [selectedYear]);

  return (
    <>
      {epss ? (
        <section className="grid gap-5 p-4 w-full h-[22rem]">
          <header className="flex items-center gap-5">
            <h4>EPSS Over Severity</h4>
            {filter && (
              <button
                className="px-2 py-1 dark:bg-signin/30 dark:hover:bg-signin/60 duration-100 border dark:border-signin"
                onClick={() => {
                  epss.mutate(
                    {
                      version: selectedVersion,
                      severity: selectedSeverity,
                      year: selectedYear,
                      minX: minX,
                      maxX: maxX,
                      minY: minY,
                      maxY: maxY,
                    },
                    {
                      onSuccess: () => {
                        if (epss?.data) {
                          setFilteredData(epss.data);
                          setFilter(false);
                          const epssScores = epss.data.reduce(
                            (pV: number[], cV: KeyNumVal) => [...pV, cV.epss],
                            []
                          );
                          const severityScores = epss.data.reduce(
                            (pV: number[], cV: KeyNumVal) => [
                              ...pV,
                              cV.severity_score,
                            ],
                            []
                          );
                          const curMinY = Math.min(...epssScores);
                          const curMaxY = Math.max(...epssScores);
                          const curMinX = Math.min(...severityScores);
                          const curMaxX = Math.max(...severityScores);
                          setMinY(curMinY);
                          setMaxY(curMaxY);
                          setMinX(curMinX);
                          setMaxX(curMaxX);
                          setEpssInfo({
                            minX: curMinX,
                            maxX: curMaxX,
                            minY: curMinY,
                            maxY: curMaxY,
                          });
                        }
                      },
                    }
                  );
                }}
              >
                Filter
              </button>
            )}
            <button
              className="px-4 py-2 text-xs red-button border dark:border-reset dark:hover:border-reset/70 duration-100 rounded-sm"
              onClick={() => {
                epss.mutate(
                  {
                    version: selectedVersion,
                    severity: selectedSeverity,
                    year: selectedYear,
                    minY: 0,
                    maxY: 1,
                  },
                  {
                    onSuccess: (data) => {
                      setFilteredData(data);
                      setFilter(false);
                      setMinY(0);
                      setMaxY(1);
                      const curMinX = Math.min(
                        ...data.reduce(
                          (pV: number[], cV: KeyNumVal) => [
                            ...pV,
                            cV.severity_score,
                          ],
                          []
                        )
                      );
                      const curMaxX = Math.max(
                        ...data.reduce(
                          (pV: number[], cV: KeyNumVal) => [
                            ...pV,
                            cV.severity_score,
                          ],
                          []
                        )
                      );
                      setMinX(curMinX);
                      setMaxX(curMaxX);
                      setEpssInfo({
                        minX: Infinity,
                        maxX: -Infinity,
                        minY: Infinity,
                        maxY: -Infinity,
                      });
                    },
                  }
                );
              }}
            >
              Reset
            </button>
          </header>
          <section className="flex items-center gap-5">
            {epssInfo.minY !== Infinity && epssInfo.maxY !== -Infinity && (
              <RangeSlider
                className="vertical-slider"
                orientation={"vertical"}
                min={epssInfo.minY}
                max={epssInfo.maxY}
                step={0.001}
                defaultValue={[epssInfo.minY, epssInfo.maxY]}
                onInput={(e: any) => {
                  setMinY(1 - e[1]);
                  setMaxY(1 - e[0]);
                  setFilter(true);
                }}
              />
            )}
            <section className="grid gap-5 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 10,
                    left: 20,
                  }}
                >
                  <CartesianGrid style={{ color: "white", opacity: 0.1 }} />
                  <XAxis
                    type="number"
                    dataKey="severity_score"
                    domain={["dataMin", "dataMax"]}
                    name="Severity"
                    tick={{ fill: "white" }}
                    style={{
                      fontSize: "0.75rem",
                    }}
                  >
                    <Label
                      style={{
                        textAnchor: "middle",
                        fontSize: "0.65rem",
                        fill: "white",
                      }}
                      value="Severity"
                      position="inside"
                      dy={20}
                    />
                  </XAxis>
                  <YAxis
                    type="number"
                    dataKey="epss"
                    name="EPSS Score"
                    tick={{ fill: "white" }}
                    style={{
                      fontSize: "0.75rem",
                    }}
                  >
                    <Label
                      style={{
                        textAnchor: "middle",
                        fontSize: "0.65rem",
                        fill: "white",
                      }}
                      value="EPSS Score"
                      position="insideLeft"
                      angle={-90}
                    />
                  </YAxis>
                  <Tooltip
                    content={
                      <CustomTooltip
                        keys={
                          epss?.data?.length > 0
                            ? Object.keys(epss?.data[0])
                            : []
                        }
                      />
                    }
                  />
                  <ZAxis dataKey="cve" />
                  <Scatter
                    data={filteredData}
                    fill="url(#colorUv)"
                    onClick={(e) => navigate(`/cves/details?cve_id=${e.cve}`)}
                  />
                  <defs>
                    <linearGradient id="colorUv" x1="1" y1="1" x2="0" y2="0">
                      <stop
                        offset="30%"
                        stopColor="#6584FF"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#FFFFFF"
                        stopOpacity={0.5}
                      />
                    </linearGradient>
                    <linearGradient id="colorUv" x1="1" y1="1" x2="0" y2="0">
                      <stop
                        offset="30%"
                        stopColor="#6584FF"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#FFFFFF"
                        stopOpacity={0.5}
                      />
                    </linearGradient>
                  </defs>
                </ScatterChart>
              </ResponsiveContainer>
              {epssInfo.minX !== Infinity && epssInfo.maxX !== -Infinity && (
                <RangeSlider
                  id="range-slider-yellow"
                  min={epssInfo.minX}
                  max={epssInfo.maxX}
                  step={0.01}
                  defaultValue={[epssInfo.minX, epssInfo.maxX]}
                  onInput={(e: any) => {
                    setMinX(e[0]);
                    setMaxX(e[1]);
                    setFilter(true);
                  }}
                />
              )}
            </section>
          </section>
        </section>
      ) : null}
    </>
  );
};

export default EPSSOverSeverity;
