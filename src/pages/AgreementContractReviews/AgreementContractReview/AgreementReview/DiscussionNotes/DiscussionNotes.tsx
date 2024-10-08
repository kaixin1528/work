/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RefObject, useEffect, useRef } from "react";
import Discussion from "./Discussion";
import PanelLayout from "../../../../../layouts/PanelLayout";
import { KeyStringVal } from "src/types/general";
import { useGRCStore } from "src/stores/grc";

const DiscussionNotes = ({
  agreementID,
  question,
}: {
  agreementID: string;
  question: KeyStringVal;
}) => {
  const { showGRCPanel, setShowGRCPanel } = useGRCStore();

  const panelRef = useRef() as RefObject<HTMLElement>;

  const anchorID = String(question.anchor_id);

  useEffect(() => {
    // remove panel if clicked on outside of panel
    const handleClickOutside = (event: { target: any }) => {
      if (!panelRef?.current?.contains(event.target)) {
        setShowGRCPanel(false);
      }
    };
    // remove panel if escape panel
    const handleEscape = (event: {
      key: string;
      preventDefault: () => void;
    }) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setShowGRCPanel(false);
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
    <PanelLayout showPanel={showGRCPanel} panelRef={panelRef}>
      <section className="flex flex-col flex-grow gap-5 pt-5 h-full overflow-auto scrollbar">
        <header className="grid gap-2">
          <button
            onClick={() => setShowGRCPanel(false)}
            className="absolute top-6 left-5"
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="w-5 h-5 dark:text-checkbox dark:hover:text-checkbox/30 duration-100"
            />
          </button>
          <article className="flex items-center gap-10">
            <p className="py-1 px-4 w-max h-max hover:whitespace-normal truncate text-ellipsis dark:bg-signin/20 border dark:border-signin rounded-sm overflow-auto scrollbar">
              {question.question}
            </p>
          </article>
        </header>

        <Discussion documentID={agreementID} anchorID={anchorID} />
      </section>
    </PanelLayout>
  );
};

export default DiscussionNotes;
