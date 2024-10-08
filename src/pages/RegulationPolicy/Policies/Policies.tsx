/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useState } from "react";
import { KeyNumVal, KeyStringVal } from "src/types/general";
import NewPolicy from "./NewPolicy";
import {
  AddPoliciesToPolicyGroup,
  GetPoliciesFromGroup,
  GetPolicyGroups,
  GetPolicyMapping,
  RemovePoliciesFromPolicyGroup,
} from "src/services/regulation-policy/policy";
import { useNavigate } from "react-router-dom";
import {
  convertToDate,
  convertToMin,
  convertToUTCShortString,
} from "src/utils/general";
import TablePagination from "src/components/General/TablePagination";
import { attributeColors, pageSize } from "src/constants/general";
import {
  faChevronCircleDown,
  faChevronCircleRight,
  faClock,
  faCopy,
  faRotateBackward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure, Popover, Transition } from "@headlessui/react";
import Loader from "src/components/Loader/Loader";
import { utcFormat } from "d3-time-format";

const Policies = ({
  policyGroup,
  selectedPolicyGroup,
  setSelectedPolicyGroup,
}: {
  policyGroup: string;
  selectedPolicyGroup: boolean;
  setSelectedPolicyGroup: (selectedPolicyGroup: boolean) => void;
}) => {
  const navigate = useNavigate();

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedPolicyID, setSelectedPolicyID] = useState<string>("");
  const [selectedPolicyIDs, setSelectedPolicyIDs] = useState<string[]>([]);
  const [filters, setFilters] = useState<any>({
    in_progress: false,
  });

  const selectedPolicyGroupID = sessionStorage.selectedPolicyGroupID;

  const { data: policyGroups } = GetPolicyGroups();
  const { data: policies, status: policyStatus } = GetPoliciesFromGroup(
    selectedPolicyGroupID,
    pageNumber
  );
  const { data: policyMapping } = GetPolicyMapping(selectedPolicyID);
  const addPoliciesToPolicyGroup = AddPoliciesToPolicyGroup();
  const removePoliciesFromPolicyGroup = RemovePoliciesFromPolicyGroup();

  const filteredPolicyGroups = policyGroups?.filter(
    (policyGroup: KeyStringVal) =>
      policyGroup.policy_group_id !== selectedPolicyGroupID
  );
  const filteredPolicies = filters.in_progress
    ? policies?.data?.filter((doc: KeyNumVal) => doc.estimated_time_left > 0)
    : policies?.data;
  const totalCount = policies?.pager.total_results || 0;
  const totalPages = policies?.pager.num_pages || 0;
  const beginning =
    pageNumber === 1 ? 1 : pageSize * ((pageNumber || 1) - 1) + 1;
  const end = pageNumber === totalPages ? totalCount : beginning + pageSize - 1;

  const handleReturn = () => {
    sessionStorage.removeItem("selectedPolicyGroupID");
    setSelectedPolicyGroup(!selectedPolicyGroup);
  };

  return (
    <section className="flex flex-col flex-grow gap-5 h-full overflow-auto scrollbar">
      {policyStatus === "loading" ? (
        <Loader />
      ) : policyStatus === "success" ? (
        policies?.data?.length > 0 ? (
          <section className="flex flex-col flex-grow gap-3 pb-4 w-full h-full overflow-auto scrollbar">
            <article className="flex items-center justify-between gap-10">
              <article className="flex items-center gap-5">
                <button
                  className="flex gap-2 items-center w-max tracking-wide text-sm dark:text-checkbox dark:hover:text-checkbox/50 duration-100"
                  onClick={handleReturn}
                >
                  <FontAwesomeIcon icon={faRotateBackward} />
                  <span>Return</span>
                </button>

                <h4 className="text-xl">{policyGroup}</h4>
              </article>
            </article>
            <NewPolicy />
            <article className="flex items-center justify-between gap-10">
              <article className="flex items-center gap-10">
                <article className="flex items-center gap-5 divide-x dark:divide-checkbox">
                  <button
                    className="dark:hover:text-checkbox/60 duration-100"
                    onClick={() => {
                      setSelectedPolicyIDs(
                        filteredPolicies?.reduce(
                          (pV: string[], cV: KeyStringVal) => [
                            ...pV,
                            cV.policy_id,
                          ],
                          []
                        )
                      );
                    }}
                  >
                    Select All
                  </button>
                  <button
                    className="pl-5 dark:hover:text-checkbox/60 duration-100"
                    onClick={() => setSelectedPolicyIDs([])}
                  >
                    Deselect All
                  </button>
                </article>
                {selectedPolicyIDs.length > 0 && (
                  <article className="flex items-center gap-5">
                    <Popover
                      as="article"
                      className="relative inline-block text-left"
                    >
                      <article className="relative group">
                        <span className="hidden group-hover:grid p-2 w-max absolute bottom-7 dark:bg-tooltip rounded-md">
                          Copy policies to another policy group
                        </span>
                        <Popover.Button className="flex items-center gap-2 group dark:hover:text-checkbox/60 duration-100">
                          <FontAwesomeIcon icon={faCopy} />
                          <h4>Copy to</h4>
                        </Popover.Button>
                      </article>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Popover.Panel className="absolute left-2 grid w-max -mr-5 mt-2 gap-2 origin-top-right focus:outline-none text-sm dark:text-white dark:bg-account z-50 rounded-sm">
                          {({ close }) => (
                            <>
                              {filteredPolicyGroups ? (
                                filteredPolicyGroups.length > 0 ? (
                                  <nav className="grid content-start w-full max-h-60 z-50 overflow-auto scrollbar">
                                    {filteredPolicyGroups.map(
                                      (policyGroup: KeyStringVal) => {
                                        return (
                                          <button
                                            key={policyGroup.policy_group_id}
                                            className="flex items-center gap-3 px-4 pr-10 py-2 w-full text-left dark:bg-account dark:hover:bg-mention duration-100"
                                            onClick={() => {
                                              setSelectedPolicyIDs([]);
                                              addPoliciesToPolicyGroup.mutate({
                                                policyGroupID:
                                                  policyGroup.policy_group_id,
                                                policyIDs: selectedPolicyIDs,
                                              });
                                              close();
                                            }}
                                          >
                                            <p className="grid text-sm">
                                              {policyGroup.title}
                                            </p>
                                          </button>
                                        );
                                      }
                                    )}
                                  </nav>
                                ) : (
                                  <section className="grid gap-2 px-5 py-3 w-max origin-top-right focus:outline-none text-xs dark:text-white dark:bg-account z-50 rounded-sm">
                                    <h4>No policy groups</h4>
                                  </section>
                                )
                              ) : null}
                            </>
                          )}
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                    {!["default", "all"].includes(
                      policyGroup.toLowerCase()
                    ) && (
                      <>
                        or
                        <button
                          className="px-4 py-1 dark:bg-reset/30 dark:hover:bg-reset/60 duration-100 border dark:border-reset"
                          onClick={() => {
                            setSelectedPolicyIDs([]);
                            removePoliciesFromPolicyGroup.mutate({
                              policyGroupID: selectedPolicyGroupID,
                              policyIDs: selectedPolicyIDs,
                            });
                          }}
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </article>
                )}
                <article className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.in_progress}
                    onChange={() =>
                      setFilters({
                        ...filters,
                        in_progress: !filters.in_progress,
                      })
                    }
                    className="form-checkbox w-4 h-4 dark:ring-0 dark:text-no dark:focus:border-no focus:ring dark:focus:ring-offset-0 dark:focus:ring-no focus:ring-opacity-50 rounded-full"
                  />
                  <label>In progress</label>
                </article>
              </article>
              <TablePagination
                totalPages={totalPages}
                beginning={beginning}
                end={end}
                totalCount={totalCount}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
            </article>
            <ul className="flex flex-col flex-grow gap-3 pb-2 overflow-auto scrollbar">
              {filteredPolicies?.map((policy: any, index: number) => {
                return (
                  <li key={index} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedPolicyIDs.includes(policy.policy_id)}
                      className="mt-5 w-10 h-10 border-0 dark:focus:ring-0 dark:text-signin dark:focus:border-signin focus:ring dark:focus:ring-offset-0 dark:focus:ring-signin focus:ring-opacity-50"
                      onChange={() => {
                        if (selectedPolicyIDs.includes(policy.policy_id)) {
                          setSelectedPolicyIDs(
                            selectedPolicyIDs.filter(
                              (id: string) => id !== policy.policy_id
                            )
                          );
                        } else
                          setSelectedPolicyIDs([
                            ...selectedPolicyIDs,
                            policy.policy_id,
                          ]);
                      }}
                    />
                    <article className="grid gap-3 p-4 w-full cursor-pointer break-words text-left text-base bg-gradient-to-r dark:from-admin/70 dark:to-white/10 dark:hover:to-white/30 rounded-md">
                      {policy.status === "READY" ? (
                        <span
                          className={`text-sm ${
                            attributeColors[policy.status.toLowerCase()]
                          }`}
                        >
                          {policy.status.replaceAll("_", " ")}
                        </span>
                      ) : (
                        policy.estimated_time_left > 0 && (
                          <span className="px-3 py-1 w-max text-sm dark:bg-purple-500 rounded-full">
                            <FontAwesomeIcon icon={faClock} /> Check back in{" "}
                            {utcFormat(
                              `${
                                convertToMin(policy.estimated_time_left) > 60
                                  ? "%H hr %M min"
                                  : convertToMin(policy.estimated_time_left) >=
                                    1
                                  ? "%M min"
                                  : "%S sec"
                              }`
                            )(convertToDate(policy.estimated_time_left))}{" "}
                          </span>
                        )
                      )}
                      <article
                        className="flex items-start justify-between gap-2 w-full"
                        onClick={() => {
                          sessionStorage.GRCCategory = "policies";
                          navigate(
                            `/regulation-policy/document/details?document_type=policies&document_id=${policy.policy_id}`
                          );
                        }}
                      >
                        <article className="flex items-start gap-2 w-3/5">
                          <img
                            src={policy.thumbnail_uri}
                            alt={policy.policy_name}
                            className="w-7 h-7 rounded-full"
                          />
                          <h4 className="text-xl font-medium">
                            {policy.policy_name}
                          </h4>
                        </article>
                        <span>
                          {policy.last_updated_at &&
                            convertToUTCShortString(
                              Number(policy.last_updated_at)
                            )}
                          {policy.customer_name && (
                            <span> {`| ${policy.customer_name}`}</span>
                          )}{" "}
                        </span>
                      </article>
                      <article className="grid gap-3 pb-3">
                        <article className="flex items-center gap-5">
                          <span>
                            Total sections: {policy.total_sections || "N/A"}
                          </span>
                          <span>
                            Mapped sections: {policy.mapped_sections || "N/A"}
                          </span>
                        </article>
                        <Disclosure>
                          {({ open }) => (
                            <section className="grid content-start gap-3">
                              <Disclosure.Button
                                className="flex items-center gap-2 w-max text-sm"
                                onClick={() =>
                                  setSelectedPolicyID(policy.policy_id)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={
                                    open
                                      ? faChevronCircleDown
                                      : faChevronCircleRight
                                  }
                                  className="text-left dark:text-black"
                                />
                                <p>{open ? "Hide" : "Show"} frameworks</p>
                              </Disclosure.Button>
                              <Disclosure.Panel>
                                {policyMapping ? (
                                  policyMapping.length > 0 ? (
                                    <section className="flex flex-col flex-grow gap-3 overflow-auto scrollbar">
                                      {policyMapping.map((framework: any) => {
                                        return (
                                          <article
                                            key={framework.framework_id}
                                            className="grid gap-2 px-4 py-2 border-l dark:border-black"
                                          >
                                            <h4>{framework.framework_name}</h4>
                                            <Disclosure>
                                              {({ open }) => (
                                                <section className="grid content-start gap-3 text-sm">
                                                  <Disclosure.Button
                                                    className="flex items-center gap-2 w-max"
                                                    onClick={() =>
                                                      setSelectedPolicyID(
                                                        policy.policy_id
                                                      )
                                                    }
                                                  >
                                                    <FontAwesomeIcon
                                                      icon={
                                                        open
                                                          ? faChevronCircleDown
                                                          : faChevronCircleRight
                                                      }
                                                      className="text-left dark:text-black"
                                                    />
                                                    <p>
                                                      {open ? "Hide" : "Show"}{" "}
                                                      {
                                                        framework
                                                          .framework_mapped_section_ids
                                                          .length
                                                      }{" "}
                                                      mapped section
                                                      {framework
                                                        .framework_mapped_section_ids
                                                        .length !== 1 && "s"}
                                                    </p>
                                                  </Disclosure.Button>
                                                  <Disclosure.Panel>
                                                    <article className="grid gap-2 max-h-[10rem] overflow-auto scrollbar">
                                                      {framework.framework_mapped_section_ids.map(
                                                        (
                                                          section: KeyStringVal
                                                        ) => {
                                                          return (
                                                            <a
                                                              key={
                                                                section.mapped_section_id
                                                              }
                                                              href="/grc/mapping"
                                                              className="grid gap-2 px-2 py-1 hover:underlined bg-gradient-to-r dark:from-checkbox/70 dark:to-white/10 dark:hover:to-white/60 rounded-md"
                                                              onClick={() => {
                                                                sessionStorage.document_type =
                                                                  "frameworks";
                                                                sessionStorage.document_name =
                                                                  framework.framework_name;
                                                                sessionStorage.document_id =
                                                                  framework.framework_id ||
                                                                  "";
                                                                sessionStorage.generated_id =
                                                                  section.mapped_section_id ||
                                                                  "";
                                                                sessionStorage.section_title =
                                                                  section.section_title ||
                                                                  "";
                                                                sessionStorage.sub_section_title =
                                                                  section.sub_section_title ||
                                                                  "";
                                                                sessionStorage.sub_section_id =
                                                                  section.sub_section_id ||
                                                                  "";
                                                                sessionStorage.content =
                                                                  section.content;
                                                                sessionStorage.policy_id =
                                                                  policy.policy_id ||
                                                                  "";
                                                              }}
                                                            >
                                                              {section.section_title && (
                                                                <h4 className="text-lg border-b dark:border-black">
                                                                  {section.section_id !==
                                                                    "-" &&
                                                                    section.section_id}{" "}
                                                                  {
                                                                    section.section_title
                                                                  }
                                                                </h4>
                                                              )}
                                                              <h4 className="text-base">
                                                                {section.sub_section_id !==
                                                                  "-" &&
                                                                  section.sub_section_id}{" "}
                                                                {
                                                                  section.sub_section_title
                                                                }
                                                              </h4>
                                                            </a>
                                                          );
                                                        }
                                                      )}
                                                    </article>
                                                  </Disclosure.Panel>
                                                </section>
                                              )}
                                            </Disclosure>
                                          </article>
                                        );
                                      })}
                                    </section>
                                  ) : (
                                    <p>No frameworks available</p>
                                  )
                                ) : null}
                              </Disclosure.Panel>
                            </section>
                          )}
                        </Disclosure>
                      </article>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : (
          <section className="grid place-content-center gap-5 mt-10">
            <button
              className="flex gap-2 items-center mx-auto tracking-wide text-lg dark:text-checkbox dark:hover:text-checkbox/50 duration-100"
              onClick={handleReturn}
            >
              <FontAwesomeIcon icon={faRotateBackward} />
              <span>Return</span>
            </button>
            <section className="flex items-center place-content-center gap-10 w-full h-full">
              <img
                src="/grc/policies-placeholder.svg"
                alt="policies placeholder"
                className="w-40 h-40"
              />
              <article className="grid gap-3">
                <h4 className="text-xl font-extrabold">Policies</h4>
                <h4>No policies available</h4>
                <NewPolicy />
              </article>
            </section>
          </section>
        )
      ) : null}
    </section>
  );
};

export default Policies;
