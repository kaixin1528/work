/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useState } from "react";
import { GetAdminRoles, GetAllRoles } from "../../../services/settings/roles";
import { sortRows } from "../../../utils/general";
import { roleTypeColors } from "../../../constants/settings";
import { Customer, Role } from "../../../types/settings";
import AddRole from "./AddRole";
import EditRole from "./EditRole";
import { checkSuperOrSiteAdmin, getCustomerID } from "../../../utils/general";
import { ListHeader } from "../../../types/general";
import TableLayout from "../../../layouts/TableLayout";
import SortColumn from "src/components/Button/SortColumn";
import { GetCustomers } from "src/services/settings/organization";
import { initialSort } from "src/constants/general";
import RoleActionFilter from "src/components/Filter/Settings/RoleActionFilter";

export const roleHeaders = [
  { display_name: "Customer Name", property_name: "customer_id" },
  { display_name: "Role Name", property_name: "role_name" },
  { display_name: "Role Type", property_name: "role_type" },
];

const Roles = () => {
  const isSuperOrSiteAdmin = checkSuperOrSiteAdmin();

  const [editRole, setEditRole] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [sort, setSort] = useState(initialSort);

  const [customerID, setCustomerID] = useState<string>("");

  const { data: allCustomers } = GetCustomers(isSuperOrSiteAdmin);
  const { data: allRoles } = GetAllRoles(getCustomerID());
  const { data: adminRoles } = GetAdminRoles(isSuperOrSiteAdmin);

  const roles = isSuperOrSiteAdmin
    ? adminRoles
    : allRoles?.filter((role: Role) => role.role_type !== "Admin");

  const filteredRoles = roles
    ? roles.filter((row: Role) =>
        row.role_name
          .toLowerCase()
          .replaceAll(/\s+/g, "")
          .includes(
            query.replaceAll('"', "").toLowerCase().replaceAll(/\s+/g, "")
          )
      )
    : [];
  const sortedRoles = sortRows(filteredRoles, sort);
  const totalCount = sortedRoles.length;

  return (
    <section className="grid gap-5 p-4 content-start w-full lg:w-4/6 xl:w-3/6 h-full overflow-auto scrollbar">
      <h4>
        ROLES{" "}
        <span className="dark:text-checkbox">({sortedRoles?.length || 0})</span>
      </h4>
      <section className="grid gap-5 text-xs w-full h-full overflow-auto scrollbar">
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
              placeholder="Filter roles by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-full pl-3 text-xs placeholder:text-secondary placeholder:text-xs placeholder:font-medium dark:disabled:cursor-not-allowed border-transparent focus:ring-0 focus:border-transparent bg-transparent focus:outline-none dark:bg-search rounded-sm"
            />
          </article>
          <article className="flex items-center gap-2">
            {multiSelect.length > 0 && (
              <RoleActionFilter
                list={["Delete"]}
                multiSelect={multiSelect}
                setMultiSelect={setMultiSelect}
              />
            )}
            <AddRole customerID={customerID} setCustomerID={setCustomerID} />
          </article>
        </header>
        <TableLayout>
          <thead className="sticky -top-1.5 z-10 bg-gradient-to-b dark:from-expand dark:to-table-header">
            <tr>
              <th className="px-5 pr-6 w-5">
                <input
                  id="row"
                  type="checkbox"
                  checked={
                    sortedRoles?.length > 0 && multiSelect.length === totalCount
                  }
                  className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                  onChange={(e) => {
                    e.stopPropagation();
                    if (multiSelect.length < totalCount) {
                      setMultiSelect(
                        sortedRoles?.map((role: Role) => role.role_id)
                      );
                    } else setMultiSelect([]);
                  }}
                />
              </th>
              {roleHeaders.map((col: ListHeader) => {
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
            {sortedRoles?.map((role: Role) => {
              return (
                <Fragment key={role.role_id}>
                  <tr className="relative p-5 gap-3 break-words dark:bg-card dark:even:bg-gradient-to-b from-panel to-panel/70">
                    <td className="px-5 w-5">
                      <input
                        type="checkbox"
                        checked={multiSelect.includes(role.role_id)}
                        className="form-checkbox w-4 h-4 border-0 dark:focus:ring-0 dark:text-checkbox dark:focus:border-checkbox focus:ring dark:focus:ring-offset-0 dark:focus:ring-checkbox focus:ring-opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onChange={() => {
                          if (multiSelect.includes(role.role_id))
                            setMultiSelect(
                              multiSelect.filter(
                                (userID) => userID !== role.role_id
                              )
                            );
                          else setMultiSelect([...multiSelect, role.role_id]);
                        }}
                      />
                    </td>
                    {roleHeaders.map((col: ListHeader, colIndex: number) => {
                      if (
                        !isSuperOrSiteAdmin &&
                        col.property_name === "customer_id"
                      )
                        return null;

                      return (
                        <td
                          key={`${role.role_id}-${colIndex}`}
                          className="relative py-3 px-3 last:pr-16 text-left truncate lg:whitespace-normal"
                        >
                          <button
                            disabled={
                              col.property_name !== "role_name" ||
                              isSuperOrSiteAdmin
                            }
                            onClick={() => setEditRole(role.role_id)}
                          >
                            <p
                              className={`${
                                col.property_name === "role_name" &&
                                !isSuperOrSiteAdmin &&
                                "underline dark:text-signin"
                              } ${
                                roleTypeColors[
                                  role[col.property_name].toLowerCase()
                                ]
                              }`}
                            >
                              {isSuperOrSiteAdmin &&
                              col.property_name === "customer_id"
                                ? allCustomers?.find(
                                    (customer: Customer) =>
                                      customer.customer_id ===
                                      role[col.property_name]
                                  )?.customer_name
                                : role[col.property_name]}
                            </p>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                  {/* edit role */}
                  <EditRole
                    editRole={editRole}
                    setEditRole={setEditRole}
                    role={role}
                    setCustomerID={setCustomerID}
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

export default Roles;
