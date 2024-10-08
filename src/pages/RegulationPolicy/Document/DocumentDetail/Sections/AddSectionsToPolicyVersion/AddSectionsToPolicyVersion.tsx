import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Loader from "src/components/Loader/Loader";
import ModalLayout from "src/layouts/ModalLayout";
import {
  CopyUpdateVersion,
  GetPolicyVersions,
} from "src/services/regulation-policy/policy";
import { KeyStringVal } from "src/types/general";
import VersionTimeline from "./VersionTimeline";
import Preview from "./Preview";

const AddSectionsToPolicyVersion = ({
  documentType,
  documentID,
  docID,
  selectedAddedSections,
  addSectionsToPolicy,
  setAddSectionsToPolicy,
  setSelectedAddedSections,
}: {
  documentType: string;
  documentID: string;
  docID: string;
  selectedAddedSections: any;
  addSectionsToPolicy: boolean;
  setAddSectionsToPolicy: (addSectionsToPolicy: boolean) => void;
  setSelectedAddedSections: any;
}) => {
  const [saveSections, setSaveSections] = useState<boolean>(false);
  const [newVersionNumber, setNewVersionNumber] = useState<string>("");
  const [valid, setValid] = useState<boolean>(true);

  const { data: policyVersions } = GetPolicyVersions(documentType, documentID);
  const copyUpdateVersion = CopyUpdateVersion();

  const handleOnAdd = () => {
    if (
      policyVersions?.some(
        (policyVersion: KeyStringVal) =>
          policyVersion.version.trim() === newVersionNumber.trim()
      )
    )
      setValid(false);
    else {
      setValid(true);
      setAddSectionsToPolicy(false);
      setSelectedAddedSections([]);
      copyUpdateVersion.mutate({
        policyID: documentID,
        versionID: docID,
        versionNumber: newVersionNumber,
        sections: selectedAddedSections,
      });
    }
  };

  return (
    <article className="flex items-center gap-2">
      {!addSectionsToPolicy ? (
        <button
          className="flex items-center gap-1 px-2 py-1 text-sm dark:bg-admin dark:hover:bg-admin/60 duration-100 rounded-md"
          onClick={() => {
            setAddSectionsToPolicy(true);
            setSelectedAddedSections([]);
            setSaveSections(false);
            copyUpdateVersion.reset();
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add sections to new policy version
        </button>
      ) : (
        <article className="flex items-center gap-5">
          {selectedAddedSections.length} sections selected
          <button
            className="discard-button"
            onClick={() => {
              setAddSectionsToPolicy(false);
              setSelectedAddedSections([]);
            }}
          >
            Discard
          </button>
          {selectedAddedSections.length > 0 && (
            <button
              className="save-button"
              onClick={() => {
                setSaveSections(true);
                setNewVersionNumber("");
              }}
            >
              Save
            </button>
          )}
          <ModalLayout
            showModal={saveSections}
            onClose={() => {
              setSaveSections(false);
              setNewVersionNumber("");
              copyUpdateVersion.reset();
            }}
          >
            {copyUpdateVersion.status === "loading" ? (
              <Loader />
            ) : copyUpdateVersion.status === "success" ? (
              <article className="grid gap-2 py-10">
                <img
                  src="/general/checkmark.svg"
                  alt="checkmark"
                  className="mx-auto w-20 h-20"
                />
                <h3 className="text-center text-lg">
                  The selected sections have been added to the new policy
                  version!
                </h3>
              </article>
            ) : (
              <section className="grid gap-5 mt-5">
                <h3 className="text-xl">Add sections to new policy version</h3>
                <VersionTimeline
                  documentType={documentType}
                  documentID={documentID}
                />
                <Preview selectedAddedSections={selectedAddedSections} />
                <input
                  type="input"
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="Enter new version number"
                  value={newVersionNumber}
                  onChange={(e) => setNewVersionNumber(e.target.value)}
                  className="p-4 w-full h-10 text-sm dark:bg-search focus:outline-none"
                />
                {!valid && (
                  <span className="text-xs text-left dark:text-reset font-light tracking-wider">
                    Version already exists
                  </span>
                )}
                <button
                  className="px-2 py-1 text-sm dark:bg-admin dark:hover:bg-admin/60 duration-100 rounded-md"
                  onClick={handleOnAdd}
                >
                  Add
                </button>
              </section>
            )}
          </ModalLayout>
        </article>
      )}
    </article>
  );
};

export default AddSectionsToPolicyVersion;
