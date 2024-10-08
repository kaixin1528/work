import React, { useState } from "react";
import ModalLayout from "src/layouts/ModalLayout";
import {
  GenerateSOP,
  GetSuggestSection,
  UpdateSOP,
} from "src/services/regulation-policy/policy";
import { KeyStringVal } from "src/types/general";

const SuggestNewSections = ({
  section,
  index,
  versionID,
  suggestFramework,
}: {
  section: KeyStringVal;
  index: number;
  versionID: string;
  suggestFramework?: KeyStringVal;
}) => {
  const [suggestNewSections, setSuggestNewSections] = useState<string>("");
  const [editSOP, setEditSOP] = useState<any>({});

  const suggestSection = GetSuggestSection();
  const generateSOP = GenerateSOP();
  const updateSOP = UpdateSOP();

  return (
    <>
      <button
        className="text-left text-sm dark:hover:text-checkbox/60 duration-100"
        onClick={() => {
          setSuggestNewSections(section.generated_id);
          suggestSection.mutate({
            versionID: versionID,
            index: index,
          });
          generateSOP.mutate({
            versionID: versionID,
            documentID: section.document_id,
            generatedID: section.generated_id,
          });
        }}
      >
        Suggested content
      </button>
      <ModalLayout
        showModal={suggestNewSections === section.generated_id}
        onClose={() => {
          setSuggestNewSections("");
          generateSOP.reset();
        }}
      >
        <section className="grid gap-3 mt-4">
          <span className="text-lg">
            Suggested section number: {suggestSection.data}
          </span>
          {Object.keys(editSOP).length > 0 ? (
            <article className="flex items-center gap-5">
              <button className="discard-button" onClick={() => setEditSOP({})}>
                Discard
              </button>
              <button
                className="save-button"
                onClick={() => {
                  updateSOP.mutate(
                    {
                      versionID: versionID,
                      frameworkID: suggestFramework?.id,
                      editSOP: editSOP,
                    },
                    {
                      onSuccess: () => {
                        setEditSOP({});
                        generateSOP.mutate({
                          versionID: versionID,
                          documentID: section.document_id,
                          generatedID: section.generated_id,
                        });
                      },
                    }
                  );
                }}
              >
                <span>Save</span>
              </button>
            </article>
          ) : (
            <button
              className="justify-self-end px-2 py-1 dark:bg-filter dark:hover:bg-filter/60 duration-100 rounded-md"
              onClick={() =>
                setEditSOP({
                  [section.generated_id]: {
                    content: generateSOP.data,
                    page_metadata: [],
                  },
                })
              }
            >
              Edit
            </button>
          )}
          {editSOP[section.generated_id]?.content ? (
            <textarea
              disabled={!editSOP[section.generated_id]}
              spellCheck="false"
              autoComplete="off"
              value={editSOP[section.generated_id]?.content}
              onChange={(e) =>
                setEditSOP({
                  [section.generated_id]: {
                    content: e.target.value,
                    page_metadata: [],
                  },
                })
              }
              className="relative block p-3 tex-base w-full h-[20rem] dark:placeholder:text-slate-400 resize-none dark:bg-black border-none focus:ring-0 overflow-auto scrollbar"
            />
          ) : (
            <p className="grid gap-1 p-3 text-base dark:bg-black">
              {generateSOP.data
                ?.split("\\n")
                .map((phrase: string, index: number) => (
                  <span key={index}>{phrase}</span>
                ))}
            </p>
          )}
        </section>
      </ModalLayout>
    </>
  );
};

export default SuggestNewSections;
