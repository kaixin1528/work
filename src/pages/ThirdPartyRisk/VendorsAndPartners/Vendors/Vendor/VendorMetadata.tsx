import React from "react";
import { convertToUTCString } from "src/utils/general";
import { attributeColors } from "src/constants/general";
import { GetVendorMetadata } from "src/services/third-party-risk/vendors-and-partners/vendors";
import UpdateVendor from "../UpdateVendor";
import VendorGroupFilter from "src/components/Filter/ThirdPartyRisk/VendorGroupFilter";

const VendorMetadata = ({ vendorID }: { vendorID: string }) => {
  const { data: vendorMetadata } = GetVendorMetadata(vendorID);

  return (
    <>
      {vendorMetadata && (
        <header className="grid gap-3">
          <VendorGroupFilter label="Vendor Group" vendor={vendorMetadata} />
          <article className="flex flex-wrap items-center justify-between gap-5 border-b-1 dark:border-white">
            <h2 className="text-xl">{vendorMetadata.name}</h2>
            <article className="flex flex-wrap items-center gap-3 pb-1">
              <article className="flex items-center gap-2">
                <h4 className="dark:text-checkbox">last updated at</h4>
                <span>{convertToUTCString(vendorMetadata.last_updated)}</span>
              </article>
              <UpdateVendor vendorID={vendorID} vendor={vendorMetadata} />
            </article>
          </article>
          <article className="flex items-center gap-2 divide-x dark:divide-white">
            {vendorMetadata.address && (
              <p className="italic text-sm">{vendorMetadata.address}</p>
            )}
            {vendorMetadata.contact && (
              <span className="pl-2 font-extralight">
                {vendorMetadata.contact.name} | {vendorMetadata.contact.email} |{" "}
                {vendorMetadata.contact.phone}{" "}
              </span>
            )}
          </article>
          <article className="flex items-center gap-10">
            <article className="flex items-center gap-2">
              <h4>Risk Profile</h4>
              <span
                className={`capitalize ${
                  attributeColors[vendorMetadata.risk_profile.toLowerCase()]
                }`}
              >
                {vendorMetadata.risk_profile}
              </span>
            </article>
            <article className="flex items-center gap-2">
              <h4>Assessments</h4>
              <span className="px-4 py-2 dark:bg-signin rounded-md">
                {vendorMetadata.number_of_assessments}
              </span>
            </article>
          </article>
        </header>
      )}
    </>
  );
};

export default VendorMetadata;
