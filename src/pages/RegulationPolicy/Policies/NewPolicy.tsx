import React, { useState } from "react";
import RegularInput from "src/components/Input/RegularInput";
import ModalLayout from "src/layouts/ModalLayout";
import {
  AddPoliciesToPolicyGroup,
  GetPolicyGroups,
  UploadPolicyVersion,
} from "src/services/regulation-policy/policy";
import FileInput from "src/components/Input/FileInput";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faExclamationCircle,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import {
  FilterFrameworks,
  GetAvailableFrameworks,
  GetFrameworks,
} from "src/services/regulation-policy/framework";
import { KeyStringVal } from "src/types/general";
import TablePagination from "src/components/General/TablePagination";
import { pageSize } from "src/constants/general";
import { queryClient } from "src/App";

const NewPolicy = () => {
  const navigate = useNavigate();

  const selectedPolicyGroupID = sessionStorage.selectedPolicyGroupID;

  const [show, setShow] = useState<boolean>(false);
  const [newPolicyID, setNewPolicyID] = useState<string>("");
  const [selectedPolicyGroupIDs, setSelectedPolicyGroupIDs] = useState<
    string[]
  >(selectedPolicyGroupID !== "" ? [selectedPolicyGroupID] : []);
  const [inputs, setInputs] = useState<any>({
    policy_id: "",
    policy_name: "",
    policy_version: "",
    file: "",
    file_uri: "",
  });
  const [selectedFrameworkIDs, setSelectedFrameworkIDs] = useState<string[]>(
    []
  );
  const [pageNumber, setPageNumber] = useState<number>(1);

  const { data: availableFrameworks } = GetAvailableFrameworks(pageNumber);
  const { data: frameworks } = GetFrameworks();
  const filterFrameworks = FilterFrameworks();
  const uploadPolicyVersion = UploadPolicyVersion();
  const addPoliciesToPolicyGroup = AddPoliciesToPolicyGroup();
  const { data: policyGroups } = GetPolicyGroups();

  const totalCount = availableFrameworks?.data.length || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  const handleOnClose = () => setShow(false);
  const handleOnCloseConfirmation = () => setNewPolicyID("");

  return (
    <>
      <button
        className="flex items-center gap-2 px-8 py-2 mx-auto text-base dark:text-white green-gradient-button rounded-sm"
        onClick={() => {
          setShow(true);
          setInputs({
            policy_id: "",
            policy_name: "",
            policy_version: "v1",
            file: "",
            file_uri: "",
          });
        }}
      >
        <FontAwesomeIcon icon={faUpload} />
        <h4>Upload Policy</h4>
      </button>
      <ModalLayout showModal={show} onClose={handleOnClose}>
        {frameworks ? (
          frameworks.data.length > 0 ? (
            <section className="grid content-start gap-5 h-full overflow-auto scrollbar">
              <h3 className="flex items-center gap-2 text-lg">
                <FontAwesomeIcon icon={faUpload} />
                Upload Policy
              </h3>
              <article className="grid gap-2">
                <h4>Select Policy Groups (optional): </h4>
                <nav className="flex items-center gap-2 pb-4 w-full overflow-auto scrollbar">
                  {policyGroups?.map((policyGroup: KeyStringVal) => {
                    return (
                      <button
                        key={policyGroup.policy_group_id}
                        className={`flex items-center gap-2 px-4 py-1 h-full text-center capitalize ${
                          selectedPolicyGroupIDs.includes(
                            policyGroup.policy_group_id
                          )
                            ? "selected-button"
                            : "not-selected-button"
                        }`}
                        onClick={() => {
                          if (
                            selectedPolicyGroupIDs.includes(
                              policyGroup.policy_group_id
                            )
                          )
                            setSelectedPolicyGroupIDs(
                              selectedPolicyGroupIDs.filter(
                                (policyGroupID) =>
                                  policyGroupID !== policyGroup.policy_group_id
                              )
                            );
                          else
                            setSelectedPolicyGroupIDs([
                              ...selectedPolicyGroupIDs,
                              policyGroup.policy_group_id,
                            ]);
                        }}
                      >
                        {policyGroup.title}
                      </button>
                    );
                  })}
                </nav>
              </article>

              <section className="grid md:grid-cols-2 gap-10">
                <RegularInput
                  label="Policy Name"
                  keyName="policy_name"
                  inputs={inputs}
                  setInputs={setInputs}
                  required
                />
                <RegularInput
                  label="Policy Version"
                  keyName="policy_version"
                  inputs={inputs}
                  setInputs={setInputs}
                  required
                />
              </section>
              <RegularInput
                label="File URL (optional)"
                keyName="file_uri"
                inputs={inputs}
                setInputs={setInputs}
              />
              <FileInput
                label="Policy"
                keyName="file"
                types={["pdf", "docx"]}
                inputs={inputs}
                setInputs={setInputs}
              />
              <button
                disabled={
                  inputs.policy_name === "" ||
                  inputs.policy_version === "" ||
                  (inputs.file === "" && inputs.file_uri === "")
                }
                className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white green-gradient-button rounded-sm"
                onClick={() => {
                  const formData = new FormData();

                  formData.append("policy_name", inputs.policy_name);
                  formData.append("policy_version", inputs.policy_version);
                  if (inputs.file) formData.append("file", inputs.file);
                  if (inputs.file_uri)
                    formData.append("file_uri", inputs.file_uri);

                  uploadPolicyVersion.mutate(
                    {
                      formData: formData,
                    },
                    {
                      onSuccess: (data) => {
                        queryClient.invalidateQueries([
                          "get-policies-from-group",
                        ]);
                        selectedPolicyGroupIDs.forEach((policyGroupID) =>
                          addPoliciesToPolicyGroup.mutate(
                            {
                              policyGroupID: policyGroupID,
                              policyIDs: [data.policy_id],
                            },
                            {
                              onSuccess: () => setNewPolicyID(data.policy_id),
                            }
                          )
                        );
                      },
                    }
                  );
                  handleOnClose();
                }}
              >
                Done
              </button>
            </section>
          ) : (
            <section className="grid gap-3">
              <h4 className="flex items-center gap-2 mx-auto text-lg">
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className="dark:text-signin"
                />
                Please select at least one framework before uploading your
                policy
              </h4>
              <TablePagination
                totalPages={totalPages}
                beginning={beginning}
                end={end}
                totalCount={totalCount}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
              <ul className="flex flex-col flex-grow gap-3 pb-4 w-full h-[25rem] overflow-auto scrollbar">
                {availableFrameworks?.data.map(
                  (framework: KeyStringVal, index: number) => {
                    return (
                      <li
                        key={index}
                        className={`flex items-start justify-between gap-20 p-4 break-words cursor-pointer font-extralight text-left text-base dark:text-white dark:bg-list dark:hover:bg-filter/30 black-shadow ${
                          selectedFrameworkIDs.includes(framework.id)
                            ? "border-2 dark:border-signin"
                            : ""
                        }`}
                        onClick={() => {
                          if (!selectedFrameworkIDs.includes(framework.id))
                            setSelectedFrameworkIDs([
                              ...selectedFrameworkIDs,
                              framework.id,
                            ]);
                          else
                            setSelectedFrameworkIDs(
                              selectedFrameworkIDs.filter(
                                (id) => id !== framework.id
                              )
                            );
                        }}
                      >
                        <article className="flex items-start gap-2 w-full">
                          <img
                            src={framework.thumbnail_uri}
                            alt={framework.regulatory_authority}
                            className="w-6 h-6 rounded-full"
                          />
                          <h4 className="font-medium">{framework.name}</h4>
                        </article>
                      </li>
                    );
                  }
                )}
              </ul>
              <button
                disabled={filterFrameworks.status === "loading"}
                className="flex items-center justify-self-center gap-2 px-4 py-2 w-max dark:text-white gradient-button rounded-sm"
                onClick={() =>
                  filterFrameworks.mutate({
                    frameworkIDs: selectedFrameworkIDs,
                  })
                }
              >
                <h4>Select Frameworks</h4>
              </button>
            </section>
          )
        ) : null}
      </ModalLayout>
      <ModalLayout
        showModal={newPolicyID !== ""}
        onClose={handleOnCloseConfirmation}
      >
        <section className="grid content-start gap-5 py-4 h-full mx-auto text-center">
          <img
            src="/general/checkmark.svg"
            alt="checkmark"
            className="w-12 h-12 mx-auto"
          />
          <span className="text-2xl italic">{inputs.policy_name} </span>
          <h3 className="text-lg">
            has been uploaded. GRC Copilot is on it! Will notify you as soon as
            the document is read, parsed, understood, and analyzed by the
            Copilot.
          </h3>
          <button
            className="px-4 py-2 mx-auto w-max dark:bg-filter/60 dark:hover:bg-filter/30 duration-100 rounded-full"
            onClick={() => {
              navigate(
                `/regulation-policy/document/details?document_type=policies&document_id=${newPolicyID}&policy_version_id=${uploadPolicyVersion?.data?.version_id}`
              );
              handleOnCloseConfirmation();
            }}
          >
            <h4>
              Go to Policy <FontAwesomeIcon icon={faArrowRightLong} />
            </h4>
          </button>
        </section>
      </ModalLayout>
    </>
  );
};

export default NewPolicy;
