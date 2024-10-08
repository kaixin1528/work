import React from "react";
import { Customer } from "src/types/settings";
import CustomerModules from "./CustomerModules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faUser } from "@fortawesome/free-solid-svg-icons";

const CustomerDetail = ({ customer }: { customer: Customer }) => {
  return (
    <li
      className={`grid content-start gap-3 p-5 w-full ${
        customer.has_site_admin === true
          ? "dark:bg-signin border dark:border-signin"
          : "dark:bg-admin border dark:border-admin"
      }  rounded-sm`}
    >
      <article className="grid">
        <h4 className="text-2xl">{customer.customer_name}</h4>
        <p className="text-sm font-extralight">{customer.customer_alias}</p>
        <p className="text-sm">{customer.address || "address not specified"}</p>
      </article>
      <article className="grid gap-2 text-sm">
        {customer.has_site_admin === true && (
          <span>
            <FontAwesomeIcon icon={faUser} /> Site Admin
          </span>
        )}
        {customer.current_user_customer === true && (
          <span>
            <FontAwesomeIcon icon={faLightbulb} /> Current Customer
          </span>
        )}
      </article>

      <CustomerModules customerID={customer.customer_id} />
    </li>
  );
};

export default CustomerDetail;
