import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { severityColors } from "src/constants/summaries";
import ModalLayout from "src/layouts/ModalLayout";
import { GetCVEListForVendor } from "src/services/summaries/vuln-by-vendor";
import { KeyStringVal } from "src/types/general";

const CVEListForVendor = ({
  selectedType,
  vendor,
  cveCount,
}: {
  selectedType: string;
  vendor: string;
  cveCount: number;
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [cveQuery, setCVEQuery] = useState<string>("");

  const { data: cveList } = GetCVEListForVendor(selectedType, vendor, show);

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

  const handleOnClose = () => setShow(false);

  return (
    <>
      <button
        className="flex items-center gap-2 text-xs"
        onClick={() => setShow(true)}
      >
        <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
        <h4>View {cveCount} CVEs</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-5 mt-2 w-full max-h-[15rem] overflow-auto scrollbar">
          <input
            type="filter"
            autoComplete="off"
            spellCheck="false"
            placeholder="Search for CVE"
            value={cveQuery}
            onChange={(e) => setCVEQuery(e.target.value)}
            className="px-5 w-full h-8 text-xs placeholder:text-secondary placeholder:text-xs placeholder:font-medium dark:text-white dark:disabled:cursor-not-allowed border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none dark:bg-search rounded-sm"
          />
          <h4>{cveCount} CVEs</h4>
          <ul className="flex flex-wrap justify-between gap-5 px-3 py-2 w-full h-full overflow-auto scrollbar">
            {severities?.map((severity) => {
              const cves = filteredCVEs?.filter(
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
      </ModalLayout>
    </>
  );
};

export default CVEListForVendor;
