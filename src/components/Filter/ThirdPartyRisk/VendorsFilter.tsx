/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { KeyStringVal } from "src/types/general";
import { GetVendorsAndPartners } from "src/services/third-party-risk/vendors-and-partners/vendors";
import { AddVendorToGroup } from "src/services/third-party-risk/vendors-and-partners/vendor-groups";

const VendorsFilter = ({
  label,
  members,
  groupID,
}: {
  label?: string;
  members: KeyStringVal[];
  groupID: string;
}) => {
  const { data: vendors } = GetVendorsAndPartners();
  const addVendorToGroup = AddVendorToGroup();

  return (
    <DropdownLayout
      label={label}
      value=""
      width="w-[30rem]"
      placeholder="Select Vendor"
    >
      {vendors?.map((vendor: KeyStringVal, index: number) => {
        const included = members?.some(
          (member) => member.third_party_id === vendor.third_party_id
        );
        if (vendor.group_id && vendor.group_id !== groupID) return null;

        return (
          <motion.button
            key={index}
            variants={filterVariants}
            disabled={included}
            className="relative flex items-center gap-2 px-7 py-1 w-full break-all text-left dark:disabled:hover:bg-transparent dark:hover:bg-filter/50 duration-100"
            onClick={() =>
              addVendorToGroup.mutate({
                groupID: sessionStorage.vendor_group_id,
                vendor: [vendor.third_party_id],
              })
            }
          >
            {included && <FontAwesomeIcon icon={faCheck} className="text-no" />}
            <p>{vendor.name}</p>
          </motion.button>
        );
      })}
    </DropdownLayout>
  );
};

export default VendorsFilter;
