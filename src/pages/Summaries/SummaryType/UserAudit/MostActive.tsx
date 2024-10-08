/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect } from "react";
import ListLayout from "src/layouts/ListLayout";
import { GetUserActivityLevels } from "src/services/summaries/user-audit";
import { ListHeader } from "src/types/general";
import { KeyStringVal } from "src/types/general";

const MostActive = ({
  selectedUser,
  setSelectedUser,
}: {
  selectedUser: string;
  setSelectedUser: (selectedUser: string) => void;
}) => {
  const { data: activityLevels } = GetUserActivityLevels();

  useEffect(() => {
    if (selectedUser === "" && activityLevels)
      setSelectedUser(activityLevels?.data.top_n_list[0].principal_id);
  }, [activityLevels]);

  return (
    <section className="grid content-start gap-3 p-6 w-full">
      <h3 className="text-base">Most Active</h3>
      {activityLevels ? (
        activityLevels.data.top_n_list.length > 0 ? (
          <ListLayout listHeader={activityLevels?.metadata.headers}>
            {activityLevels?.data.top_n_list?.map((user: KeyStringVal) => {
              return (
                <Fragment key={user.principal_id}>
                  <tr
                    className={`cursor-pointer ${
                      selectedUser === user.principal_id
                        ? "dark:bg-filter/60"
                        : "dark:hover:bg-filter/30 duartion-200"
                    } border-t-1 dark:border-checkbox/30`}
                    onClick={() => setSelectedUser(user.principal_id)}
                  >
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

export default MostActive;
