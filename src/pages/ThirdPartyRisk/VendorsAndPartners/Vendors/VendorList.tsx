import React from "react";
import Loader from "src/components/Loader/Loader";
import NewVendor from "./NewVendor";
import UpdateVendor from "./UpdateVendor";
import { useNavigate } from "react-router-dom";
import { GetVendorsAndPartners } from "src/services/third-party-risk/vendors-and-partners/vendors";

const VendorList = () => {
  const navigate = useNavigate();

  const { data: vendors, status: vendorsStatus } = GetVendorsAndPartners();

  return (
    <section className="flex flex-col flex-grow gap-5">
      {vendors?.length > 0 && <NewVendor />}
      {vendorsStatus === "loading" ? (
        <Loader />
      ) : vendors?.length > 0 ? (
        <ul className="flex flex-col flex-grow gap-5">
          {vendors.map((vendor: any, index: number) => {
            return (
              <li
                key={index}
                className="grid gap-5 p-5 cursor-pointer bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30 duration-100 rounded-md"
                onClick={() => {
                  sessionStorage.GRCCategory = "vendors and partners";
                  navigate(
                    `/third-party-risk/vendors-partners/details?vendor_id=${vendor.third_party_id}`
                  );
                }}
              >
                <article className="flex flex-wrap items-center justify-between gap-10">
                  <h4 className="text-xl">{vendor.name}</h4>
                  <UpdateVendor
                    vendorID={vendor.third_party_id}
                    vendor={vendor}
                  />
                </article>
                {vendor.contact && (
                  <span className="font-extralight">
                    {vendor.contact.name} | {vendor.contact.email} |{" "}
                    {vendor.contact.phone}{" "}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <section className="flex items-center place-content-center gap-10 w-full h-full">
          <img
            src="/grc/third-party-risk-placeholder.svg"
            alt="vendors placeholder"
            className="w-40 h-40"
          />
          <article className="grid gap-3">
            <h4 className="text-xl font-extrabold">Vendors and Partners</h4>
            <h4>No vendors and partners available</h4>
            <NewVendor />
          </article>
        </section>
      )}
    </section>
  );
};

export default VendorList;
