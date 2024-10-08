import React from "react";
import { useNavigate } from "react-router-dom";
import ListLayout from "src/layouts/ListLayout";
import { GetCVEDetail } from "src/services/general/cve";
import { ListHeader } from "src/types/general";
import { PackageIssue } from "src/types/summaries";

const Weaknesses = ({ selectedCVE }: { selectedCVE: string }) => {
  const navigate = useNavigate();

  const { data: cveDetail } = GetCVEDetail(selectedCVE);

  return (
    <section className="grid gap-3">
      <h4 className="py-2 text-base full-underlined-label">Weaknesses</h4>
      <ListLayout listHeader={cveDetail.metadata?.weaknesses}>
        {cveDetail.data?.cve_weaknesses?.map((curPackage: PackageIssue) => {
          return (
            <tr
              key={curPackage.id}
              className="bg-filter/30 border-t-1 dark:border-checkbox/30"
            >
              {cveDetail.metadata?.weaknesses.map((col: ListHeader) => {
                return (
                  <td
                    key={col.property_name}
                    className={`py-2 px-3 ${
                      curPackage[col.property_name].includes("CWE")
                        ? "hover:underline cursor-pointer"
                        : ""
                    }`}
                    onClick={() => {
                      if (curPackage[col.property_name].includes("CWE"))
                        navigate(
                          `/cwes/details?cwe_id=${
                            curPackage[col.property_name]
                          }`
                        );
                    }}
                  >
                    {curPackage[col.property_name]}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </ListLayout>
    </section>
  );
};

export default Weaknesses;
