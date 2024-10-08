import {
  faCheck,
  faArrowRightLong,
  faInfoCircle,
  faXmark,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { useState } from "react";
import TextFilter from "src/components/Filter/General/TextFilter";
import { showVariants } from "src/constants/general";
import { GetDocumentStatus, GetGRCDocumentMetadata } from "src/services/grc";
import {
  GetPolicyVersions,
  UpdatePolicyName,
  UpdatePolicySections,
} from "src/services/regulation-policy/policy";
import { KeyStringVal } from "src/types/general";
import { convertToUTCShortString } from "src/utils/general";
import DeletePolicy from "../../Policies/DeletePolicy";
import DocumentTags from "./DocumentTags";
import RegionsVerticals from "./RegionsVerticals";
import UpdatePolicyVersion from "./UpdatePolicyVersion";

const DocumentMetadata = ({
  documentType,
  documentID,
  selectedPolicyVersion,
  setSelectedPolicyVersion,
  editSections,
  documentModified,
  setEditSections,
  setDocumentModified,
}: {
  documentType: string;
  documentID: string;
  selectedPolicyVersion?: string;
  setSelectedPolicyVersion?: (selectedPolicyVersion: string) => void;
  editSections?: any;
  documentModified?: any;
  setEditSections?: any;
  setDocumentModified?: any;
}) => {
  const [editPolicyName, setEditPolicyName] = useState<boolean>(false);
  const [policyName, setPolicyName] = useState<string>("");
  const [isVisible, setVisible] = useState<boolean>(true);

  const { data: documentMetadata } = GetGRCDocumentMetadata(
    documentType,
    documentID
  );
  const { data: policyVersions } = GetPolicyVersions(documentType, documentID);
  const updatePolicyName = UpdatePolicyName();
  const updatePolicySections = UpdatePolicySections();

  const versionID =
    policyVersions?.find(
      (version: KeyStringVal) => version.version === selectedPolicyVersion
    )?.version_id || "";

  const { data: documentStatus } = GetDocumentStatus(
    documentType,
    documentID,
    versionID
  );

  const documentName =
    documentMetadata?.framework_name || documentMetadata?.policy_name;
  const versions = policyVersions?.reduce(
    (pV: string[], cV: KeyStringVal) => [...pV, cV.version],
    []
  );
  const isPolicy = documentType === "policies";

  const handleEditPolicyName = () => {
    const formData = new FormData();

    formData.append("policy_name", policyName);
    updatePolicyName.mutate({
      policyID: documentID,
      formData: formData,
    });
    setEditPolicyName(false);
  };

  return (
    <>
      {documentMetadata && (
        <header className="grid gap-5">
          <article className="flex items-center justify-between gap-20">
            <article className="flex items-start gap-2">
              <img
                src={documentMetadata.thumbnail_uri}
                alt={documentMetadata.thumbnail_uri}
                className="w-10 h-10 rounded-full"
              />
              <article className="grid content-start gap-1">
                <header className="flex items-center justify-between gap-5">
                  <article className="flex flex-wrap items-center gap-10">
                    {editPolicyName ? (
                      <section className="flex items-center gap-2">
                        <button onClick={handleEditPolicyName}>
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-no hover:text-no/60 duration-100"
                          />
                        </button>
                        <article className="relative grid gap-2">
                          <input
                            type="input"
                            spellCheck="false"
                            autoComplete="off"
                            value={policyName}
                            onBlur={handleEditPolicyName}
                            onChange={(e) => setPolicyName(e.target.value)}
                            className="px-4 py-1 md:w-[30rem] text-xl dark:bg-filter/30 focus:outline-none"
                          />
                        </article>
                      </section>
                    ) : isPolicy ? (
                      <button
                        className="py-1 break-words text-left text-2xl dark:text-checkbox dark:disabled:hover:bg-transparent dark:hover:bg-filter/30 duration-100 rounded-sm"
                        onClick={() => {
                          setEditPolicyName(true);
                          setPolicyName(documentMetadata.policy_name);
                        }}
                      >
                        {documentMetadata.policy_name}
                      </button>
                    ) : (
                      <h4 className="py-1 break-words text-left text-2xl dark:text-checkbox">
                        {documentMetadata.framework_name}
                      </h4>
                    )}
                  </article>
                  <article className="flex items-center gap-10">
                    {documentMetadata?.policy_name &&
                      selectedPolicyVersion &&
                      setSelectedPolicyVersion && (
                        <>
                          <TextFilter
                            label="Version"
                            list={versions}
                            value={selectedPolicyVersion}
                            setValue={setSelectedPolicyVersion}
                          />
                          <UpdatePolicyVersion
                            documentName={documentName}
                            documentID={documentID}
                            setSelectedPolicyVersion={setSelectedPolicyVersion}
                          />
                        </>
                      )}
                    {isVisible ? (
                      documentStatus?.status === "failed" ? (
                        <motion.article
                          variants={showVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center gap-2 px-4 py-2 text-sm dark:bg-reset/30 border dark:border-reset rounded-sm"
                        >
                          <FontAwesomeIcon icon={faWarning} /> Error processing
                          your document!
                          <button onClick={() => setVisible(!isVisible)}>
                            <FontAwesomeIcon icon={faXmark} />
                          </button>
                        </motion.article>
                      ) : (
                        documentStatus?.status === "parsing" && (
                          <motion.article
                            variants={showVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center gap-2 px-4 py-2 text-sm dark:bg-event/30 border dark:border-event rounded-sm"
                          >
                            <FontAwesomeIcon icon={faInfoCircle} /> Uno is
                            currently processing the document!
                            <button onClick={() => setVisible(!isVisible)}>
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </motion.article>
                        )
                      )
                    ) : null}
                    {documentModified.length > 0 &&
                      documentModified.length ===
                        Object.keys(editSections).length && (
                        <article className="absolute top-10 left-1/2 -translate-x-1/2 grid gap-2 px-8 py-4 text-center dark:bg-expand border-1 dark:border-card/60 black-shadow rounded-md z-50">
                          <p>
                            You have modified this document. Would you like to
                            save your changes and remap it?
                          </p>
                          <article className="flex items-center gap-2 mx-auto">
                            <button
                              className="px-4 py-1 dark:bg-no dark:hover:bg-no/60 duration-100 rounded-md"
                              onClick={() => {
                                updatePolicySections.mutate({
                                  policyID: documentID,
                                  editSections: editSections,
                                });
                                setDocumentModified([]);
                                setEditSections({});
                              }}
                            >
                              Yes
                            </button>
                            <button
                              className="px-4 py-1 dark:bg-reset dark:hover:bg-reset/60 duration-100 rounded-md"
                              onClick={() => {
                                setDocumentModified([]);
                                setEditSections({});
                              }}
                            >
                              No
                            </button>
                          </article>
                        </article>
                      )}
                  </article>
                </header>
                <article className="flex flex-wrap items-center gap-3 text-sm dark:text-checkbox divide-x dark:divide-checkbox">
                  {documentMetadata.last_updated_at && (
                    <span>
                      {convertToUTCShortString(
                        documentMetadata.last_updated_at
                      )}
                    </span>
                  )}
                  {documentMetadata.regulatory_date && (
                    <span>
                      {convertToUTCShortString(
                        documentMetadata.regulatory_date
                      )}
                    </span>
                  )}
                  {(documentMetadata.regulatory_authority ||
                    documentMetadata.customer_name) && (
                    <span className="pl-3">
                      {documentMetadata.regulatory_authority ||
                        documentMetadata.customer_name}
                    </span>
                  )}
                </article>
              </article>
            </article>
            {documentMetadata.policy_name &&
              documentStatus?.status === "ready" && (
                <article className="flex items-center gap-5">
                  <DeletePolicy versionID={versionID} />
                </article>
              )}
          </article>
          {isPolicy && policyVersions?.length > 1 && (
            <article className="flex items-center gap-5">
              <a
                href={`/regulation-policy/document/policy-drift/details?policy_id=${documentID}&policy_name=${documentName}`}
                className="flex items-center gap-2 px-4 py-1 dark:hover:bg-filter/30 duration-100 rounded-full"
              >
                Policy Drift
                <FontAwesomeIcon icon={faArrowRightLong} />
              </a>
              <a
                href={`/regulation-policy/document/policy-drift-risk-assessment/details?policy_id=${documentID}&policy_name=${documentName}`}
                className="flex items-center gap-2 px-4 py-1 dark:hover:bg-filter/30 duration-100 rounded-full"
              >
                Policy Drift Risk Assessment
                <FontAwesomeIcon icon={faArrowRightLong} />
              </a>
            </article>
          )}
          {!isPolicy && (
            <>
              <DocumentTags
                documentType={documentType}
                documentID={documentID}
              />
              <RegionsVerticals
                documentType={documentType}
                documentID={documentID}
              />
            </>
          )}
        </header>
      )}
    </>
  );
};

export default DocumentMetadata;
