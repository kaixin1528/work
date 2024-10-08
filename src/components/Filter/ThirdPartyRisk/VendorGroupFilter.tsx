/* eslint-disable no-restricted-globals */
import { motion } from "framer-motion";
import { filterVariants } from "../../../constants/general";
import DropdownLayout from "../../../layouts/DropdownLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { KeyStringVal } from "src/types/general";
import {
  AddVendorToGroup,
  GetVendorGroups,
  RemoveVendorFromGroup,
} from "src/services/third-party-risk/vendors-and-partners/vendor-groups";

const VendorGroupFilter = ({
  label,
  vendor,
}: {
  label?: string;
  vendor: KeyStringVal;
}) => {
  const { data: vendorGroups } = GetVendorGroups(1);
  const addVendorToGroup = AddVendorToGroup();
  const removeVendorGroup = RemoveVendorFromGroup();

  const selectedGroup = vendorGroups?.data.find(
    (group: KeyStringVal) => group.generated_id === vendor?.group_id
  );

  return (
    <DropdownLayout
      label={label}
      value={selectedGroup?.name}
      width="w-[20rem]"
      placeholder="Select Group"
    >
      {vendorGroups?.data.map((vendorGroup: KeyStringVal, index: number) => {
        const selected = vendorGroup.name === selectedGroup?.name;
        return (
          <motion.button
            key={index}
            variants={filterVariants}
            className="relative flex items-center gap-2 px-7 py-1 w-full break-all text-left dark:disabled:hover:bg-transparent dark:hover:bg-filter/50 duration-100"
            onClick={() => {
              removeVendorGroup.mutate(
                {
                  groupID: vendorGroup.generated_id,
                  vendor: [vendor.third_party_id],
                },
                {
                  onSuccess: () => {
                    if (
                      selectedGroup?.generated_id === vendorGroup.generated_id
                    ) {
                      sessionStorage.removeItem("vendor_group_id");
                      sessionStorage.removeItem("vendor_group_name");
                    } else {
                      sessionStorage.vendor_group_id = vendorGroup.generated_id;
                      sessionStorage.vendor_group_name = vendorGroup.name;
                      addVendorToGroup.mutate({
                        groupID: vendorGroup.generated_id,
                        vendor: [vendor.third_party_id],
                      });
                    }
                  },
                }
              );
            }}
          >
            {selected && <FontAwesomeIcon icon={faCheck} className="text-no" />}
            <p>{vendorGroup.name}</p>
          </motion.button>
        );
      })}
    </DropdownLayout>
  );
};

export default VendorGroupFilter;
