/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "./Table";
import {
  GetBIAExcelSheets,
  GetBIAMappings,
  GetMappedSOPs,
} from "src/services/business-continuity/bia";
import Loader from "src/components/Loader/Loader";
import { KeyStringVal } from "src/types/general";
import TablePagination from "src/components/General/TablePagination";
import { pageSize } from "src/constants/general";
import { Disclosure } from "@headlessui/react";
import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextFilter from "src/components/Filter/General/TextFilter";
import ExportFile from "./ExportFile";
import TableLayout from "src/layouts/TableLayout";

const Tables = ({ biaID }: { biaID: string }) => {
  const [selectedSOPVersionIDs, setSelectedSOPVersionIDs] = useState<string[]>(
    []
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedSOPName, setSelectedSOPName] = useState<string>("");

  const { data: tables, status: tableStatus } = GetBIAExcelSheets(biaID);
  const { data: mappedSOPs } = GetMappedSOPs(biaID, pageNumber);
  const { data: biaMappings, status: biaMappingStatus } = GetBIAMappings(
    biaID,
    selectedSOPVersionIDs
  );

  const sopNames = [
    ...new Set(
      mappedSOPs?.data.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.sop_name],
        []
      )
    ),
  ] as string[];

  const totalCount = mappedSOPs?.pager.total_results || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  const selectedSOPNames = biaMappings
    ? Object.keys(biaMappings.mappings).reduce((pV: string[], cV: string) => {
        const sopName = mappedSOPs?.data.find(
          (sop: KeyStringVal) => sop.sop_version_id === cV
        )?.sop_name;
        return [...pV, sopName];
      }, [])
    : ([] as string[]);
  const selectedSopVersionID =
    mappedSOPs?.data.find(
      (sop: KeyStringVal) => sop.sop_name === selectedSOPName
    )?.sop_version_id || "";

  const filteredBIAMappings =
    biaMappings &&
    selectedSopVersionID &&
    biaMappings["mappings"][selectedSopVersionID];
  const filteredBIAMatchedRows =
    biaMappings &&
    selectedSopVersionID &&
    biaMappings["sop_match_rows_by_sop"] &&
    biaMappings["sop_match_rows_by_sop"][selectedSopVersionID];

  useEffect(() => {
    if (mappedSOPs?.data.length > 0) {
      const sopVersionIDs = mappedSOPs.data.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.sop_version_id],
        []
      );
      setSelectedSOPVersionIDs(sopVersionIDs);
    }
  }, [mappedSOPs]);

  useEffect(() => {
    if (selectedSOPVersionIDs?.length > 0) {
      const sopName =
        mappedSOPs?.data.find(
          (sop: KeyStringVal) => sop.sop_version_id === selectedSOPVersionIDs[0]
        )?.sop_name || "";
      setSelectedSOPName(sopName);
    }
  }, [selectedSOPVersionIDs]);

  return (
    <section className="flex flex-col flex-grow gap-5">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center gap-2 w-max text-sm">
              <FontAwesomeIcon
                icon={open ? faChevronCircleDown : faChevronCircleRight}
                className="dark:text-checkbox"
              />
              <p>{open ? "Hide" : "Show"} SOPs</p>
            </Disclosure.Button>
            <Disclosure.Panel className="grid gap-5">
              {selectedSOPVersionIDs.length > 0 && (
                <ExportFile
                  biaID={biaID}
                  sopVersionIDs={selectedSOPVersionIDs}
                />
              )}
              <TablePagination
                totalPages={totalPages}
                beginning={beginning}
                end={end}
                totalCount={totalCount}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
              <ul className="grid gap-3 max-h-[30rem] overflow-auto scrollbar">
                {sopNames?.map((documentName: string, index: number) => {
                  const filteredSOPs = mappedSOPs?.data.filter(
                    (sop: KeyStringVal) => sop.sop_name === documentName
                  );

                  return (
                    <li
                      key={index}
                      className="grid gap-3 p-4 w-full break-words text-left text-base bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-md"
                    >
                      <h4 className="text-lg">{documentName}</h4>
                      <article className="flex flex-col flex-grow gap-3 p-2 overflow-auto scrollbar">
                        {filteredSOPs?.map((sop: any, index: number) => {
                          return (
                            <article
                              key={index}
                              className="grid gap-3 p-2 w-full break-words text-left text-base bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 border-2 dark:border-signin rounded-md"
                            >
                              <h4 className="text-sm">
                                Version {sop.sop_version}
                              </h4>
                            </article>
                          );
                        })}
                      </article>
                    </li>
                  );
                })}
              </ul>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {biaMappingStatus === "success" && (
        <section className="grid gap-3 mx-auto">
          <TableLayout fullHeight>
            <thead className="sticky -top-1.5 bg-gradient-to-b dark:from-expand dark:to-table-header">
              <tr className="text-sm text-left">
                <th className="px-4 py-3 font-medium">SOP Name</th>
                <th className="px-4 py-3 break-words font-medium">
                  BIA Rows Matched
                </th>
                <th className="px-4 py-3 break-words font-medium">
                  SOP Name Hits in BIA
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(biaMappings.num_of_mapped_rows_by_sop)?.map(
                (sopVersionID: string, index: number) => {
                  const sopName =
                    mappedSOPs?.data.find(
                      (sop: KeyStringVal) => sop.sop_version_id === sopVersionID
                    )?.sop_name || "";
                  const total =
                    tables &&
                    Object.values(tables.data).reduce(
                      (pV: number, cV: any) => pV + cV.length,
                      0
                    );

                  return (
                    <tr
                      key={index}
                      data-test="table-row"
                      className="relative gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70"
                    >
                      <td className="p-4 text-left break-all">{sopName}</td>
                      <td className="p-4 text-left break-all">
                        {biaMappings.num_of_mapped_rows_by_sop[sopVersionID]}{" "}
                        out of {total}
                      </td>
                      <td className="p-4 text-left break-all">
                        {biaMappings.sop_match_rows_by_sop[sopVersionID]
                          ?.length || 0}{" "}
                        out of {total}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </TableLayout>
        </section>
      )}

      {selectedSOPVersionIDs.length > 0 && (
        <article className="mx-auto">
          <TextFilter
            label="SOP"
            list={selectedSOPNames}
            value={selectedSOPName}
            setValue={setSelectedSOPName}
          />
        </article>
      )}

      {tableStatus === "loading" ? (
        <Loader />
      ) : (
        tables &&
        Object.entries(tables.data)?.map((keyVal: any, index: number) => {
          return (
            <Table
              key={index}
              tableName={keyVal[0]}
              table={keyVal[1]}
              biaMappings={filteredBIAMappings}
              biaMatchedRows={filteredBIAMatchedRows}
            />
          );
        })
      )}
    </section>
  );
};

export default Tables;
