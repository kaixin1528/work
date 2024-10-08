import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import {
  AddVendorGroupsToQuestionSet,
  GetVendorGroupsFromQuestionSet,
  RemoveVendorGroupsFromQuestionSet,
} from "src/services/third-party-risk/vendors-and-partners/custom-question-sets";
import { GetVendorGroups } from "src/services/third-party-risk/vendors-and-partners/vendor-groups";
import { KeyStringVal } from "src/types/general";

const AddToVendorGroups = ({ questionSetID }: { questionSetID: string }) => {
  const { data: curVendorGroups } =
    GetVendorGroupsFromQuestionSet(questionSetID);
  const { data: allVendorGroups } = GetVendorGroups(1);

  const addToVendorGroups = AddVendorGroupsToQuestionSet(questionSetID);
  const removeVendorGroups = RemoveVendorGroupsFromQuestionSet(questionSetID);

  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center gap-1 dark:hover:bg-filter/30 duration-100 rounded-full">
        <h4>
          <FontAwesomeIcon icon={faPlus} /> Vendor Groups
        </h4>
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="pointer-events-auto absolute bottom-8 break-all dark:bg-black rounded-md z-50">
          {allVendorGroups ? (
            allVendorGroups.data.length > 0 ? (
              <article className="grid divide-y-1 dark:divide-checkbox/30">
                {allVendorGroups.data.map((vendorGroup: any) => {
                  const selected = curVendorGroups?.some(
                    (curVendorGroup: KeyStringVal) =>
                      vendorGroup.generated_id === curVendorGroup.generated_id
                  );

                  if (
                    vendorGroup.question_set_id &&
                    vendorGroup.question_set_id !== questionSetID
                  )
                    return null;

                  return (
                    <button
                      key={vendorGroup.generated_id}
                      className="flex items-center gap-2 px-4 pr-20 py-2 dark:hover:bg-filter/30 duration-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selected)
                          removeVendorGroups.mutate({
                            groupID: vendorGroup.generated_id,
                          });
                        else {
                          addToVendorGroups.mutate({
                            groupID: vendorGroup.generated_id,
                          });
                        }
                      }}
                    >
                      {selected && (
                        <FontAwesomeIcon icon={faCheck} className="text-no" />
                      )}
                      {vendorGroup.name}
                    </button>
                  );
                })}
              </article>
            ) : (
              <p>No vendor groups available</p>
            )
          ) : null}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default AddToVendorGroups;
