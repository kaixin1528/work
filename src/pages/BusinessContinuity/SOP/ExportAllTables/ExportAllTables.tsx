import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import {
  BulkExportBIA,
  GetSOPList,
} from "src/services/business-continuity/sop";
import { pageSize } from "src/constants/general";
import TablePagination from "src/components/General/TablePagination";
import SOPTables from "./SOPTables";

const ExportAllTables = ({
  selectedDepartment,
}: {
  selectedDepartment: string[];
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [headers, setHeaders] = useState<string[]>([]);
  const [tableIDs, setTableIDs] = useState<any>({});
  const [selectedHeader, setSelectedHeader] = useState<string[]>([]);

  const { data: sopList } = GetSOPList(selectedDepartment, pageNumber);

  const bulkExport = BulkExportBIA();

  const filteredSOPList = sopList?.data;
  const totalCount = filteredSOPList?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  const handleOnClose = () => setShow(false);

  return (
    <>
      <button
        disabled={selectedDepartment.length === 0}
        className="flex items-center place-self-end gap-2 px-8 py-2 mx-auto text-base dark:text-white disabled:grey-gradient-button green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setHeaders([]);
          setTableIDs({});
          setSelectedHeader([]);
        }}
      >
        <FontAwesomeIcon icon={faFileExport} />
        <h4>Export All Tables</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid content-start gap-3 h-[30rem] overflow-auto scrollbar">
          <article className="flex items-center gap-2 text-lg">
            <FontAwesomeIcon icon={faFileExport} />
            <h4>Export All Tables</h4>
          </article>
          <article>
            Department:{" "}
            {selectedDepartment.length > 0 ? selectedDepartment[0] : ""}
          </article>
          {selectedDepartment.length > 0 && (
            <>
              <section className="grid gap-3 overflow-auto scrollbar">
                <TablePagination
                  totalPages={totalPages}
                  beginning={beginning}
                  end={end}
                  totalCount={totalCount}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                />
                <section className="grid gap-5 overflow-auto scrollbar">
                  {filteredSOPList?.map((sop: any) => {
                    return (
                      <SOPTables
                        key={sop.latest_version_id}
                        sop={sop}
                        tableIDs={tableIDs}
                        setTableIDs={setTableIDs}
                        headers={headers}
                        setHeaders={setHeaders}
                        selectedHeader={selectedHeader}
                        setSelectedHeader={setSelectedHeader}
                      />
                    );
                  })}
                </section>
              </section>
              <button
                disabled={
                  Object.keys(tableIDs).length === 0 ||
                  headers.length === 0 ||
                  bulkExport.status === "loading"
                }
                className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white disabled:grey-gradient-button green-gradient-button rounded-sm"
                onClick={() => {
                  bulkExport.mutate(
                    {
                      tablesBySOP: tableIDs,
                      headers: headers,
                    },
                    {
                      onSuccess: () => handleOnClose(),
                    }
                  );
                }}
              >
                Export
              </button>
            </>
          )}
        </section>
      </ModalLayout>
    </>
  );
};

export default ExportAllTables;
