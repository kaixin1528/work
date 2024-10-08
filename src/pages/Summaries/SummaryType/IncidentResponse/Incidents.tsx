import React, { useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import { pageSize } from "src/constants/general";
import IncidentDetail from "./IncidentDetail";
import { GetIRIncidents } from "src/services/summaries/incident-response";
import { KeyStringVal } from "src/types/general";

const Incidents = () => {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: details } = GetIRIncidents(pageNumber);

  const filteredIncidents =
    query !== ""
      ? details?.data.filter((incident: KeyStringVal) =>
          incident.title
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        )
      : details?.data;
  const totalCount = details?.pager.total_results || 0;
  const totalPages = details?.pager.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <section className="flex flex-col flex-grow content-start gap-5 w-full max-h-[70rem] overflow-auto scrollbar">
      <section className="flex items-start justify-between gap-10">
        <input
          id="autocomplete"
          type="filter"
          autoComplete="off"
          spellCheck="false"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-5 w-2/5 h-8 text-xs placeholder:text-secondary placeholder:text-xs placeholder:font-medium dark:text-white dark:disabled:cursor-not-allowed border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none dark:bg-search rounded-sm"
        />
        <TablePagination
          totalPages={totalPages}
          beginning={beginning}
          end={end}
          totalCount={totalCount}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </section>
      <ul className="grid gap-3 h-full overflow-auto scrollbar">
        {filteredIncidents?.map((incident: any) => {
          return (
            <IncidentDetail
              key={incident.id}
              incident={incident}
              selectedTickets={selectedTickets}
              setSelectedTickets={setSelectedTickets}
            />
          );
        })}
      </ul>
    </section>
  );
};

export default Incidents;
