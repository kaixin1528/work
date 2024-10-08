import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalLayout from "src/layouts/ModalLayout";
import TablePagination from "../General/TablePagination";
import { pageSize } from "src/constants/general";
import Loader from "../Loader/Loader";
import { VulnLookup } from "src/services/general/general";
import { KeyStringVal } from "src/types/general";
import parse from "html-react-parser";

const Vuln = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState<boolean>(false);
  const [selectedVulnType, setSelectedVulnType] = useState<string>("cve");
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);

  const results = VulnLookup();

  const totalCount = results.data?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  const handleSearchResults = () =>
    results.mutate({
      query: query,
      vulnType: selectedVulnType,
      pageNumber: pageNumber,
    });

  const handleOnClose = () => {
    setQuery("cve");
    setShow(false);
    results.reset();
  };

  return (
    <>
      <article className="group relative">
        <img
          src="/general/vuln.svg"
          alt="cve"
          className="w-7 h-7 cursor-pointer dark:text-checkbox dark:hover:text-checkbox/30 duration-100"
          onClick={() => {
            setQuery("");
            setSelectedVulnType("cve");
            setShow(!show);
          }}
        />
        <span className="hidden group-hover:block absolute top-10 right-0 p-2 w-max text-xs dark:bg-filter black-shadow rounded-sm z-20">
          Look up vulnerability
        </span>
      </article>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="grid gap-5 mt-10">
          <nav className="flex items-center gap-2">
            {["cve", "cwe"].map((vulnType) => {
              return (
                <button
                  key={vulnType}
                  className={`p-2 w-full uppercase ${
                    selectedVulnType === vulnType
                      ? "dark:bg-signin/10 border dark:border-signin"
                      : "dark:text-checkbox dark:hover:text-white duration-100 dark:bg-filter/10 border dark:border-filter"
                  }`}
                  onClick={() => {
                    setSelectedVulnType(vulnType);
                    setQuery("");
                    results.reset();
                  }}
                >
                  {vulnType}
                </button>
              );
            })}
          </nav>
          <section className="grid content-start gap-5 py-2 px-4 mb-5 dark:bg-search">
            <article className="flex items-center gap-2">
              <img src="/general/vuln.svg" alt="cve" className="w-7 h-7" />
              <article className="flex items-center p-2 w-full text-lg">
                <input
                  type="input"
                  autoComplete="off"
                  spellCheck="false"
                  value={query}
                  placeholder={`Search ${selectedVulnType.toUpperCase()} Id`}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPageNumber(1);
                  }}
                  onKeyUpCapture={(e) => {
                    if (e.key === "Enter") handleSearchResults();
                  }}
                  className="w-full h-full placeholder:text-secondary placeholder:text-lg placeholder:font-medium dark:text-white border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none dark:bg-search rounded-sm"
                />
                <button
                  disabled={query === ""}
                  className="px-4 dark:disabled:text-signin/30 dark:text-signin dark:hover:text-signin/60 duration-100"
                  onClick={() => handleSearchResults()}
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
              </article>
            </article>
          </section>
          {results.status === "loading" ? (
            <Loader />
          ) : results.data ? (
            results.data.length > 0 ? (
              <section className="grid gap-5">
                <TablePagination
                  totalPages={totalPages}
                  beginning={beginning}
                  end={end}
                  totalCount={totalCount}
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                />
                <ul className="grid max-h-[18rem] divide-y dark:divide-checkbox/30 overflow-auto scrollbar">
                  {results.data
                    .slice(beginning - 1, end)
                    .map((vuln: KeyStringVal) => {
                      return (
                        <li
                          key={vuln.id}
                          className="grid gap-2 p-2 cursor-pointer dark:hover:bg-filter/30 duration-100"
                          onClick={() => {
                            navigate(
                              `/${selectedVulnType}s/details?${selectedVulnType}_id=${vuln.id}`
                            );
                            setShow(false);
                          }}
                        >
                          <h4>{vuln.id}</h4>
                          <article className="flex flex-wrap items-center gap-2">
                            ......
                            {parse(vuln.search_highlight)}
                            ......
                          </article>
                        </li>
                      );
                    })}
                </ul>
              </section>
            ) : (
              <p>No relevant results found</p>
            )
          ) : null}
        </section>
      </ModalLayout>
    </>
  );
};

export default Vuln;
