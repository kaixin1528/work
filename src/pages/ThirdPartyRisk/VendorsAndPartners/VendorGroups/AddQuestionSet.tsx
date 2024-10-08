import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { GetCustomQuestionSets } from "src/services/third-party-risk/vendors-and-partners/custom-question-sets";
import {
  AddQuestionSetToVendorGroup,
  GetQuestionSetsFromGroup,
  RemoveQuestionSetFromVendorGroup,
} from "src/services/third-party-risk/vendors-and-partners/vendor-groups";
import { KeyStringVal } from "src/types/general";

const AddQuestionSet = ({ groupID }: { groupID: string }) => {
  const { data: questionSets } = GetQuestionSetsFromGroup(groupID);
  const { data: customQuestionSets } = GetCustomQuestionSets(1);

  const addQuestionSet = AddQuestionSetToVendorGroup(groupID);
  const removeQuestionSet = RemoveQuestionSetFromVendorGroup(groupID);

  const hasQuestionSet = questionSets?.length > 0;

  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center gap-1 px-2 dark:hover:bg-filter/30 duration-100 rounded-full">
        <h4>
          {hasQuestionSet
            ? `Question Set: ${questionSets[0].name}`
            : "Add Question Set"}
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
          {customQuestionSets ? (
            customQuestionSets.data.length > 0 ? (
              <ul className="grid divide-y-1 dark:divide-checkbox/30">
                {customQuestionSets.data.map((questionSet: KeyStringVal) => {
                  const selected = questionSets?.some(
                    (curQS: KeyStringVal) =>
                      questionSet.generated_id === curQS.generated_id
                  );
                  return (
                    <li
                      key={questionSet.generated_id}
                      className="flex items-center gap-2 px-4 pr-20 py-2 cursor-pointer dark:hover:bg-filter/30 duration-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selected)
                          removeQuestionSet.mutate({
                            questionSetID: questionSet.generated_id,
                          });
                        else {
                          if (questionSets?.length > 0)
                            removeQuestionSet.mutate({
                              questionSetID: questionSets[0].generated_id,
                            });
                          addQuestionSet.mutate({
                            questionSetID: questionSet.generated_id,
                          });
                        }
                      }}
                    >
                      {selected && (
                        <FontAwesomeIcon icon={faCheck} className="text-no" />
                      )}
                      {questionSet.name}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No question sets available</p>
            )
          ) : null}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default AddQuestionSet;
