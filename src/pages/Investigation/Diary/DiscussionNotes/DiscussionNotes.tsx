/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import {
  faComment,
  faNoteSticky,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RefObject, useEffect, useRef } from "react";
import Notes from "./Notes";
import Discussion from "./Discussion";
import PanelLayout from "../../../../layouts/PanelLayout";
import { useInvestigationStore } from "src/stores/investigation";
import { GeneralEvidenceType } from "src/types/investigation";

const DiscussionNotes = ({
  curEvidence,
}: {
  curEvidence: GeneralEvidenceType;
}) => {
  const {
    showEvidencePanel,
    setShowEvidencePanel,
    selectedEvidencePanelTab,
    setSelectedEvidencePanelTab,
  } = useInvestigationStore();

  const panelRef = useRef() as RefObject<HTMLElement>;

  const evidenceID = String(curEvidence.evidence_id);

  useEffect(() => {
    // remove panel if clicked on outside of panel
    const handleClickOutside = (event: { target: any }) => {
      if (!panelRef?.current?.contains(event.target)) {
        setShowEvidencePanel(false);
      }
    };
    // remove panel if escape panel
    const handleEscape = (event: {
      key: string;
      preventDefault: () => void;
    }) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setShowEvidencePanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [panelRef]);

  return (
    <PanelLayout showPanel={showEvidencePanel} panelRef={panelRef}>
      <section className="flex flex-col flex-grow gap-5 pt-5 h-full overflow-auto scrollbar">
        <header className="grid gap-2">
          <button
            onClick={() => setShowEvidencePanel(false)}
            className="absolute top-6 left-5"
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="w-5 h-5 dark:text-checkbox dark:hover:text-checkbox/30 duration-100"
            />
          </button>
          <article className="flex items-center gap-10">
            <p className="py-1 px-4 w-max h-max hover:whitespace-normal truncate text-ellipsis dark:bg-signin/20 border dark:border-signin rounded-sm overflow-auto scrollbar">
              {curEvidence.query_string || curEvidence.graph_artifact_id}
            </p>
          </article>
        </header>

        {/* navigation tab */}
        <nav className="grid grid-flow-col text-sm dark:text-white dark:bg-checkbox">
          {["Discussion", "Notes"].map((category) => {
            return (
              <button
                key={category}
                className={`px-4 py-3 font-semibold bg-gradient-to-b ${
                  selectedEvidencePanelTab === category
                    ? "dark:text-white dark:from-card dark:to-tab shadow-md dark:shadow-signin z-50"
                    : "dark:text-checkbox dark:hover:text-white dark:from-card dark:to-expand dark:hover:to-tab"
                } duration-100`}
                onClick={() => setSelectedEvidencePanelTab(category)}
              >
                {category === "Comments" && (
                  <FontAwesomeIcon
                    icon={faComment}
                    className="mr-2 dark:text-contact"
                  />
                )}
                {category === "Notes" && (
                  <FontAwesomeIcon
                    icon={faNoteSticky}
                    className="mr-2 dark:text-checkbox"
                  />
                )}
                {category}
              </button>
            );
          })}
        </nav>

        {/* discussion section */}
        {selectedEvidencePanelTab === "Discussion" && (
          <Discussion evidenceID={evidenceID} />
        )}

        {/* notes section */}
        {selectedEvidencePanelTab === "Notes" && (
          <Notes evidenceID={evidenceID} />
        )}
      </section>
    </PanelLayout>
  );
};

export default DiscussionNotes;
