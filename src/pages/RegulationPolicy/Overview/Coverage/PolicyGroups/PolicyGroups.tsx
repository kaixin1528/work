/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  GetPolicies,
  GetPolicyGroups,
} from "src/services/regulation-policy/policy";
import Policies from "./Policies";
import { KeyStringVal } from "src/types/general";
import {
  faChevronCircleDown,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Disclosure } from "@headlessui/react";

const PolicyGroups = ({
  selectedPolicyIDs,
  setSelectedPolicyIDs,
}: {
  selectedPolicyIDs: string[];
  setSelectedPolicyIDs: (selectedPolicyIDs: string[]) => void;
}) => {
  const { data: policyGroups } = GetPolicyGroups();
  const { data: policies } = GetPolicies();

  useEffect(() => {
    if (policies?.data.length > 0) {
      const policyIDs = policies?.data?.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.policy_id],
        []
      );
      setSelectedPolicyIDs([...selectedPolicyIDs, ...policyIDs]);
    }
  }, [policies]);

  return (
    <section className="flex flex-col flex-grow gap-5">
      <h4 className="text-xl border-b-1 dark:border-checkbox">Policy Groups</h4>
      <article className="flex items-center gap-5 divide-x dark:divide-checkbox">
        <button
          className="dark:hover:text-checkbox/60 duration-100"
          onClick={() => {
            const policyIDs = policies?.data?.reduce(
              (pV: string[], cV: KeyStringVal) => [...pV, cV.policy_id],
              []
            );
            setSelectedPolicyIDs([...selectedPolicyIDs, ...policyIDs]);
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
      <ul className="flex flex-col flex-grow gap-5 overflow-auto scrollbar">
        {policyGroups?.map((policyGroup: KeyStringVal) => {
          return (
            <article
              key={policyGroup.policy_group_id}
              className="grid gap-3 pl-4 border-l-1 dark:border-checkbox"
            >
              <Disclosure defaultOpen>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex items-center gap-2 text-xs">
                      <h3 className="text-lg">{policyGroup.title}</h3>
                      <FontAwesomeIcon
                        icon={open ? faChevronCircleDown : faChevronCircleRight}
                        className="dark:text-checkbox"
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="grid gap-5">
                      <Policies
                        policyGroupID={policyGroup.policy_group_id}
                        selectedPolicyIDs={selectedPolicyIDs}
                        setSelectedPolicyIDs={setSelectedPolicyIDs}
                      />
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </article>
          );
        })}
      </ul>
    </section>
  );
};

export default PolicyGroups;
