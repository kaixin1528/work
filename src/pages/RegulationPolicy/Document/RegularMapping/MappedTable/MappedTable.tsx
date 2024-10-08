import React, { useState } from "react";
import ListLayout from "src/layouts/ListLayout";
import MappingRowDetail from "./MappingRowDetail";
import { KeyStringVal, SortRows } from "src/types/general";
import { sortRows } from "src/utils/general";
import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";

const MappedTable = ({ mapping, filters }: { mapping: any; filters: any }) => {
  const [sort, setSort] = useState<SortRows>({
    order: "desc",
    orderBy: "ip_score",
  });

  const filteredList = mapping?.data.filter(
    (section: KeyStringVal) =>
      !filters.includes(section.policy_name || section.framework_name)
  );
  const sortedList = filteredList && sortRows(filteredList, sort);

  return (
    <section className="grid gap-5 m-4">
      <section
        className={`grid gap-3 p-4 bg-gradient-to-r ${
          sessionStorage.document_type === "frameworks"
            ? "dark:from-checkbox/70 dark:to-white/10"
            : "dark:from-admin/70 dark:to-white/10"
        } rounded-2xl`}
      >
        {sessionStorage.section_title && (
          <h4>{sessionStorage.section_title}</h4>
        )}
        <span>
          {sessionStorage.sub_section_id} {sessionStorage.sub_section_title}
        </span>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={open ? faChevronCircleDown : faChevronCircleRight}
                  className="dark:text-black"
                />
                <h4>{open ? "Hide" : "Show"} content</h4>
              </Disclosure.Button>
              <Disclosure.Panel className="grid gap-2 p-3 break-words dark:bg-black/60 rounded-md">
                <p>
                  {sessionStorage.content
                    .split("\n")
                    .map((phrase: string, index: number) => (
                      <span key={index}>{phrase}</span>
                    ))}
                </p>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </section>
      {mapping.data.length > 0 ? (
        <ListLayout
          height="max-h-[80rem]"
          listHeader={mapping?.header}
          setSort={setSort}
        >
          {sortedList?.map((row: any, index: number) => {
            return (
              <MappingRowDetail
                key={index}
                mapping={mapping}
                row={row}
                index={index}
              />
            );
          })}
        </ListLayout>
      ) : (
        <p>No mappings found</p>
      )}
    </section>
  );
};

export default MappedTable;
