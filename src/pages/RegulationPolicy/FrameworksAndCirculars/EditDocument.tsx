/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import RegionFilter from "src/components/Filter/RegulationPolicy/RegionFilter";
import VerticalFilter from "src/components/Filter/RegulationPolicy/VerticalFilter";
import ModalLayout from "src/layouts/ModalLayout";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  AddScanners,
  GetFrameworkOrCircularMetadataForEdit,
  GetFrameworkScanners,
  RemoveScanners,
  UpdateFramework,
} from "src/services/regulation-policy/framework";
import AdditionalRegAuth from "./NewDocument/AdditionalRegAuth";
import RegularInput from "src/components/Input/RegularInput";
import { checkSuperOrGRCAdmin } from "src/utils/general";

const EditDocument = ({
  documentType,
  documentID,
}: {
  documentType: string;
  documentID: string;
}) => {
  const isSuperOrGRCAdmin = checkSuperOrGRCAdmin();

  const [show, setShow] = useState<boolean>(false);
  const [inputs, setInputs] = useState<any>({
    framework_name: "",
    additional_regulatory_authorities: [],
    regions: [],
    verticals: [],
    scanners: [],
  });

  const { data: documentMetadata } = GetFrameworkOrCircularMetadataForEdit(
    documentType,
    documentID,
    show
  );
  const editDocument = UpdateFramework(documentID);
  const { data: frameworkScanners } = GetFrameworkScanners(documentID, show);
  const addScanners = AddScanners(documentID);
  const removeScanners = RemoveScanners(documentID);

  const documentTypePhrase =
    documentType === "frameworks" ? "Framework" : "Circular";

  const handleOnClose = () => setShow(false);

  useEffect(() => {
    if (documentMetadata && frameworkScanners && inputs.framework_name === "")
      setInputs({
        framework_name: documentMetadata.framework_name || "",
        additional_regulatory_authorities:
          documentMetadata?.additional_regulatory_authorities || [],
        regions: documentMetadata?.regions || [],
        verticals: documentMetadata?.verticals || [],
        scanners: frameworkScanners || [],
      });
  }, [documentMetadata, frameworkScanners]);

  return (
    <>
      <button
        className="flex items-center p-2 dark:bg-signin dark:hover:bg-signin/60 duration-100 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          setShow(true);
        }}
      >
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        <section
          className="grid content-start gap-5 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="text-lg">Edit {documentTypePhrase}</h4>
          {documentTypePhrase === "Framework" && (
            <>
              {isSuperOrGRCAdmin && (
                <RegularInput
                  label="Framework Name"
                  keyName="framework_name"
                  inputs={inputs}
                  setInputs={setInputs}
                  required
                />
              )}
              <AdditionalRegAuth
                documentType={documentTypePhrase}
                inputs={inputs}
                setInputs={setInputs}
              />
            </>
          )}
          <RegionFilter label="Region" inputs={inputs} setInputs={setInputs} />
          <VerticalFilter
            label="Vertical"
            inputs={inputs}
            setInputs={setInputs}
          />
          <button
            className="justify-self-end px-4 py-1 mx-auto gradient-button"
            onClick={() => {
              const formData = new FormData();

              if (inputs.framework_name !== "")
                formData.append("framework_name", inputs.framework_name);
              if (inputs.additional_regulatory_authorities.length > 0)
                inputs.additional_regulatory_authorities.forEach(
                  (auth: string) =>
                    formData.append("additional_regulatory_authorities", auth)
                );
              if (inputs.regions.length > 0)
                inputs.regions.forEach((region: string) =>
                  formData.append("regions", region)
                );
              if (inputs.verticals.length > 0)
                inputs.verticals.forEach((vertical: string) =>
                  formData.append("verticals", vertical)
                );
              editDocument.mutate({
                formData: formData,
              });
              addScanners.mutate({
                scanners:
                  frameworkScanners?.length > 0
                    ? inputs.scanners.filter(
                        (scanner: string) =>
                          !frameworkScanners.includes(scanner)
                      )
                    : inputs.scanners,
              });
              removeScanners.mutate({
                scanners:
                  frameworkScanners?.length > 0
                    ? frameworkScanners.filter(
                        (scanner: string) => !inputs.scanners.includes(scanner)
                      )
                    : inputs.scanners,
              });

              handleOnClose();
            }}
          >
            Save
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default EditDocument;
