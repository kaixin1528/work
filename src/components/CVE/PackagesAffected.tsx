import React, { Fragment, useState } from "react";
import { attributeColors, pageSize } from "src/constants/general";
import { GetCPEInfo, GetCVEDetail } from "src/services/general/cve";
import { KeyStringVal, ListHeader } from "src/types/general";
import TablePagination from "../General/TablePagination";
import TableLayout from "src/layouts/TableLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import KeyValuePair from "../General/KeyValuePair";

const PackagesAffected = ({ selectedCVE }: { selectedCVE: string }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedCPEID, setSelectedCPEID] = useState<string>("");

  const { data: cveDetail } = GetCVEDetail(selectedCVE);

  const cpeIDs = cveDetail?.data?.cve_configurations?.reduce(
    (pV: string[], cV: KeyStringVal) => [...pV, cV.cpe_criteria],
    []
  );
  const { data: cpeInfo } = GetCPEInfo(cpeIDs);

  const totalCount = cveDetail?.data?.cve_configurations?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;
  const selectedCPEInfo = cpeInfo?.data.find(
    (cpe: KeyStringVal) =>
      cpe.cpe_id === selectedCPEID.slice(0, selectedCPEID.indexOf("+"))
  );

  return (
    <section className="grid content-start gap-3 h-full text-xs">
      <h4 className="py-2 text-base full-underlined-label">
        Packages & Products Affected
      </h4>

      <TablePagination
        totalPages={totalPages}
        beginning={beginning}
        end={end}
        totalCount={totalCount}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
      />
      <TableLayout>
        <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
          <tr>
            {cveDetail.metadata?.configurations.map((col: ListHeader) => {
              return (
                <th
                  scope="col"
                  key={col.display_name}
                  className="py-3 px-5 text-left font-semibold"
                >
                  <article className="capitalize flex gap-10 justify-between">
                    <h4>{col.display_name}</h4>
                  </article>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {cveDetail?.data?.cve_configurations
            ?.slice(beginning - 1, end + 1)
            .map((row: any, rowIndex: number) => {
              return (
                <Fragment key={row.cpe_criteria}>
                  <tr
                    key={rowIndex}
                    className={`relative p-5 gap-3 break-words cursor-pointer ${
                      selectedCPEID.includes(row.cpe_criteria)
                        ? "dark:bg-expand border-b dark:border-filter/80"
                        : "dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70 dark:hover:bg-gradient-to-b dark:hover:from-expand dark:hover:to-filter/60"
                    }`}
                    onMouseUp={(e) => {
                      if (document.getSelection()?.type === "Range")
                        e.preventDefault();
                      else {
                        if (selectedCPEID.includes(row.cpe_criteria))
                          setSelectedCPEID("");
                        else
                          setSelectedCPEID(`${row.cpe_criteria}+${rowIndex}`);
                      }
                    }}
                  >
                    {cveDetail.metadata?.configurations.map(
                      (col: ListHeader, colIndex: number) => {
                        const isBoolean =
                          typeof row[col.property_name] === "boolean";

                        return (
                          <td
                            key={col.property_name}
                            className="py-2 px-3 h-max"
                          >
                            <p
                              className={`${
                                isBoolean
                                  ? row[col.property_name] === true
                                    ? attributeColors["false"]
                                    : attributeColors["true"]
                                  : ""
                              }`}
                            >
                              {String(row[col.property_name])}
                            </p>
                            {colIndex ===
                              cveDetail.metadata?.configurations.length - 1 && (
                              <button className="absolute right-5 top-1/3 w-6 h-6 dark:hover:text-clear dark:text-checkbox duration-100 justify-self-end cursor-pointer">
                                <FontAwesomeIcon
                                  icon={
                                    selectedCPEID.includes(row.cpe_criteria)
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
                  {selectedCPEID === `${row.cpe_criteria}+${rowIndex}` &&
                    selectedCPEInfo && (
                      <tr
                        key={`${row.cpe_criteria}-${rowIndex}-expanded`}
                        className="relative py-5 px-10 gap-10 bg-gradient-to-b dark:from-expand dark:to-expand/60"
                      >
                        <td
                          colSpan={cveDetail.metadata?.configurations.length}
                          className="p-5"
                        >
                          <section className="relative grid grid-cols-2 gap-5 py-5 w-full">
                            {Object.entries(selectedCPEInfo).map((keyVal) => {
                              return (
                                <KeyValuePair
                                  key={keyVal[0]}
                                  label={keyVal[0]}
                                  value={String(keyVal[1])}
                                />
                              );
                            })}
                          </section>
                        </td>
                      </tr>
                    )}
                </Fragment>
              );
            })}
        </tbody>
      </TableLayout>
    </section>
  );
};

export default PackagesAffected;
