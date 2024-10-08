import React from "react";
import Table from "./Table";
import Loader from "src/components/Loader/Loader";
import { GetGRCTables } from "src/services/grc";

const Tables = ({ documentID }: { documentID: string }) => {
  const { data: tables, status: tableStatus } = GetGRCTables(documentID);

  return (
    <section className="flex flex-col flex-grow gap-5">
      {tableStatus === "loading" ? (
        <Loader />
      ) : tables?.length > 0 ? (
        tables?.map((table: any, index: number) => {
          return <Table key={index} documentID={documentID} table={table} />;
        })
      ) : (
        <p>No tables found</p>
      )}
    </section>
  );
};

export default Tables;
