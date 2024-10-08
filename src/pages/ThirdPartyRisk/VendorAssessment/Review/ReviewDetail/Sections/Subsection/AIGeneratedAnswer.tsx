import {
  faChevronCircleDown,
  faChevronCircleRight,
  faExclamationTriangle,
  faMagnifyingGlassChart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Transition } from "@headlessui/react";
import React from "react";
import { GetAIGeneratedAnswer } from "src/services/third-party-risk/vendor-assessment";

const AIGeneratedAnswer = ({
  reviewID,
  generatedID,
}: {
  reviewID: string;
  generatedID: string;
}) => {
  const aiGeneratedAnswer = GetAIGeneratedAnswer(reviewID, generatedID);

  const isCompliant = aiGeneratedAnswer.data?.is_compliant === "yes";

  return (
    <Disclosure>
      {({ open }) => {
        return (
          <section className="grid gap-2 text-sm">
            <Disclosure.Button
              className="flex items-center gap-2 w-max"
              onClick={() => {
                if (!aiGeneratedAnswer?.data) aiGeneratedAnswer.mutate({});
              }}
            >
              <article className="flex items-center gap-1">
                <FontAwesomeIcon
                  icon={faMagnifyingGlassChart}
                  className="text-checkbox"
                />
                <h4>Uno's Analysis</h4>
              </article>
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
                {aiGeneratedAnswer.data && (
                  <p className="flex items-center gap-2 p-3 break-words dark:bg-black rounded-md">
                    {!isCompliant && (
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className={`${
                          aiGeneratedAnswer.data.is_compliant === "no"
                            ? "text-reset"
                            : "text-yellow-500"
                        }`}
                      />
                    )}
                    {aiGeneratedAnswer?.data.answer}
                  </p>
                )}
              </Disclosure.Panel>
            </Transition>
          </section>
        );
      }}
    </Disclosure>
  );
};

export default AIGeneratedAnswer;
