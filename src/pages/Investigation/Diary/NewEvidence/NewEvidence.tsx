/* eslint-disable no-restricted-globals */
import { useState } from "react";
import { evidenceTypes } from "../../../../constants/investigation";
import ModalLayout from "../../../../layouts/ModalLayout";
import Search from "./Search";
import Alert from "./Alert";

const NewEvidence = () => {
  const [showNewEvidence, setShowNewEvidence] = useState<boolean>(false);
  const [newEvidenceType, setNewEvidenceType] = useState<string>("");

  const handleOnClose = () => setShowNewEvidence(false);

  return (
    <section className="grid gap-5">
      <button
        className="grid justify-self-start px-4 py-1 my-10 green-gradient-button rounded-sm"
        onClick={() => {
          setShowNewEvidence(true);
          setNewEvidenceType("MAIN_GRAPH_SEARCH");
        }}
      >
        New Evidence
      </button>
      <ModalLayout showModal={showNewEvidence} onClose={handleOnClose}>
        <section className="grid content-start gap-5">
          <h4 className="text-left">New Evidence</h4>
          <section className="grid gap-3">
            <article className="grid grid-cols-2 md:grid-cols-4 gap-5 mx-10">
              {evidenceTypes.map(
                (evidenceType: { type: string; icon: string }) => {
                  return (
                    <button
                      key={evidenceType.type}
                      className={`grid content-start gap-3 p-2 text-center ${
                        newEvidenceType === evidenceType.type
                          ? "dark:bg-tooltip"
                          : "dark:hover:bg-tooltip duration-100"
                      } dark:disabled:bg-transparent dark:disabled:cursor-not-allowed rounded-md`}
                      onClick={() => setNewEvidenceType(evidenceType.type)}
                    >
                      <img
                        src={`${evidenceType.icon}`}
                        alt={evidenceType.type}
                        className="w-5 h-5 mx-auto"
                      />
                      <p className="text-xs">
                        {evidenceType.type.replaceAll("_", " ")}
                      </p>
                    </button>
                  );
                }
              )}
            </article>
          </section>

          {/* evidence type is graph search */}
          {newEvidenceType.includes("SEARCH") && (
            <Search
              setShowNewEvidence={setShowNewEvidence}
              newEvidenceType={newEvidenceType}
            />
          )}

          {/* evidence type is alert analysis */}
          {newEvidenceType.includes("ALERT") && (
            <Alert
              setShowNewEvidence={setShowNewEvidence}
              newEvidenceType={newEvidenceType}
            />
          )}
        </section>
      </ModalLayout>
    </section>
  );
};

export default NewEvidence;
