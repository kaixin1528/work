/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import { convertToUTCString, sortRows } from "src/utils/general";
import { ListHeader } from "src/types/general";
import SortColumn from "src/components/Button/SortColumn";
import ReactJson from "react-json-view";
import KeyValuePair from "src/components/General/KeyValuePair";
import { GetIAMRisksPrincipals } from "src/services/summaries/iam-risks";
import { useSummaryStore } from "src/stores/summaries";
import { initialSort } from "src/constants/general";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Principals = () => {
  const { selectedReportAccount } = useSummaryStore();

  const [selectedPrincipalType, setSelectedPrincipalType] =
    useState<string>("User");
  const [selectedPrincipal, setSelectedPrincipal] = useState<string>("");
  const [sort, setSort] = useState(initialSort);

  const { data: principals } = GetIAMRisksPrincipals(
    selectedReportAccount?.integration_type || "",
    selectedReportAccount?.customer_cloud_id || ""
  );

  const filteredPrincipals = principals?.data.filter(
    (principal: { principal_type: string }) =>
      principal.principal_type
        .toLowerCase()
        .includes(selectedPrincipalType.toLowerCase())
  );
  const sortedPrincipals =
    filteredPrincipals && sortRows(filteredPrincipals, sort);
  const headers = principals?.metadata.headers;
  const categories = [
    ...new Set(
      principals?.data.reduce(
        (pV: string[], cV: any) => [...pV, cV.principal_type],
        []
      )
    ),
  ].sort() as string[];

  useEffect(() => {
    setSelectedPrincipal("");
  }, [selectedReportAccount, selectedPrincipalType]);

  useEffect(() => {
    setSelectedPrincipalType("");
  }, [selectedReportAccount]);

  useEffect(() => {
    if (selectedPrincipalType === "" && categories?.length > 0)
      setSelectedPrincipalType(categories[0]);
  }, [categories]);

  return (
    <section className="flex flex-col flex-grow gap-5 p-4 dark:bg-panel black-shadow">
      <nav className="flex items-center gap-2 text-sm w-full">
        {categories?.map((principal: string) => {
          return (
            <article
              key={principal}
              className={`p-2 cursor-pointer w-full text-center ${
                selectedPrincipalType === principal
                  ? "selected-button"
                  : "not-selected-button"
              }`}
              onClick={() => setSelectedPrincipalType(principal)}
            >
              {principal.replaceAll("_", " ")}
            </article>
          );
        })}
      </nav>

      {sortedPrincipals ? (
        sortedPrincipals.length > 0 ? (
          <section className="flex flex-col flex-grow gap-5">
            <h4 className="w-max">
              {selectedPrincipalType.replaceAll("_", " ")} (
              {sortedPrincipals?.length})
            </h4>
            <section className="flex flex-col flex-grow w-full h-[50rem] text-[0.8rem] dark:bg-card overflow-auto scrollbar">
              <table className="w-full table-auto md:table-fixed overflow-auto">
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
                  {sortedPrincipals?.map((principal: any) => {
                    return (
                      <Fragment key={principal.generated_id}>
                        <tr
                          className={`relative p-5 gap-3 break-words cursor-pointer ${
                            selectedPrincipal === principal.generated_id
                              ? "dark:bg-expand border-b dark:border-filter/80"
                              : "dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70 dark:hover:bg-gradient-to-b dark:hover:from-expand dark:hover:to-filter/60"
                          }`}
                          onMouseUp={(e) => {
                            if (document.getSelection()?.type === "Range")
                              e.preventDefault();
                            else {
                              if (selectedPrincipal === principal.generated_id)
                                setSelectedPrincipal("");
                              else
                                setSelectedPrincipal(
                                  String(principal.generated_id)
                                );
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
                                        principal[label.property_name]
                                      )
                                    : principal[label.property_name]}
                                </p>
                                {index === headers?.length - 1 && (
                                  <button className="absolute right-5 top-1/3 w-6 h-6 dark:hover:text-clear dark:text-checkbox duration-100 justify-self-end cursor-pointer">
                                    <FontAwesomeIcon
                                      icon={
                                        selectedPrincipal ===
                                        principal.generated_id
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
                        {selectedPrincipal === principal.generated_id && (
                          <tr
                            key={`${principal.generated_id}-expanded`}
                            className="relative py-5 px-10 gap-10 text-sm bg-gradient-to-b dark:from-expand dark:to-expand/60"
                          >
                            <td
                              colSpan={headers?.length + 1}
                              className="p-5 w-5"
                            >
                              <section className="relative grid gap-5 w-full pb-5">
                                {selectedPrincipalType === "Role" &&
                                  principal.role_last_used && (
                                    <KeyValuePair
                                      label="Role Last Used"
                                      value={principal.role_last_used}
                                    />
                                  )}
                                {[
                                  "roles",
                                  "groups",
                                  "assume_role_policy",
                                  "aws_managed_policies",
                                  "gcp_managed_policies",
                                  "customer_managed_policies",
                                  "inline_policies",
                                  "additional_info",
                                ].map((policy) => {
                                  if (
                                    !principal[policy] ||
                                    (principal[policy] &&
                                      Object.keys(principal[policy]).length ===
                                        0) ||
                                    (selectedPrincipalType !== "User" &&
                                      policy === "groups") ||
                                    (selectedPrincipalType !== "Role" &&
                                      policy === "assume_role_policy")
                                  )
                                    return null;

                                  return (
                                    <section
                                      key={policy}
                                      className="grid gap-3"
                                    >
                                      <h4 className="py-2 capitalize full-underlined-label">
                                        {policy.replaceAll("_", " ")}
                                      </h4>
                                      <ReactJson
                                        src={principal[policy]}
                                        name={null}
                                        displayDataTypes={false}
                                        collapsed={2}
                                        theme="harmonic"
                                      />
                                    </section>
                                  );
                                })}
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

export default Principals;
