import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";
import React, { useState } from "react";
import TablePagination from "src/components/General/TablePagination";
import Loader from "src/components/Loader/Loader";
import { pageSize } from "src/constants/general";
import {
  GetResponseMappings,
  TriggerResponseMappings,
} from "src/services/third-party-risk/vendors-and-partners/vendors";
import { KeyStringVal } from "src/types/general";

const ResponseMappings = ({ vendorID }: { vendorID: string }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: responseMappings, status: mappingsStatus } =
    GetResponseMappings(vendorID, 1);

  const triggerMappings = TriggerResponseMappings(vendorID);

  const totalCount = responseMappings?.pager.total_results || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            className="flex items-center gap-2"
            onClick={() => triggerMappings.mutate({})}
          >
            <FontAwesomeIcon
              icon={open ? faChevronCircleDown : faChevronCircleRight}
              className="dark:text-checkbox"
            />
            <p>{open ? "Hide" : "Show"} Mappings</p>
          </Disclosure.Button>
          <Disclosure.Panel>
            {mappingsStatus === "loading" ? (
              <Loader />
            ) : responseMappings?.data.length > 0 ? (
              <section className="flex flex-col flex-grow gap-5">
                <TablePagination
                  totalPages={totalPages}
                  beginning={beginning}
                  end={end}
                  totalCount={totalCount}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                />
                <ul className="flex flex-col flex-grow gap-5">
                  {responseMappings?.data.map(
                    (mapping: KeyStringVal, index: number) => {
                      return (
                        <li
                          key={index}
                          className="grid gap-3 p-5 w-full bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 rounded-md"
                        >
                          <header className="flex items-center justify-between gap-10 w-full border-b-1 dark:border-black">
                            <h4>{mapping.name}</h4>
                            <span>
                              {Number(mapping.distance).toFixed(2) * 100}%
                              Similarity
                            </span>
                          </header>
                          <p className="p-4 dark:bg-black rounded-md">
                            Q: {mapping.question}
                          </p>
                          <p className="p-4 dark:text-black dark:bg-yellow-500 rounded-md">
                            A: {mapping.response}
                          </p>
                          <article className="grid gap-1 mt-2">
                            <h4>Ideal Response</h4>
                            <p className="p-4 dark:bg-signin rounded-md">
                              {mapping.ideal_response}
                            </p>
                          </article>
                        </li>
                      );
                    }
                  )}
                </ul>
              </section>
            ) : (
              <section className="flex items-center place-content-center gap-10 w-full h-full">
                <img
                  src="/grc/frameworks-placeholder.svg"
                  alt="frameworks placeholder"
                  className="w-40 h-40"
                />
                <h4>No mappings available</h4>
              </section>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default ResponseMappings;
