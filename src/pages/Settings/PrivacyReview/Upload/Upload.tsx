import React, { useState } from "react";
import NewDPA from "./NewDPA";
import TablePagination from "src/components/General/TablePagination";
import { GetDPAList } from "src/services/settings/privacy-review/upload";
import { pageSize } from "src/constants/general";
import DeleteDPA from "./DeleteDPA";
import Sections from "./Sections";
import { KeyStringVal } from "src/types/general";

const Upload = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedDPA, setSelectedDPA] = useState<KeyStringVal>({
    id: "",
    title: "",
  });

  const { data: dpaList } = GetDPAList(pageNumber);

  const totalCount = dpaList?.pager.total_results || 0;
  const totalPages = dpaList?.pager.num_pages || 0;
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="grid content-start gap-5">
      {selectedDPA.id !== "" ? (
        <Sections selectedDPA={selectedDPA} setSelectedDPA={setSelectedDPA} />
      ) : (
        <>
          <NewDPA />
          <TablePagination
            totalPages={totalPages}
            beginning={beginning}
            end={end}
            totalCount={totalCount}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
          {dpaList ? (
            dpaList.data.length > 0 ? (
              <ul className="flex flex-col flex-grow gap-3 pb-2 overflow-auto scrollbar">
                {dpaList?.data.map((dpa: any, index: number) => {
                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between gap-10 p-4 w-full cursor-pointer break-words text-left text-base bg-gradient-to-r dark:from-admin/70 dark:to-white/10 dark:hover:to-white/30 rounded-md"
                      onClick={() => setSelectedDPA(dpa)}
                    >
                      <h4 className="text-xl font-medium">{dpa.title}</h4>
                      <DeleteDPA dpaID={dpa.id} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No DPA available</p>
            )
          ) : null}
        </>
      )}
    </section>
  );
};

export default Upload;
