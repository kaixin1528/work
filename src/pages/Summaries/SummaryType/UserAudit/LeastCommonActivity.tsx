import { Fragment } from "react";
import ListLayout from "src/layouts/ListLayout";
import { ListHeader } from "src/types/general";
import { KeyStringVal } from "src/types/general";
import {
  dependencyHeader,
  dependencies,
} from "../DependencySupplyChain/DependenciesList";

const LeastCommonActivity = () => {
  return (
    <section className="grid content-start gap-3 p-6 w-full">
      <h4>Least Common Activity</h4>
      {dependencies ? (
        dependencies.length > 0 ? (
          <ListLayout listHeader={dependencyHeader}>
            {dependencies.map((dependency: KeyStringVal) => {
              return (
                <Fragment key={dependency.name}>
                  <tr className="dark:bg-filter/30 border-t-1 dark:border-checkbox/30">
                    {dependencyHeader?.map((col: ListHeader) => {
                      return (
                        <td key={col.property_name} className="py-2 px-3">
                          {dependency[col.property_name]}
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
          </ListLayout>
        ) : (
          <p>No data available</p>
        )
      ) : null}
    </section>
  );
};

export default LeastCommonActivity;
