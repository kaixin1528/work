import React, { useState } from "react";
import Loader from "src/components/Loader/Loader";
import NewVendor from "./NewVendorGroup";
import NewVendorGroup from "./NewVendorGroup";
import UpdateVendorGroup from "./UpdateVendorGroup";
import TablePagination from "src/components/General/TablePagination";
import { pageSize } from "src/constants/general";
import { GetVendorGroups } from "src/services/third-party-risk/vendors-and-partners/vendor-groups";
import { KeyStringVal } from "src/types/general";
import VendorGroupDetail from "./VendorGroupDetail/VendorGroupDetail";
import DeleteVendorGroup from "./DeleteVendorGroup";
import AddQuestionSet from "./AddQuestionSet";

const VendorGroups = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedVendorGroup, setSelectedVendorGroup] = useState({});

  const { data: vendorGroups, status: vendorGroupsStatus } =
    GetVendorGroups(pageNumber);

  const totalCount = vendorGroups?.pager?.total_results || 0;
  const totalPages = vendorGroups?.pager?.num_pages || 0;
  const beginning = pageNumber === 1 ? 1 : pageSize * (pageNumber - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  return (
    <>
      {!sessionStorage.vendor_group_id ? (
        <section className="flex flex-col flex-grow gap-5">
          {vendorGroups?.data.length > 0 && <NewVendorGroup />}
          {vendorGroupsStatus === "loading" ? (
            <Loader />
          ) : vendorGroups?.data.length > 0 ? (
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
                {vendorGroups.data.map(
                  (vendorGroup: KeyStringVal, index: number) => {
                    return (
                      <li
                        key={index}
                        className="grid gap-5 p-5 cursor-pointer bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/30 duration-100 rounded-md"
                        onClick={() => {
                          setSelectedVendorGroup(vendorGroup);
                          sessionStorage.vendor_group_id =
                            vendorGroup.generated_id;
                          sessionStorage.vendor_group_name = vendorGroup.name;
                        }}
                      >
                        <article className="flex flex-wrap items-center justify-between gap-10">
                          <h4 className="text-xl">{vendorGroup.name}</h4>
                          <article className="flex items-center gap-5">
                            <UpdateVendorGroup
                              groupID={vendorGroup.generated_id}
                              vendorGroup={vendorGroup}
                            />
                            <DeleteVendorGroup
                              groupID={vendorGroup.generated_id}
                            />
                          </article>
                        </article>
                        <p>{vendorGroup.description}</p>
                        <AddQuestionSet groupID={vendorGroup.generated_id} />
                      </li>
                    );
                  }
                )}
              </ul>
            </section>
          ) : (
            <section className="flex items-center place-content-center gap-10 w-full h-full">
              <img
                src="/grc/third-party-risk-placeholder.svg"
                alt="vendor groups placeholder"
                className="w-40 h-40"
              />
              <article className="grid gap-3">
                <h4 className="text-xl font-extrabold">Vendor Groups</h4>
                <h4>No vendor groups available</h4>
                <NewVendor />
              </article>
            </section>
          )}
        </section>
      ) : (
        <VendorGroupDetail
          selectedVendorGroup={selectedVendorGroup}
          setSelectedPolicyGroup={setSelectedVendorGroup}
        />
      )}
    </>
  );
};

export default VendorGroups;
