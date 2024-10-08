import { Fragment } from "react";
import ListLayout from "src/layouts/ListLayout";
import { GetUserActivityLevels } from "src/services/summaries/user-audit";
import { ListHeader } from "src/types/general";
import { KeyStringVal } from "src/types/general";

const LeastActive = () => {
  const { data: activityLevels } = GetUserActivityLevels();

  return (
    <section className="grid content-start gap-3 p-6 w-full">
      <h4>Least Active</h4>
      {activityLevels ? (
        activityLevels.data.botton_n_list.length > 0 ? (
          <ListLayout listHeader={activityLevels?.metadata.headers}>
            {activityLevels?.data.botton_n_list?.map((user: KeyStringVal) => {
              return (
                <Fragment key={user.principal_id}>
                  <tr className="dark:bg-filter/30 border-t-1 dark:border-checkbox/30">
                    {activityLevels?.metadata.headers?.map(
                      (col: ListHeader) => {
                        return (
                          <td key={col.property_name} className="py-2 px-3">
                            {user[col.property_name]}
                          </td>
                        );
                      }
                    )}
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

export default LeastActive;
