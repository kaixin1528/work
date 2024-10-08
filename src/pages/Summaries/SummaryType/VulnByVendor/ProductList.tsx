/* eslint-disable react-hooks/exhaustive-deps */
import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { GetProductsByVendor } from "src/services/summaries/vuln-by-vendor";
import { Sort } from "src/types/dashboard";
import { KeyStringVal } from "src/types/general";

const ProductList = ({
  sort,
  selectedType,
  vendor,
  setSelectedVendor,
  setSelectedProduct,
  cveIDs,
}: {
  sort: Sort;
  selectedType: string;
  vendor: string;
  setSelectedVendor: (selectedVendor: string) => void;
  setSelectedProduct: (selectedProduct: string) => void;
  cveIDs: string[];
}) => {
  const [show, setShow] = useState<boolean>(false);

  const { data: products } = GetProductsByVendor(
    selectedType,
    vendor,
    sort.order,
    sort.orderBy,
    cveIDs,
    show
  );

  return (
    <>
      <button
        className="flex items-center gap-2"
        onClick={() => setShow(!show)}
      >
        <FontAwesomeIcon
          icon={show ? faChevronCircleDown : faChevronCircleRight}
          className="dark:text-checkbox"
        />
        <h4 className="text-sm">{show ? "Hide" : "Show"} Products</h4>
      </button>
      {show && (
        <section className="flex flex-wrap gap-5 mx-auto w-full max-h-[20rem] text-sm overflow-auto scrollbar">
          {products?.map((product: KeyStringVal) => {
            return (
              <button
                key={product.product}
                className="grid content-start px-5 py-2 dark:bg-filter/30 border dark:border-filter dark:hover:border dark:hover:border-signin rounded-full"
                onClick={() => {
                  setSelectedVendor(vendor);
                  setSelectedProduct(product.product);
                }}
              >
                <h4>{product.product}</h4>
                <span>({product.counts} CVE)</span>
              </button>
            );
          })}
        </section>
      )}
    </>
  );
};

export default ProductList;
