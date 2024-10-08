/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react";
import {
  severityColors,
  severityMapping,
} from "../../../../constants/summaries";
import { sortTextData } from "../../../../utils/general";
import { KeyStringVal } from "src/types/general";
import { GetLayeredCake } from "src/services/summaries/layered-cake";
import { useSummaryStore } from "src/stores/summaries";

const CVEList = ({
  selectedLayer,
  selectedSeverity,
  selectedCVE,
  setSelectedCVE,
}: {
  selectedLayer: string;
  selectedSeverity: string;
  selectedCVE: string;
  setSelectedCVE: (selectedCVE: string) => void;
}) => {
  const { period, selectedReportAccount } = useSummaryStore();

  const [query, setQuery] = useState<string>("");

  const { data: layeredCake } = GetLayeredCake(
    period,
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || ""
  );

  const layerSeverity = layeredCake?.data.data_points.find(
    (obj: { category_id: string; severity: string }) =>
      obj.category_id === selectedLayer && obj.severity === selectedSeverity
  );

  const filteredCVEList = layerSeverity?.list_of_cves.filter(
    (cve: KeyStringVal) => {
      return cve.cve_id
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(query.toLowerCase().replace(/\s+/g, ""));
    }
  );

  const sortedCVEList = sortTextData(filteredCVEList, "cve_id", "desc");

  useEffect(() => {
    if (sortedCVEList?.length > 0 && selectedCVE === "")
      setSelectedCVE(sortedCVEList[0].cve_id);
  }, [sortedCVEList]);

  return (
    <section className="grid content-start gap-5 w-full h-full">
      {sortedCVEList && (
        <article className="grid gap-5">
          <header className="flex items-center gap-3 w-max">
            {layeredCake && (
              <p
                className={`px-4 pt-2 w-max h-10 break-all ${
                  severityColors[selectedSeverity.toLowerCase()]
                }`}
              >
                {layerSeverity?.count}
              </p>
            )}
            <h4 className="font-medium">
              {severityMapping[selectedSeverity]} CVEs - {selectedLayer} Layer
            </h4>
          </header>

          {/* search by cve name */}
          <article className="flex items-center gap-2 px-4 dark:bg-account border-l dark:border-signin">
            <img
              src="/general/search.svg"
              alt="search"
              className="w-5 h-5 mr-2"
            />

            <input
              type="input"
              value={query}
              spellCheck="false"
              autoComplete="off"
              placeholder="Search CVE"
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 placeholder:text-sm text-sm dark:placeholder:text-filter dark:bg-account focus:outline-none border-none "
            />
          </article>

          <section className="flex flex-wrap content-start gap-2 w-full overflow-auto scrollbar">
            {sortedCVEList.map((cve: KeyStringVal) => (
              <a
                key={cve.cve_id}
                href={`/cves/details?cve_id=${cve.cve_id}`}
                className={`px-2 py-1 h-max ${
                  severityColors[selectedSeverity.toLowerCase()]
                }`}
              >
                {cve.cve_id}
              </a>
            ))}
          </section>
        </article>
      )}
    </section>
  );
};

export default CVEList;
