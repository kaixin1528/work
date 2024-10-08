import React from "react";
import ReturnPage from "src/components/Button/ReturnPage";
import PageLayout from "src/layouts/PageLayout";
import { parseURL } from "src/utils/general";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VendorMetadata from "./VendorMetadata";
import VendorResponseList from "./VendorResponseList/VendorResponseList";

const Vendor = () => {
  const parsed = parseURL();

  const vendorID = String(parsed.vendor_id) || "";

  return (
    <PageLayout>
      <main className="relative flex flex-col flex-grow gap-5 px-5 pt-5 h-full w-full overflow-auto scrollbar">
        <article className="flex items-center gap-5">
          <ReturnPage />
          <h4 className="capitalize">
            Third Party Risk <FontAwesomeIcon icon={faArrowRightLong} /> Vendors
            and Partners
          </h4>
        </article>
        <VendorMetadata vendorID={vendorID} />
        <VendorResponseList vendorID={vendorID} />
        {/* <Assessments vendorID={vendorID} /> */}
      </main>
    </PageLayout>
  );
};

export default Vendor;
