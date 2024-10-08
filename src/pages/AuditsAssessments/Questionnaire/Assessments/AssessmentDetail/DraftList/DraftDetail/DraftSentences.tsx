import {
  faCheck,
  faChevronCircleDown,
  faChevronCircleRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import React from "react";
import { KeyStringVal } from "src/types/general";

const DraftSentences = ({
  draft,
  inputs,
  setInputs,
}: {
  draft: any;
  inputs: any;
  setInputs: any;
}) => {
  const draftID = draft.draft_question_list_id;

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex items-center gap-2 mx-auto">
            <p>{open ? "Hide" : "Show"} Sentences</p>
            <FontAwesomeIcon
              icon={open ? faChevronCircleDown : faChevronCircleRight}
              className="dark:text-checkbox"
            />
          </Disclosure.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel>
              <ul className="grid gap-3 pr-5 max-h-[20rem] overflow-auto scrollbar">
                {draft.sentences.map((sentence: string, index: number) => {
                  return (
                    <li
                      key={index}
                      className="flex items-start gap-2 px-4 py-2 text-left dark:bg-task black-shadow rounded-md"
                    >
                      {draft.questions.includes(sentence) ? (
                        <FontAwesomeIcon icon={faCheck} className="text-no" />
                      ) : (
                        <button
                          className="text-no hover:text-no/60 duration-100"
                          onClick={() => {
                            setInputs({
                              drafts: inputs.drafts.map(
                                (curDraft: KeyStringVal) => {
                                  if (
                                    draftID === curDraft.draft_question_list_id
                                  )
                                    return {
                                      ...draft,
                                      questions: [...draft.questions, sentence],
                                    };
                                  else return curDraft;
                                }
                              ),
                            });
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      )}
                      {sentence}
                    </li>
                  );
                })}
              </ul>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default DraftSentences;
