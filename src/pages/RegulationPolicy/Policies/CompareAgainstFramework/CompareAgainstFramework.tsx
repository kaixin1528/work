import React, { useState } from "react";
import PoliciesSelection from "./PoliciesSelection";
import { KeyStringVal } from "src/types/general";
import { faPlus, faRotateBackward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CompareFrameworkFilter from "src/components/Filter/RegulationPolicy/CompareFrameworkFilter";

const CompareAgainstFramework = ({
  compareAgainst,
  setCompareAgainst,
}: {
  compareAgainst: boolean;
  setCompareAgainst: (compareAgainst: boolean) => void;
}) => {
  const [selectedFramework, setSelectedFramework] = useState<KeyStringVal>({});
  const [selectedPolicyGroups, setSelectedPolicyGroups] = useState<
    KeyStringVal[]
  >(Array(3).fill({}));
  const [policyGroupSpace, setPolicyGroupSpace] = useState<number>(2);

  return (
    <section className="grid content-start gap-5 px-4">
      <header className="flex items-center gap-5">
        <button
          className="flex gap-2 items-center w-max tracking-wide text-sm dark:text-checkbox dark:hover:text-checkbox/50 duration-100"
          onClick={() => {
            sessionStorage.removeItem("compareAgainstFramework");
            setCompareAgainst(!compareAgainst);
          }}
        >
          <FontAwesomeIcon icon={faRotateBackward} />
          <span>Return</span>
        </button>
        <h4 className="text-xl">Framework Coverage Comparison</h4>
      </header>
      <section className="grid gap-5 h-full">
        <article className="flex flex-wrap items-center gap-5 w-full">
          <CompareFrameworkFilter
            selectedCompareFramework={selectedFramework}
            setSelectedCompareFramework={setSelectedFramework}
          />
          {selectedFramework.id && (
            <button
              className="px-4 py-2 text-sm red-gradient-button"
              onClick={() => {
                setSelectedFramework({});
                setSelectedPolicyGroups([]);
                setPolicyGroupSpace(1);
              }}
            >
              Clear
            </button>
          )}
        </article>
      </section>
      {selectedFramework.id && (
        <section className="flex items-start justify-between gap-10">
          {Array(policyGroupSpace)
            .fill(0)
            .map((_: number, index: number) => {
              return (
                <PoliciesSelection
                  key={index}
                  documentID={selectedFramework.id}
                  index={index}
                  selectedPolicyGroups={selectedPolicyGroups}
                  setSelectedPolicyGroups={setSelectedPolicyGroups}
                  policyGroupSpace={policyGroupSpace}
                  setPolicyGroupSpace={setPolicyGroupSpace}
                />
              );
            })}
          {policyGroupSpace < 3 && (
            <button
              className="flex items-center gap-2 p-2 gradient-button"
              onClick={() => setPolicyGroupSpace(policyGroupSpace + 1)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          )}
        </section>
      )}
    </section>
  );
};

export default CompareAgainstFramework;
