/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import { convertToUTCString, sortRows } from "src/utils/general";
import { ListHeader } from "src/types/general";
import SortColumn from "src/components/Button/SortColumn";
import ReactJson from "react-json-view";
import KeyValuePair from "src/components/General/KeyValuePair";
import { Popover, Transition } from "@headlessui/react";
import {
  faChevronDown,
  faChevronUp,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetIAMRisksPolicies } from "src/services/summaries/iam-risks";
import { useSummaryStore } from "src/stores/summaries";
import parse from "html-react-parser";
import { severityColors } from "src/constants/summaries";
import { initialSort } from "src/constants/general";

const Policies = () => {
  const { selectedReportAccount } = useSummaryStore();

  const [selectedPolicyType, setSelectedPolicyType] =
    useState<string>("Customer");
  const [selectedPolicy, setSelectedPolicy] = useState<string>("");
  const [sort, setSort] = useState(initialSort);

  const integrationType = selectedReportAccount?.integration_type || "";
  const sourceAccountID = selectedReportAccount?.customer_cloud_id || "";

  const { data: policies } = GetIAMRisksPolicies(
    integrationType,
    sourceAccountID
  );

  const filteredPolicies = policies?.data.filter(
    (policy: { policy_type: string }) =>
      policy.policy_type
        .toLowerCase()
        .includes(selectedPolicyType.toLowerCase())
  );
  const sortedPolicies = filteredPolicies && sortRows(filteredPolicies, sort);
  const headers = policies?.metadata.headers;
  const categories = [
    ...new Set(
      policies?.data.reduce(
        (pV: string[], cV: any) => [...pV, cV.policy_type],
        []
      )
    ),
  ].sort() as string[];

  useEffect(() => {
    setSelectedPolicy("");
  }, [selectedReportAccount, selectedPolicyType]);

  useEffect(() => {
    setSelectedPolicyType("");
  }, [selectedReportAccount]);

  useEffect(() => {
    if (selectedPolicyType === "" && categories?.length > 0)
      setSelectedPolicyType(categories[0]);
  }, [categories]);

  return (
    <section className="flex flex-col flex-grow gap-5 p-4 dark:bg-panel black-shadow">
      <nav className="flex items-center gap-2 text-sm w-full">
        {categories?.map((policy: string) => {
          return (
            <article
              key={policy}
              className={`grid gap-3 p-2 cursor-pointer w-full text-center ${
                selectedPolicyType === policy
                  ? "selected-button"
                  : "not-selected-button"
              }`}
              onClick={() => setSelectedPolicyType(policy)}
            >
              <h4>{policy.replaceAll("_", " ")}</h4>
            </article>
          );
        })}
      </nav>

      {sortedPolicies ? (
        sortedPolicies.length > 0 ? (
          <section className="flex flex-col flex-grow gap-5">
            <h4 className="w-max">
              {selectedPolicyType.replaceAll("_", " ")} (
              {sortedPolicies?.length})
            </h4>
            <section className="flex flex-col flex-grow w-full h-[50rem] text-[0.8rem] dark:bg-card overflow-auto scrollbar">
              <table className="w-full table-auto overflow-auto">
                <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
                  <tr>
                    {headers?.map((label: ListHeader) => {
                      return (
                        <th
                          scope="col"
                          key={label.property_name}
                          className="py-3 px-3 last:pr-10 w-full text-left font-semibold"
                        >
                          <article className="capitalize flex gap-10 justify-between">
                            <h4>{label.display_name}</h4>
                            <SortColumn
                              propertyName={label.property_name}
                              setSort={setSort}
                            />
                          </article>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sortedPolicies?.map((policy: any) => {
                    return (
                      <Fragment key={policy.generated_id}>
                        <tr
                          className={`relative p-5 gap-3 break-words cursor-pointer ${
                            selectedPolicy === policy.generated_id
                              ? "dark:bg-expand border-b dark:border-filter/80"
                              : "dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70 dark:hover:bg-gradient-to-b dark:hover:from-expand dark:hover:to-filter/60"
                          }`}
                          onMouseUp={(e) => {
                            if (document.getSelection()?.type === "Range")
                              e.preventDefault();
                            else {
                              if (selectedPolicy === policy.generated_id)
                                setSelectedPolicy("");
                              else
                                setSelectedPolicy(String(policy.generated_id));
                            }
                          }}
                        >
                          {headers?.map((label: ListHeader, index: number) => {
                            return (
                              <td
                                key={`${label.property_name}-${index}`}
                                className="relative py-3 px-3 last:pr-16 text-left truncate lg:whitespace-normal"
                              >
                                <p>
                                  {label.property_name === "create_date_musecs"
                                    ? convertToUTCString(
                                        policy[label.property_name]
                                      )
                                    : policy[label.property_name]}
                                </p>
                                {index === headers?.length - 1 && (
                                  <button className="absolute right-5 top-1/3 w-6 h-6 dark:hover:text-clear dark:text-checkbox duration-100 justify-self-end cursor-pointer">
                                    <FontAwesomeIcon
                                      icon={
                                        selectedPolicy === policy.generated_id
                                          ? faChevronUp
                                          : faChevronDown
                                      }
                                    />
                                  </button>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                        {selectedPolicy === policy.generated_id && (
                          <tr
                            key={`${policy.generated_id}-expanded`}
                            className="relative py-5 px-10 gap-10 bg-gradient-to-b dark:from-expand dark:to-expand/60"
                          >
                            <td
                              colSpan={headers?.length + 1}
                              className="p-5 w-5"
                            >
                              <section className="relative grid gap-10 pr-10 pb-5 w-full text-sm">
                                {integrationType !== "GCP" && (
                                  <header className="flex flex-wrap items-center gap-5">
                                    <KeyValuePair
                                      label="ARN"
                                      value={policy.arn}
                                    />
                                    <KeyValuePair
                                      label="Create Date"
                                      value={policy.create_date_musecs}
                                    />
                                    <KeyValuePair
                                      label="Update Date"
                                      value={policy.update_date_musecs}
                                    />
                                  </header>
                                )}
                                <section className="grid md:grid-cols-2 gap-10">
                                  {[
                                    "privilege_escalation",
                                    "data_exfiltration",
                                    "resource_exposure",
                                    "service_wildcard",
                                    "credentials_exposure",
                                    "infrastructure_modification",
                                  ].map((risk) => {
                                    const findings =
                                      selectedReportAccount?.integration_type.toLowerCase() ===
                                      "aws"
                                        ? policy[risk]?.findings
                                        : policy[risk];
                                    return (
                                      <section
                                        key={risk}
                                        className="grid content-start gap-3"
                                      >
                                        <header className="flex items-center gap-2 underlined-label">
                                          <h4 className="py-2 capitalize">
                                            {risk.replace("_", " ")}
                                          </h4>
                                          {policy[risk]?.severity && (
                                            <span
                                              className={`px-2 ${
                                                severityColors[
                                                  policy[
                                                    risk
                                                  ]?.severity?.toLowerCase()
                                                ]
                                              }`}
                                            >
                                              {policy[risk]?.severity}
                                            </span>
                                          )}
                                          <span>
                                            ({policy[`${risk}_count`]})
                                          </span>
                                          {policy[risk].description && (
                                            <Popover className="relative">
                                              <Popover.Button>
                                                <FontAwesomeIcon
                                                  icon={faCircleInfo}
                                                  className="w-3 h-3 dark:text-checkbox z-0"
                                                />
                                              </Popover.Button>
                                              <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="opacity-0 translate-y-1"
                                                enterTo="opacity-100 translate-y-0"
                                                leave="transition ease-in duration-150"
                                                leaveFrom="opacity-100 translate-y-0"
                                                leaveTo="opacity-0 translate-y-1"
                                              >
                                                <Popover.Panel className="pointer-events-auto absolute break-all z-50">
                                                  <p className="absolute -top-5 left-5 w-[23rem] h-max text-xs dark:text-white dark:bg-metric p-3 overflow-hidden rounded-sm">
                                                    {parse(
                                                      policy[risk].description
                                                    )}
                                                  </p>
                                                </Popover.Panel>
                                              </Transition>
                                            </Popover>
                                          )}
                                        </header>
                                        {findings?.length > 0 ? (
                                          <ul className="grid content-start gap-2 px-4 break-all w-max list-disc max-h-72 overflow-auto scrollbar">
                                            {findings?.map(
                                              (finding: string) => {
                                                return (
                                                  <li
                                                    key={finding}
                                                    className="w-full break-all"
                                                  >
                                                    {finding}
                                                  </li>
                                                );
                                              }
                                            )}
                                          </ul>
                                        ) : (
                                          <p>No findings available</p>
                                        )}
                                      </section>
                                    );
                                  })}
                                </section>

                                {policy.policy_version_list &&
                                  Object.keys(policy.policy_version_list)
                                    .length > 0 && (
                                    <section className="grid gap-3">
                                      <h4 className="py-2 full-underlined-label">
                                        Policy Version List
                                      </h4>
                                      <ReactJson
                                        src={policy.policy_version_list}
                                        name={null}
                                        displayDataTypes={false}
                                        collapsed={2}
                                        theme="harmonic"
                                      />
                                    </section>
                                  )}
                              </section>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </section>
        ) : (
          <p>No data available</p>
        )
      ) : null}
    </section>
  );
};

export default Policies;
