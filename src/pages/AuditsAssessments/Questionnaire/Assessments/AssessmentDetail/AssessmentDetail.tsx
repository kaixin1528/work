/* eslint-disable react-hooks/exhaustive-deps */
import {
  faChevronCircleDown,
  faChevronCircleRight,
  faRotateBackward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useGRCStore } from "src/stores/grc";
import UploadQuestionnaire from "./UploadQuestionnaire";
import DraftList from "./DraftList/DraftList";
import ResponseList from "./ResponseList/ResponseList";
import AskAQuestion from "./AskAQuestion";
import SelectQuestionnairesFilter from "src/components/Filter/AuditsAssessments/SelectQuestionnaireFilter";
import { KeyStringVal } from "src/types/general";
import { Disclosure } from "@headlessui/react";

const AssessmentDetail = () => {
  const { setSelectedGRCAssessment } = useGRCStore();

  const [nav, setNav] = useState<number>(1);
  const [inputs, setInputs] = useState<any>({ drafts: [] });
  const [query, setQuery] = useState<string>("");
  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    useState<KeyStringVal>({ generated_id: "", document_name: "" });

  const assessmentID = sessionStorage.assessment_id;

  useEffect(() => {
    if (nav === 2) setTimeout(() => setNav(1), 5000);
  }, [nav]);

  return (
    <section className="flex flex-col flex-grow gap-5">
      <header className="flex items-center gap-5">
        <button
          className="flex gap-2 items-center w-max tracking-wide text-sm dark:text-checkbox dark:hover:text-checkbox/50 duration-100"
          onClick={() => {
            sessionStorage.removeItem("assessment_id");
            setSelectedGRCAssessment({
              name: "",
              assessment_id: "",
            });
          }}
        >
          <FontAwesomeIcon icon={faRotateBackward} /> Return
        </button>
        <h3 className="text-2xl">{sessionStorage.assessment_name}</h3>
      </header>
      <section className="grid content-start gap-10 p-4 w-full h-full">
        {nav === 1 ? (
          <section className="grid gap-12">
            <Disclosure defaultOpen>
              {({ open }) => (
                <section className="grid content-start gap-3 mx-auto">
                  <Disclosure.Button className="flex items-center gap-2 mx-auto">
                    <p>Ask more questions</p>
                    <FontAwesomeIcon
                      icon={open ? faChevronCircleDown : faChevronCircleRight}
                      className="dark:text-checkbox"
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    <section className="flex items-center justify-between gap-10 mx-auto">
                      <SelectQuestionnairesFilter
                        selectedQuestionnaire={selectedQuestionnaire}
                        setSelectedQuestionnaire={setSelectedQuestionnaire}
                      />
                      <span>or</span>
                      <UploadQuestionnaire assessmentID={assessmentID} />
                      <span>or</span>
                      <AskAQuestion
                        inputs={inputs}
                        setInputs={setInputs}
                        query={query}
                        setQuery={setQuery}
                      />
                    </section>
                  </Disclosure.Panel>
                </section>
              )}
            </Disclosure>

            <DraftList
              assessmentID={assessmentID}
              inputs={inputs}
              setInputs={setInputs}
              setQuery={setQuery}
              setNav={setNav}
              selectedQuestionnaire={selectedQuestionnaire}
              setSelectedQuestionnaire={setSelectedQuestionnaire}
            />
          </section>
        ) : (
          <section className="grid content-start gap-5">
            <article className="grid gap-3 text-center">
              <h4 className="text-xl">
                Uno is processing your questions. We will notify you when ready!
              </h4>
              <img
                src="/grc/draft-questions-processing.png"
                alt="questions processing"
                className="h-[20rem] mx-auto"
              />
            </article>
            <button
              className="px-4 py-2 mx-auto h-max dark:hover:bg-signin/30 duration-100 dark:bg-signin rounded-md"
              onClick={() => {
                setNav(1);
                setQuery("");
              }}
            >
              Ask another
            </button>
          </section>
        )}
        <ResponseList assessmentID={assessmentID} />
      </section>
    </section>
  );
};

export default AssessmentDetail;
