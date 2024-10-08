import React from "react";

const Columns = ({
  label,
  headers,
  sheet,
  selectedHeaders,
  setSelectedHeaders,
  selectedSOPCol,
  setSelectedSOPCol,
}: {
  label: string;
  headers: any;
  sheet: any;
  selectedHeaders: any;
  setSelectedHeaders: any;
  selectedSOPCol?: string;
  setSelectedSOPCol?: (selectedSOPCol: string) => void;
}) => {
  const filteredHeaders =
    label === "All" ? headers[sheet] : selectedHeaders[sheet];

  return (
    <section className="grid content-start gap-3 overflow-auto scrollbar">
      <h4 className="full-underlined-label">{label} Columns</h4>
      {label === "Selected" && filteredHeaders?.length > 0 && (
        <span>Selected SOP Column: {selectedSOPCol}</span>
      )}
      <ul className="grid content-start gap-1 h-[10rem] overflow-auto scrollbar">
        {filteredHeaders?.map((col: string, colIndex: number) => {
          if (col === "--row_id--") return null;
          return (
            <li
              key={colIndex}
              className="flex items-center gap-2 text-left font-semibold"
            >
              <input
                type="checkbox"
                checked={selectedHeaders[sheet]?.includes(col)}
                onChange={() => {
                  if (selectedHeaders[sheet]?.includes(col))
                    setSelectedHeaders({
                      ...selectedHeaders,
                      [sheet]: selectedHeaders[sheet].filter(
                        (curCol: string) => curCol !== col
                      ),
                    });
                  else
                    setSelectedHeaders({
                      ...selectedHeaders,
                      [sheet]: [...(selectedHeaders[sheet] || []), col],
                    });
                }}
                className="form-checkbox w-4 h-4 dark:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50 rounded-full"
              />
              <article
                className={`${
                  label === "Selected" && selectedSOPCol !== col
                    ? "group relative $ cursor-pointer dark:hover:bg-signin/30 duration-100"
                    : ""
                }`}
                onClick={() => {
                  if (setSelectedSOPCol) setSelectedSOPCol(col);
                }}
              >
                <p>{col}</p>
                {label === "Selected" && selectedSOPCol !== col && (
                  <span className="hidden group-hover:block absolute top-5 left-1/2 p-2 w-max dark:bg-no rounded-md z-10">
                    Choose as SOP Column
                  </span>
                )}
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Columns;
