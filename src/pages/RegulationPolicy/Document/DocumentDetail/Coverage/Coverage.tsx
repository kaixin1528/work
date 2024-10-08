import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import PoliciesSelection from "./PoliciesSelection";
import { KeyStringVal } from "src/types/general";

const Coverage = ({ documentID }: { documentID: string }) => {
  const [policyGroupSpace, setPolicyGroupSpace] = useState<number>(1);
  const [selectedPolicyGroups, setSelectedPolicyGroups] = useState<
    KeyStringVal[]
  >(Array(3).fill({}));

  return (
    <section className="flex items-start justify-between gap-10 w-full">
      <section
        className={`grid ${
          policyGroupSpace === 1
            ? "grid-cols-1"
            : policyGroupSpace === 2
            ? "grid-cols-2"
            : "grid-cols-3"
        } gap-10 w-full`}
      >
        {Array(policyGroupSpace)
          .fill(0)
          .map((_: number, index: number) => {
            return (
              <PoliciesSelection
                key={index}
                index={index}
                documentID={documentID}
                selectedPolicyGroups={selectedPolicyGroups}
                setSelectedPolicyGroups={setSelectedPolicyGroups}
                policyGroupSpace={policyGroupSpace}
                setPolicyGroupSpace={setPolicyGroupSpace}
              />
            );
          })}
      </section>
      {policyGroupSpace < 3 && (
        <button
          className="flex items-center gap-2 p-2 gradient-button"
          onClick={() => setPolicyGroupSpace(policyGroupSpace + 1)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      )}
    </section>
  );
};

export default Coverage;
