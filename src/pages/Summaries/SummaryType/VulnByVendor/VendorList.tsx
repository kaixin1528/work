/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Loader from "src/components/Loader/Loader";
import TablePagination from "src/components/General/TablePagination";
import { pageSize } from "src/constants/general";
import { GetVendors } from "src/services/summaries/vuln-by-vendor";
import { Sort } from "src/types/dashboard";
import { KeyStringVal } from "src/types/general";
import CVEListForVendor from "./CVEListForVendor";
import ProductList from "./ProductList";

const VendorList = ({
  sort,
  selectedType,
  selectedVendor,
  selectedProduct,
  setSelectedVendor,
  setSelectedProduct,
  cveIDs,
}: {
  sort: Sort;
  selectedType: string;
  selectedVendor: string;
  selectedProduct: string;
  setSelectedVendor: (selectedVendor: string) => void;
  setSelectedProduct: (selectedVendor: string) => void;
  cveIDs: string[];
}) => {
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: vendors, status: vendorStatus } = GetVendors(
    selectedType,
    sort.order,
    sort.orderBy,
    cveIDs
  );

  const filteredVendors =
    query !== ""
      ? vendors?.filter((vendor: KeyStringVal) =>
          vendor.vendor
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        )
      : vendors;
  const totalCount = filteredVendors?.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  useEffect(() => {
    setPageNumber(1);
  }, [query, selectedType, sort]);

  return (
    <section className="flex flex-col flex-grow h-full overflow-auto scrollbar">
      {vendorStatus === "loading" ? (
        <Loader />
      ) : (
        vendorStatus === "success" && (
          <section className="flex flex-col flex-grow gap-5 h-full overflow-auto scrollbar">
            <header className="flex items-center justify-between gap-10">
              <article className="flex items-center gap-3 w-3/5">
                <input
                  id="autocomplete"
                  type="filter"
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="Search vendor"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="px-5 w-full h-8 text-xs placeholder:text-secondary placeholder:text-xs placeholder:font-medium dark:text-white dark:disabled:cursor-not-allowed border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none dark:bg-search rounded-sm"
                />
              </article>
              <TablePagination
                totalPages={totalPages}
                beginning={beginning}
                end={end}
                totalCount={totalCount}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
            </header>
            <ul className="flex flex-col flex-grow gap-2 max-h-[50rem] overflow-auto scrollbar">
              {filteredVendors
                ?.slice(beginning - 1, end)
                .map((vendor: KeyStringVal) => {
                  return (
                    <li
                      key={vendor.vendor}
                      className="grid content-start gap-2 p-4 w-full h-full break-all bg-gradient-to-br dark:from-filter to-white/60"
                    >
                      <header className="flex items-center gap-5">
                        <h3 className="text-lg">{vendor.vendor}</h3>
                        <CVEListForVendor
                          selectedType={selectedType}
                          vendor={vendor.vendor}
                          cveCount={Number(vendor.counts)}
                        />
                      </header>
                      <ProductList
                        sort={sort}
                        selectedType={selectedType}
                        vendor={vendor.vendor}
                        setSelectedVendor={setSelectedVendor}
                        setSelectedProduct={setSelectedProduct}
                        cveIDs={cveIDs}
                      />
                    </li>
                  );
                })}
            </ul>
          </section>
        )
      )}
    </section>
  );
};

export default VendorList;
