import {
  faCheck,
  faPlus,
  faRotateBackward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import { pageSize } from "src/constants/general";
import {
  FilterFrameworks,
  GetAvailableFrameworks,
  GetFrameworks,
} from "src/services/regulation-policy/framework";
import { KeyStringVal } from "src/types/general";

const SelectFrameworks = ({
  regAuth,
  setSelectFramework,
}: {
  regAuth: string;
  setSelectFramework: (selectFramework: boolean) => void;
}) => {
  const [selectedFrameworkIDs, setSelectedFrameworkIDs] = useState<string[]>(
    []
  );
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: availableFrameworks } = GetAvailableFrameworks(pageNumber);
  const { data: customerFrameworks } = GetFrameworks();
  const filterFrameworks = FilterFrameworks();

  const totalCount = availableFrameworks?.data.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    if (customerFrameworks?.data?.length > 0) {
      const frameworkIDs = customerFrameworks?.data?.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.id],
        []
      );
      setSelectedFrameworkIDs(frameworkIDs);
    }
  }, [customerFrameworks, regAuth]);

  return (
    <section className="grid content-start gap-5 py-4 h-full overflow-auto scrollbar">
      <header className="flex items-center gap-5">
        <button
          className="flex items-center gap-1 dark:text-checkbox dark:hover:text-checkbox/30 duration-100"
          onClick={() => {
            sessionStorage.removeItem("select_framework");
            setSelectFramework(false);
          }}
        >
          <FontAwesomeIcon icon={faRotateBackward} />
          Return
        </button>
        <h3 className="flex items-center gap-2 text-lg">
          <FontAwesomeIcon icon={faPlus} />
          Select Frameworks
        </h3>
      </header>
      <TablePagination
        totalPages={totalPages}
        beginning={beginning}
        end={end}
        totalCount={totalCount}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
      />
      {availableFrameworks ? (
        availableFrameworks.data.length > 0 ? (
          <ul className="flex flex-col flex-grow gap-3 pb-4 w-full h-[20rem] overflow-auto scrollbar">
            {availableFrameworks?.data.map(
              (framework: KeyStringVal, index: number) => {
                const selected = selectedFrameworkIDs.includes(framework.id);
                return (
                  <li
                    key={index}
                    className={`flex items-start justify-between gap-20 p-4 break-words cursor-pointer font-extralight text-left text-base dark:text-white dark:bg-list dark:hover:bg-filter/30 black-shadow ${
                      selected ? "border-2 dark:border-no" : ""
                    }`}
                    onClick={() => {
                      if (!selected)
                        setSelectedFrameworkIDs([
                          ...selectedFrameworkIDs,
                          framework.id,
                        ]);
                      else
                        setSelectedFrameworkIDs(
                          selectedFrameworkIDs.filter(
                            (id) => id !== framework.id
                          )
                        );
                    }}
                  >
                    <article className="flex items-start gap-2 w-3/5">
                      {selected && (
                        <FontAwesomeIcon icon={faCheck} className="text-no" />
                      )}
                      <img
                        src={framework.thumbnail_uri}
                        alt={framework.regulatory_authority}
                        className="w-6 h-6 rounded-full"
                      />
                      <h4 className="font-medium">{framework.name}</h4>
                    </article>
                    <span>{framework.regulatory_authority}</span>
                  </li>
                );
              }
            )}
          </ul>
        ) : (
          <p>No frameworks available</p>
        )
      ) : null}
      <button
        disabled={selectedFrameworkIDs.length === 0}
        className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white dark:disabled:grey-gradient-button green-gradient-button rounded-sm"
        onClick={() => {
          filterFrameworks.mutate({
            frameworkIDs: selectedFrameworkIDs,
          });
        }}
      >
        Done
      </button>
    </section>
  );
};

export default SelectFrameworks;
