/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useEffect } from "react";
import { severityColors } from "../../../../constants/summaries";
import { GetLayeredCake } from "src/services/summaries/layered-cake";
import { useSummaryStore } from "src/stores/summaries";
import { KeyStringVal } from "src/types/general";
import { sortNumericData } from "src/utils/general";

const Layers = ({
  selectedLayer,
  selectedSeverity,
  setSelectedLayer,
  setSelectedSeverity,
  setSelectedCVE,
}: {
  selectedLayer: string;
  selectedSeverity: string;
  setSelectedLayer: (selectedLayer: string) => void;
  setSelectedSeverity: (selectedSeverity: string) => void;
  setSelectedCVE: (selectedCVE: string) => void;
}) => {
  const { period, selectedReportAccount } = useSummaryStore();

  const { data: layeredCake } = GetLayeredCake(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || ""
  );

  useEffect(() => {
    if (
      layeredCake?.data.data_points.length > 0 &&
      selectedLayer === "" &&
      selectedSeverity === ""
    ) {
      const firstLayer = layeredCake.data.data_points[0].category_id;
      setSelectedLayer(firstLayer);
      setSelectedSeverity("CRITICAL");
    }
  }, [layeredCake]);

  const categories = [
    ...new Set(
      layeredCake?.data.data_points.reduce(
        (pV: string[], cV: { category_id: string }) => [...pV, cV.category_id],
        []
      )
    ),
  ] as string[];

  return (
    <ul className="grid gap-5 p-6 text-sm dark:bg-card black-shadow">
      {layeredCake ? (
        categories.length > 0 ? (
          categories.map((layer: string) => {
            const curLayerCounts = layeredCake?.data.data_points.filter(
              (obj: { category_id: string }) => obj.category_id === layer
            );
            const sortedLayers = sortNumericData(
              curLayerCounts,
              "order",
              "desc"
            );
            return (
              <li key={layer} className="grid gap-3 capitalize">
                <h4 className="font-medium">{layer} Layer</h4>
                <article
                  className={`grid md:grid-cols-6 gap-5 p-4 cursor-pointer ${
                    selectedLayer === layer && selectedSeverity !== ""
                      ? "dark:bg-tooltip border-l dark:border-signin"
                      : ""
                  } rounded-2xl`}
                >
                  {sortedLayers?.map((obj: KeyStringVal) => {
                    return (
                      <article
                        key={obj.severity}
                        className={`grid place-content-center p-2 w-full text-center break-all ${
                          severityColors[obj.severity.toLowerCase()]
                        } ${
                          selectedLayer === layer &&
                          selectedSeverity === obj.severity
                            ? "outer-ring"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedLayer(layer);
                          setSelectedSeverity(obj.severity);
                          setSelectedCVE("");
                        }}
                      >
                        <h4 className="break-all">{obj.severity}</h4>
                        <p>{obj.count}</p>
                      </article>
                    );
                  })}
                </article>
              </li>
            );
          })
        ) : (
          <p>No data available</p>
        )
      ) : null}
    </ul>
  );
};

export default Layers;
