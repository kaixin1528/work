import { Fragment } from "react";
import ListLayout from "src/layouts/ListLayout";
import { ListHeader } from "src/types/general";
import { KeyStringVal } from "src/types/general";
import {
  dependencyHeader,
  dependencies,
} from "../DependencySupplyChain/DependenciesList";

const ResourceActivityDetails = ({
  selectedResourceActivity,
}: {
  selectedResourceActivity: string;
}) => {
  return (
    <section className="grid content-start gap-3 p-6 w-full dark:bg-card black-shadow overflow-auto scrollbar">
      <h3 className="text-lg">Resource Activity Details</h3>
      <ListLayout listHeader={dependencyHeader}>
        {dependencies.map((dependency: KeyStringVal) => {
          return (
            <Fragment key={dependency.name}>
              <tr
                className={`cursor-pointer ${
                  selectedResourceActivity === dependency.name
                    ? "dark:bg-filter/60"
                    : "dark:hover:bg-filter/30 duartion-200"
                } border-t-1 dark:border-checkbox/30`}
              >
                {dependencyHeader?.map((col: ListHeader) => {
                  return (
                    <td key={col.property_name} className="py-2 px-5">
                      {dependency[col.property_name]}
                    </td>
                  );
                })}
              </tr>
            </Fragment>
          );
        })}
      </ListLayout>
    </section>
  );
};

export default ResourceActivityDetails;
