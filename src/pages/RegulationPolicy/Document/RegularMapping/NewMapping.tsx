/* eslint-disable react-hooks/exhaustive-deps */
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import DocumentNameFilter from "src/components/Filter/RegulationPolicy/DocumentNameFilter";
import DocumentSectionFilter from "src/components/Filter/RegulationPolicy/DocumentSectionFilter";
import ModalLayout from "src/layouts/ModalLayout";
import { AddMapping } from "src/services/grc";
import { GetFrameworks } from "src/services/regulation-policy/framework";
import { GetPolicies } from "src/services/regulation-policy/policy";
import { GetGRCDocumentSectionsControls } from "src/services/regulation-policy/regulation-policy";

const NewMapping = ({ selectedType }: { selectedType: string }) => {
  const [show, setShow] = useState<boolean>(false);
  const [newMapping, setNewMapping] = useState<any>({
    source_document_id: "",
    source_version_id: "",
    target_document_id: sessionStorage.document_id,
    target_document_name: "",
    source_section_generated_id: "",
    target_section_generated_id: sessionStorage.generated_id,
    target_section_title: "",
    content: "",
    source_section_id: "",
    source_section_title: "",
  });

  const documentType = sessionStorage.document_type || "";
  const isPolicy = documentType === "policies";

  const addMapping = AddMapping();
  const { data: policies } = GetPolicies();
  const { data: frameworks } = GetFrameworks();
  const { data: sections } = GetGRCDocumentSectionsControls(
    "ready",
    isPolicy || (!isPolicy && selectedType === "RFS")
      ? "frameworks"
      : "policies",
    newMapping.source_document_id,
    isPolicy ? newMapping.source_version_id : "",
    1,
    "sections",
    "All"
  );

  const documentList =
    isPolicy || (!isPolicy && selectedType === "RFS")
      ? frameworks?.data
      : policies?.data;

  const handleOnClose = () => {
    setShow(false);
    sessionStorage.removeItem("open_new_mapping");
  };

  useEffect(() => {
    if (sessionStorage.open_new_mapping) setShow(true);
  }, [sessionStorage]);

  return (
    <section>
      <button
        onClick={() => {
          setShow(true);
          setNewMapping({
            source_document_id: "",
            source_version_id: "",
            target_document_id: sessionStorage.document_id,
            target_document_name: "",
            source_section_generated_id: "",
            target_section_generated_id: sessionStorage.generated_id,
            target_section_title: "",
            content: "",
            source_section_id: "",
            source_section_title: "",
          });
        }}
      >
        <FontAwesomeIcon icon={faPlusCircle} className="dark:text-checkbox" />{" "}
        Add New Mapping
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section className="flex flex-col flex-grow gap-5 h-[30rem]">
          <h4 className="text-base">
            <FontAwesomeIcon
              icon={faPlusCircle}
              className="dark:text-checkbox"
            />{" "}
            Add New Mapping
          </h4>
          <DocumentNameFilter
            newMapping={newMapping}
            setNewMapping={setNewMapping}
            list={documentList}
          />
          {newMapping.source_document_id !== "" && (
            <DocumentSectionFilter
              newMapping={newMapping}
              setNewMapping={setNewMapping}
              list={sections?.data
                .reduce((pV: any, cV: any) => [...pV, cV.sub_sections], [])
                .flat()}
            />
          )}
          {newMapping.content !== "" && (
            <article className="grid gap-2">
              <h4 className="dark:text-checkbox">Preview</h4>
              <p className="px-4 py-2 mr-10 dark:bg-admin/30 border dark:border-admin rounded-md">
                {newMapping.content?.slice(0, 300)}
                {newMapping.content?.length > 300 && "......"}
              </p>
            </article>
          )}

          <article className="flex items-center gap-5 mx-auto">
            <button
              disabled={
                newMapping.source_document_id === "" ||
                newMapping.target_document_id === "" ||
                newMapping.source_section_generated_id === "" ||
                newMapping.target_section_generated_id === ""
              }
              className="px-4 py-2 green-gradient-button"
              onClick={() => {
                addMapping.mutate({
                  sourceDocumentID: isPolicy
                    ? newMapping.source_document_id
                    : newMapping.target_document_id,
                  targetDocumentID: isPolicy
                    ? newMapping.target_document_id
                    : newMapping.source_version_id,
                  sourceSectionID: isPolicy
                    ? newMapping.source_section_generated_id
                    : newMapping.target_section_generated_id,
                  targetSectionID: isPolicy
                    ? newMapping.target_section_generated_id
                    : newMapping.source_section_generated_id,
                });
                setShow(false);
              }}
            >
              Add
            </button>
            <button
              className="px-4 py-2 grey-gradient-button"
              onClick={handleOnClose}
            >
              Cancel
            </button>
          </article>
        </section>
      </ModalLayout>
    </section>
  );
};

export default NewMapping;
