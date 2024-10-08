import React from "react";
import SortColumn from "src/components/Button/SortColumn";
import { ListHeader, SortRows } from "../types/general";

const ListLayout: React.FC<{
  listHeader: ListHeader[];
  setSort?: (sort: SortRows) => void;
  height?: string;
  excludeSortCols?: string[];
  hideSticky?: boolean;
}> = ({
  height,
  listHeader,
  setSort,
  excludeSortCols,
  hideSticky,
  children,
}) => {
  return (
    <section
      className={`flex flex-col flex-grow content-start w-full ${
        height ? height : "max-h-96"
      } text-sm dark:bg-panel overflow-auto scrollbar`}
    >
      <table className="h-full table-fixed text-left overflow-y-auto scrollbar">
        <thead
          className={`${
            !hideSticky ? "sticky -top-1.5" : ""
          } z-10 bg-gradient-to-b dark:from-expand dark:to-table-header`}
        >
          <tr>
            {listHeader?.map((label: ListHeader) => (
              <th key={label.property_name} className="p-3">
                <article className="flex items-center justify-between gap-8 capitalize">
                  <h4>{label.display_name}</h4>
                  {setSort &&
                    !excludeSortCols?.includes(label.property_name) && (
                      <SortColumn
                        propertyName={label.property_name}
                        setSort={setSort}
                      />
                    )}
                </article>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </section>
  );
};

export default ListLayout;
