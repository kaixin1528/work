import React, { useState } from "react";
import Table from "./Table";
import Loader from "src/components/Loader/Loader";
import { GetGRCTables } from "src/services/grc";
import BIA from "./BIA/BIA";
import TableTabs from "./TableTabs";

const Tables = ({ sopID, versionID }: { sopID: string; versionID: string }) => {
  const { data: tables, status: tableStatus } = GetGRCTables(sopID);

  const [filter, setFilter] = useState("All Tables");

  const filteredTables =
    filter === "Tables to Export"
      ? tables?.filter((table: any) => table.marked_in_activity)
      : tables;

  return (
    <section className="flex flex-col flex-grow gap-5">
      <TableTabs filter={filter} setFilter={setFilter} />
      {filter === "Tables to Export" && <BIA versionID={versionID} />}
      <span className="text-base">{filteredTables?.length} tables found</span>
      {tableStatus === "loading" ? (
        <Loader />
      ) : (
        filteredTables?.map((table: any, index: number) => {
          if (
            table.data?.length === 0 ||
            Object.keys(table.data[0]).length === 0 ||
            (Object.keys(table.data[0]).length === 1 &&
              table.data[0]["0"] === "")
          )
            return null;
          return (
            <Table
              key={index}
              sopID={sopID}
              versionID={versionID}
              table={table}
            />
          );
        })
      )}
    </section>
  );
};

export default Tables;
