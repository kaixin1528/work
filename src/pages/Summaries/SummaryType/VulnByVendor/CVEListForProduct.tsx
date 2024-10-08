import React, { useState } from "react";
import { severityColors } from "src/constants/summaries";
import { GetCVEListForProduct } from "src/services/summaries/vuln-by-vendor";
import { KeyStringVal } from "src/types/general";

const CVEListForProduct = ({
  selectedType,
  selectedVendor,
  selectedProduct,
  selectedCVEVersion,
}: {
  selectedType: string;
  selectedVendor: string;
  selectedProduct: string;
  selectedCVEVersion: string;
}) => {
  const [cveQuery, setCVEQuery] = useState<string>("");

  const { data: cveList } = GetCVEListForProduct(
    selectedType,
    selectedVendor,
    selectedProduct,
    selectedCVEVersion
  );

  const filteredCVEs =
    cveQuery !== ""
      ? cveList?.filter((cve: KeyStringVal) =>
          cve.cve_id
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(cveQuery.toLowerCase().replace(/\s+/g, ""))
        )
      : cveList;
  const severities = [
    ...new Set(
      cveList?.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.severity.toLowerCase()],
        []
      )
    ),
  ] as string[];

  return (
    <>
      {filteredCVEs && (
        <section className="col-span-5 grid content-start gap-5 w-full max-h-[20rem] overflow-auto scrollbar">
          <h3 className="text-xl">
            {filteredCVEs?.length} CVEs from &lt;{selectedProduct}&gt;{" "}
          </h3>
          <input
            type="filter"
            autoComplete="off"
            spellCheck="false"
            placeholder="Search for CVE"
            value={cveQuery}
            onChange={(e) => setCVEQuery(e.target.value)}
            className="px-5 w-full h-8 text-xs placeholder:text-secondary placeholder:text-xs placeholder:font-medium dark:text-white dark:disabled:cursor-not-allowed border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none dark:bg-search rounded-sm"
          />
          <ul className="flex flex-wrap justify-between gap-5 px-3 py-2 w-full h-full overflow-auto scrollbar">
            {severities.map((severity) => {
              const cves = filteredCVEs.filter(
                (cve: KeyStringVal) => cve.severity.toLowerCase() === severity
              );
              return (
                <li
                  key={severity}
                  className="flex flex-col flex-grow gap-2 overflow-auto scrollbar"
                >
                  {cves?.map((cve: KeyStringVal, index: number) => (
                    <a
                      key={index}
                      href={`/cves/details?cve_id=${cve.cve_id}`}
                      className={`px-2 py-1 h-max ${
                        severityColors[cve.severity.toLowerCase()]
                      }`}
                    >
                      {cve.cve_id}
                    </a>
                  ))}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
};

export default CVEListForProduct;
