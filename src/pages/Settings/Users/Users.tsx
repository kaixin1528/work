/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useState } from "react";
import { GetAdminUsers, GetAllUsers } from "../../../services/settings/users";
import { convertToUTCString, isEpoch, sortRows } from "../../../utils/general";
import UserActionFilter from "../../../components/Filter/Settings/UserActionFilter";
import { activationColors } from "../../../constants/settings";
import { Customer, User } from "../../../types/settings";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import { checkSuperOrSiteAdmin, getCustomerID } from "../../../utils/general";
import { ListHeader } from "../../../types/general";
import TableLayout from "../../../layouts/TableLayout";
import SortColumn from "src/components/Button/SortColumn";
import { GetCustomers } from "src/services/settings/organization";
import { initialSort } from "src/constants/general";

export const userHeaders = [
  { display_name: "Customer Name", property_name: "customer_id" },
  { display_name: "User Name", property_name: "user_name" },
  { display_name: "Email Address", property_name: "user_email" },
  { display_name: "Groups", property_name: "groups" },
  { display_name: "Role", property_name: "roles" },
  { display_name: "Status", property_name: "activated" },
];

const Users = () => {
  const isSuperOrSiteAdmin = checkSuperOrSiteAdmin();

  const [editUser, setEditUser] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [sort, setSort] = useState(initialSort);
  const [customerID, setCustomerID] = useState<string>("");

  const { data: allCustomers } = GetCustomers(isSuperOrSiteAdmin);
  const { data: allUsers } = GetAllUsers(getCustomerID(), isSuperOrSiteAdmin);
  const { data: allAdminUsers } = GetAdminUsers(isSuperOrSiteAdmin);

  const filteredUsers = isSuperOrSiteAdmin
    ? allAdminUsers?.filter((user: User) =>
        user.user_name
          .toLowerCase()
          .replaceAll(/\s+/g, "")
          .includes(
            query.replaceAll('"', "").toLowerCase().replaceAll(/\s+/g, "")
          )
      ) || []
    : allUsers?.filter((user: User) =>
        user.user_name
          .toLowerCase()
          .replaceAll(/\s+/g, "")
          .includes(
            query.replaceAll('"', "").toLowerCase().replaceAll(/\s+/g, "")
          )
      ) || [];

  const sortedUsers = sortRows(filteredUsers, sort);
  const totalCount = sortedUsers.length;

  return (
    <section className="grid content-start gap-5 p-4 w-full h-full overflow-auto scrollbar">
      <h4>
        USERS{" "}
        <span className="dark:text-checkbox">({sortedUsers?.length || 0})</span>
      </h4>
      <section className="flex flex-col flex-grow gap-5 w-full h-full text-xs overflow-auto scrollbar">
        <header className="flex justify-between gap-10">
          <article className="relative flex px-4 h-9 items-center w-2/5 dark:bg-search rounded-sm">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="dark:text-checkbox"
            />
            <input
              type="filter"
              autoComplete="off"
              spellCheck="false"
              placeholder="Filter users by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-full pl-3 text-xs placeholder:text-secondary placeholder:text-xs placeholder:font-medium dark:disabled:cursor-not-allowed border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none dark:bg-search rounded-sm"
            />
          </article>
          <article className="flex items-center gap-2">
            {multiSelect.length > 0 && (
              <UserActionFilter
                list={["Activate", "Deactivate"]}
                multiSelect={multiSelect}
                setMultiSelect={setMultiSelect}
              />
            )}

            {/* add user */}
            <AddUser customerID={customerID} setCustomerID={setCustomerID} />
          </article>
        </header>

        {/* user table */}
        <TableLayout>
          <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
            <tr>
              <th className="px-5 pr-6 w-5">
                <input
                  type="checkbox"
                  checked={
                    sortedUsers?.length > 0 && multiSelect.length === totalCount
                  }
                  className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                  onChange={(e) => {
                    e.stopPropagation();
                    if (multiSelect.length < totalCount) {
                      setMultiSelect(
                        sortedUsers?.map((user: User) => user.user_id)
                      );
                    } else setMultiSelect([]);
                  }}
                />
              </th>
              {userHeaders.map((col: ListHeader) => {
                if (!isSuperOrSiteAdmin && col.property_name === "customer_id")
                  return null;
                return (
                  <th
                    scope="col"
                    key={col.display_name}
                    className="py-3 px-3 text-left font-semibold"
                  >
                    <article className="capitalize flex gap-10 justify-between">
                      <h4>{col.display_name}</h4>
                      <SortColumn
                        propertyName={col.property_name}
                        setSort={setSort}
                      />
                    </article>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedUsers?.map((user: User) => {
              return (
                <Fragment key={user.user_id}>
                  <tr className="relative p-5 gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70">
                    <td className="px-5 w-5">
                      <input
                        type="checkbox"
                        checked={multiSelect.includes(user.user_id)}
                        className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onChange={() => {
                          if (multiSelect.includes(user.user_id))
                            setMultiSelect(
                              multiSelect.filter(
                                (userID) => userID !== user.user_id
                              )
                            );
                          else setMultiSelect([...multiSelect, user.user_id]);
                        }}
                      />
                    </td>
                    {userHeaders.map((col: ListHeader, colIndex: number) => {
                      const isDate = isEpoch(user[col.property_name])
                        ? convertToUTCString(user[col.property_name])
                        : false;

                      if (
                        !isSuperOrSiteAdmin &&
                        col.property_name === "customer_id"
                      )
                        return null;
                      return (
                        <td
                          key={`${user.user_id}-${colIndex}`}
                          className="relative py-3 px-3 last:pr-16 break-all"
                        >
                          <button
                            disabled={
                              col.property_name !== "user_name" ||
                              isSuperOrSiteAdmin
                            }
                            className={`${
                              col.property_name === "user_name" &&
                              !isSuperOrSiteAdmin &&
                              "underline dark:text-signin"
                            } text-left`}
                            onClick={() => setEditUser(user.user_id)}
                          >
                            {col.property_name === "groups" ? (
                              <ul className="grid gap-1 text-left">
                                {user[col.property_name].map(
                                  (group: {
                                    group_id: string;
                                    group_name: string;
                                  }) => {
                                    return (
                                      <li key={group.group_id}>
                                        {group.group_name}
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            ) : col.property_name === "roles" ? (
                              <ul className="grid gap-1 text-left">
                                {user[col.property_name].map(
                                  (role: {
                                    role_id: string;
                                    role_name: string;
                                    role_type: string;
                                  }) => {
                                    return (
                                      <li key={role.role_id}>
                                        {role.role_name}
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            ) : col.property_name === "customer_id" ? (
                              allCustomers?.find(
                                (customer: Customer) =>
                                  customer.customer_id ===
                                  user[col.property_name]
                              )?.customer_name
                            ) : col.property_name === "activated" ? (
                              <p
                                className={`${
                                  activationColors[
                                    user.activated ? "activated" : "deactivated"
                                  ]
                                }`}
                              >
                                {user.activated ? "Activated" : "Deactivated"}
                              </p>
                            ) : isDate ? (
                              isDate
                            ) : (
                              user[col.property_name]
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>

                  {/* edit user */}
                  <EditUser
                    editUser={editUser}
                    setEditUser={setEditUser}
                    customerID={customerID}
                    user={user}
                  />
                </Fragment>
              );
            })}
          </tbody>
        </TableLayout>
      </section>
    </section>
  );
};

export default Users;
