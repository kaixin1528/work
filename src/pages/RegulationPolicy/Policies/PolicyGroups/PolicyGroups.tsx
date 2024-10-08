/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { Fragment, useState } from "react";
import Policies from "../Policies";
import { GetPolicyGroups } from "src/services/regulation-policy/policy";
import { KeyStringVal } from "src/types/general";
import EditPolicyGroup from "./EditPolicyGroup";
import DeletePolicyGroup from "./DeletePolicyGroup";
import CreatePolicyGroup from "./CreatePolicyGroup";
import NewPolicy from "../NewPolicy";
import Loader from "src/components/Loader/Loader";
import CompareAgainstFramework from "../CompareAgainstFramework/CompareAgainstFramework";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GeneratePolicy from "../GeneratePolicy";

const PolicyGroups = () => {
  const [selectedPolicyGroup, setSelectedPolicyGroup] =
    useState<boolean>(false);
  const [compareAgainst, setCompareAgainst] = useState<boolean>(false);

  const { data: policyGroups, status: policyGroupStatus } = GetPolicyGroups();
  const policyGroup = policyGroups?.find(
    (group: KeyStringVal) =>
      group.policy_group_id === sessionStorage.selectedPolicyGroupID
  )?.title;

  return (
    <>
      {sessionStorage.compareAgainstFramework ? (
        <CompareAgainstFramework
          compareAgainst={compareAgainst}
          setCompareAgainst={setCompareAgainst}
        />
      ) : !sessionStorage.selectedPolicyGroupID ? (
        <section className="flex flex-col flex-grow gap-5 w-full">
          <header className="flex flex-wrap items-center justify-between gap-5 text-lg">
            <article className="flex items-center gap-4">
              <h4>
                Policy Groups{" "}
                <span className="dark:text-checkbox">
                  ({policyGroups?.length})
                </span>
              </h4>
              <CreatePolicyGroup />
            </article>
            <button
              className="px-6 py-2 text-sm bg-gradient-to-br dark:from-admin/60 dark:to-admin/10 dark:hover:text-admin/60 duration-100 rounded-sm"
              onClick={() => {
                sessionStorage.compareAgainstFramework = "true";
                setCompareAgainst(!compareAgainst);
              }}
            >
              Compare against Framework
            </button>
          </header>
          <article className="flex items-center gap-5 mx-auto">
            <NewPolicy />
            {/* <GeneratePolicy /> */}
          </article>
          {policyGroupStatus === "loading" ? (
            <Loader />
          ) : policyGroups?.length > 0 ? (
            <ul className="flex flex-col flex-grow gap-5">
              {policyGroups?.map((policyGroup: KeyStringVal) => {
                return (
                  <li
                    key={policyGroup.policy_group_id}
                    className="grid gap-3 p-5 bg-gradient-to-r dark:from-admin/70 dark:to-white/10 rounded-md"
                  >
                    <header className="flex items-start justify-between gap-20">
                      <article className="grid gap-2">
                        <article className="flex flex-wrap items-end gap-5">
                          <h4 className="text-xl">{policyGroup.title}</h4>
                          <button
                            className="px-4 py-1 w-max text-left dark:bg-card/70 dark:hover:bg-card/30 duration-100 rounded-full"
                            onClick={() => {
                              setSelectedPolicyGroup(!selectedPolicyGroup);
                              sessionStorage.selectedPolicyGroupID =
                                policyGroup.policy_group_id;
                            }}
                          >
                            View policies{" "}
                            <FontAwesomeIcon icon={faArrowRightLong} />{" "}
                          </button>
                        </article>
                        <p>{policyGroup.description}</p>
                      </article>
                      <article className="flex items-center gap-5 text-sm">
                        {!["default", "all"].includes(
                          policyGroup.title.toLowerCase()
                        ) && (
                          <>
                            <EditPolicyGroup
                              policyGroupID={policyGroup.policy_group_id}
                            />
                            <DeletePolicyGroup
                              policyGroupID={policyGroup.policy_group_id}
                            />
                          </>
                        )}
                      </article>
                    </header>
                  </li>
                );
              })}
            </ul>
          ) : (
            <section className="flex items-center place-content-center gap-10 w-full h-full">
              <img
                src="/grc/policies-placeholder.svg"
                alt="policies placeholder"
                className="w-40 h-40"
              />
              <article className="grid gap-3">
                <h4 className="text-xl font-extrabold">Policies</h4>
                <h4>No policy groups available</h4>
              </article>
            </section>
          )}
        </section>
      ) : (
        <Policies
          policyGroup={policyGroup}
          selectedPolicyGroup={selectedPolicyGroup}
          setSelectedPolicyGroup={setSelectedPolicyGroup}
        />
      )}
    </>
  );
};

export default PolicyGroups;
