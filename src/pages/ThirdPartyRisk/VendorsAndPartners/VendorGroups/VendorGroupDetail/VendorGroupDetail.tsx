/* eslint-disable react-hooks/exhaustive-deps */
import { faRotateBackward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import {
  GetQuestionSetsFromGroup,
  GetVendorGroupMetadata,
  GetVendorsFromGroup,
} from "src/services/third-party-risk/vendors-and-partners/vendor-groups";
import { KeyStringVal } from "src/types/general";
import VendorsFilter from "src/components/Filter/ThirdPartyRisk/VendorsFilter";
import Loader from "src/components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import UpdateVendor from "../../Vendors/UpdateVendor";
import DeleteVendorFromGroup from "./DeleteVendorFromGroup";

const VendorGroupDetail = ({
  selectedVendorGroup,
  setSelectedPolicyGroup,
}: {
  selectedVendorGroup: KeyStringVal;
  setSelectedPolicyGroup: (selectedVendorGroup: KeyStringVal) => void;
}) => {
  const navigate = useNavigate();

  const groupID = sessionStorage.vendor_group_id;

  const { data: vendorGroupMetadata } = GetVendorGroupMetadata(groupID);
  const {
    data: vendors,
    status: vendorsStatus,
    refetch,
  } = GetVendorsFromGroup(groupID);
  const { data: questionSets } = GetQuestionSetsFromGroup(groupID);

  const handleReturn = () => {
    sessionStorage.removeItem("vendor_group_id");
    setSelectedPolicyGroup({});
  };

  useEffect(() => {
    refetch();
  }, [vendors]);

  return (
    <section className="flex flex-col flex-grow gap-5">
      {vendorGroupMetadata && (
        <header className="flex items-center gap-10">
          <article className="flex items-center gap-5">
            <button
              className="flex gap-2 items-center w-max tracking-wide text-sm dark:text-checkbox dark:hover:text-checkbox/50 duration-100"
              onClick={handleReturn}
            >
              <FontAwesomeIcon icon={faRotateBackward} />
              <span>Return</span>
            </button>
            <h4 className="text-xl">{vendorGroupMetadata.name}</h4>
          </article>
          <VendorsFilter
            label="Add vendor"
            members={vendors?.members}
            groupID={groupID}
          />
        </header>
      )}
      {questionSets?.length > 0 && `Question Set: ${questionSets[0].name}`}
      {vendorsStatus === "loading" ? (
        <Loader />
      ) : vendors?.members.length > 0 ? (
        <ul className="flex flex-col flex-grow gap-5">
          {vendors.members.map((vendor: any, index: number) => {
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
                  <article className="flex items-center gap-5">
                    <UpdateVendor
                      vendorID={vendor.third_party_id}
                      vendor={vendor}
                    />
                    <DeleteVendorFromGroup
                      groupID={groupID}
                      vendorID={vendor.third_party_id}
                    />
                  </article>
                </article>
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
          </article>
        </section>
      )}
    </section>
  );
};

export default VendorGroupDetail;
