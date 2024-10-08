import React from "react";
import { GetPoliciesFromGroup } from "src/services/regulation-policy/policy";
import { KeyStringVal } from "src/types/general";
import { convertToUTCShortString } from "src/utils/general";

const Policies = ({
  policyGroupID,
  selectedPolicyIDs,
  setSelectedPolicyIDs,
}: {
  policyGroupID: string;
  selectedPolicyIDs: string[];
  setSelectedPolicyIDs: (selectedPolicyIDs: string[]) => void;
}) => {
  const { data: policies } = GetPoliciesFromGroup(policyGroupID);

  const policyIDs = policies?.data?.reduce(
    (pV: string[], cV: KeyStringVal) => [...pV, cV.policy_id],
    []
  );

  return (
    <>
      {policies ? (
        policies?.data?.length > 0 ? (
          <section className="grid gap-5">
            <article className="flex items-center gap-5 divide-x dark:divide-checkbox">
              <button
                className="dark:hover:text-checkbox/60 duration-100"
                onClick={() =>
                  setSelectedPolicyIDs([...selectedPolicyIDs, ...policyIDs])
                }
              >
                Select All
              </button>
              <button
                className="pl-5 dark:hover:text-checkbox/60 duration-100"
                onClick={() =>
                  setSelectedPolicyIDs(
                    selectedPolicyIDs.filter(
                      (policyID) => !policyIDs.includes(policyID)
                    )
                  )
                }
              >
                Deselect All
              </button>
            </article>
            <ul className="flex flex-col flex-grow gap-3 pb-2 overflow-auto scrollbar">
              {policies?.data?.map((policy: KeyStringVal, index: number) => {
                return (
                  <li
                    key={index}
                    className={`flex items-start justify-between gap-20 py-2 px-4 break-words cursor-pointer font-extralight text-left text-base dark:text-white dark:bg-list ${
                      selectedPolicyIDs.includes(policy.policy_id)
                        ? "gradient-button"
                        : "grey-gradient-button"
                    } black-shadow`}
                    onClick={() => {
                      if (selectedPolicyIDs.includes(policy.policy_id))
                        setSelectedPolicyIDs(
                          selectedPolicyIDs.filter(
                            (policyID) => policy.policy_id !== policyID
                          )
                        );
                      else
                        setSelectedPolicyIDs([
                          ...selectedPolicyIDs,
                          policy.policy_id,
                        ]);
                    }}
                  >
                    <article className="flex items-start gap-2 w-3/5">
                      <img
                        src={policy.thumbnail_uri}
                        alt={policy.regulatory_authority}
                        className="w-6 h-6 rounded-full"
                      />
                      <h4 className="font-medium">{policy.policy_name}</h4>
                    </article>
                    <span>
                      {policy.last_updated_at &&
                        convertToUTCShortString(Number(policy.last_updated_at))}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : (
          <p>No policies available</p>
        )
      ) : null}
    </>
  );
};

export default Policies;
