/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  CreateContact,
  GetCustomer,
  UpdateContact,
} from "../../../services/settings/organization";
import { Contact, ContactInput } from "../../../types/settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { getCustomerID } from "../../../utils/general";

const Admin = () => {
  const customerID = getCustomerID();

  const [primaryContact, setPrimaryContact] = useState<ContactInput>({
    contact_type: "Primary",
    name: "",
    email: "",
    phone_number: "",
  });
  const [editPrimary, setEditPrimary] = useState<boolean>(false);
  const [billingContact, setBillingContact] = useState<ContactInput>({
    contact_type: "Billing",
    name: "",
    email: "",
    phone_number: "",
  });
  const [editBilling, setEditBilling] = useState<boolean>(false);

  const { data: getCustomer } = GetCustomer(customerID);
  const createContact = CreateContact(customerID);
  const updateContact = UpdateContact(customerID);

  // populate the primary and billing contact on initial render
  useEffect(() => {
    if (getCustomer) {
      const primary = getCustomer.contacts.find(
        (contact: Contact) => contact.contact_type === "Primary"
      );

      if (primary)
        setPrimaryContact({
          ...primaryContact,
          name: primary.name,
          email: primary.email,
          phone_number: primary.phone_number,
        });

      const billing = getCustomer.contacts.find(
        (contact: Contact) => contact.contact_type === "Billing"
      );
      if (billing)
        setBillingContact({
          ...billingContact,
          name: billing.name,
          email: billing.email,
          phone_number: billing.phone_number,
        });
    }
  }, [getCustomer]);

  return (
    <section className="grid grid-rows-6 grid-cols-5 gap-5 p-6 w-full h-5/6 text-sm content-start">
      {/* customer information */}
      <section className="row-span-4 col-span-5 grid content-start gap-3 p-10 dark:bg-admin border-1 dark:border-admin rounded-sm">
        <h1 className="text-4xl tracking-wide">{getCustomer.customer_name}</h1>
        <article className="grid gap-1">
          <p className="">{getCustomer.customer_alias}</p>
          <p>
            {getCustomer.address || (
              <span className="italic dark:text-gray-300 font-light">
                address not specified
              </span>
            )}
          </p>
        </article>
      </section>

      <section className="row-span-2 col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* primary contact */}
        <article className="grid content-start gap-3 p-6 dark:bg-admin/10 border-1 dark:border-admin rounded-sm">
          <header className="flex items-center justify-between gap-5">
            <h3 className="text-lg dark:text-admin">Primary Contact</h3>
            {editPrimary ? (
              <button
                className="dark:text-white dark:hover:text-checkbox duration-100"
                onClick={() => setEditPrimary(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            ) : (
              <button
                className="dark:text-white dark:hover:text-checkbox duration-100"
                onClick={() => setEditPrimary(true)}
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
            )}
          </header>
          <article className="grid gap-2 text-xs break-all">
            {editPrimary ? (
              <input
                type="input"
                name="primary contact name"
                placeholder="name"
                spellCheck="false"
                autoComplete="off"
                value={primaryContact.name}
                onChange={(e) =>
                  setPrimaryContact({
                    ...primaryContact,
                    name: e.target.value,
                  })
                }
                className="w-max md:w-40 placeholder:italic placeholder:tracking-wide dark:placeholder:text-gray-300 placeholder:font-light dark:text-white dark:bg-transparent border-b dark:border-admin focus:outline-adminne"
              />
            ) : (
              <p>
                {primaryContact.name || (
                  <span className="italic dark:text-gray-300 font-light">
                    name not specified
                  </span>
                )}
              </p>
            )}

            {editPrimary ? (
              <input
                type="input"
                name="primary contact email"
                placeholder="email"
                spellCheck="false"
                autoComplete="off"
                value={primaryContact.email}
                onChange={(e) =>
                  setPrimaryContact({
                    ...primaryContact,
                    email: e.target.value,
                  })
                }
                className="w-max md:w-40 lg:w-60 placeholder:italic placeholder:tracking-wide dark:placeholder:text-gray-300 placeholder:font-light dark:text-white dark:bg-transparent border-b dark:border-admin focus:outline-adminne"
              />
            ) : (
              <p>
                {primaryContact.email || (
                  <span className="italic dark:text-gray-300 font-light">
                    email not specified
                  </span>
                )}
              </p>
            )}
            {editPrimary ? (
              <input
                type="input"
                name="primary contact phone number"
                placeholder="phone number"
                spellCheck="false"
                autoComplete="off"
                value={primaryContact.phone_number}
                onChange={(e) =>
                  setPrimaryContact({
                    ...primaryContact,
                    phone_number: e.target.value,
                  })
                }
                className="w-max md:w-40 placeholder:italic placeholder:tracking-wide dark:placeholder:text-gray-300 placeholder:font-light dark:text-white dark:bg-transparent border-b dark:border-admin focus:outline-adminne"
              />
            ) : (
              <p>
                {primaryContact.phone_number || (
                  <span className="italic dark:text-gray-300 font-light">
                    phone number not specified
                  </span>
                )}
              </p>
            )}
            {editPrimary && (
              <button
                className="justify-self-end p-1 px-2 text-xs dark:text-admin dark:hover:text-admin/60 border dark:border-admin duration-100 rounded-sm"
                onClick={() => {
                  if (
                    getCustomer.contacts.some(
                      (contact: Contact) => contact.contact_type === "Primary"
                    )
                  ) {
                    setEditPrimary(false);
                    updateContact.mutate({
                      contactID: getCustomer.contacts.find(
                        (contact: Contact) => contact.contact_type === "Primary"
                      )?.contact_id,
                      contact: primaryContact,
                    });
                  } else {
                    setEditPrimary(false);
                    createContact.mutate({
                      contact: primaryContact,
                    });
                  }
                }}
              >
                Save
              </button>
            )}
          </article>
        </article>

        {/* billing contact */}
        <article className="grid content-start gap-3 p-6 dark:bg-admin/10 border-1 dark:border-admin rounded-sm">
          <header className="flex items-center justify-between gap-5">
            <h3 className="text-lg dark:text-admin">Billing Contact</h3>
            {editBilling ? (
              <button
                className="dark:text-white dark:hover:text-checkbox duration-100"
                onClick={() => setEditBilling(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            ) : (
              <button
                className="dark:text-white dark:hover:text-checkbox duration-100"
                onClick={() => setEditBilling(true)}
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
            )}
          </header>
          <article className="grid gap-2 text-xs break-all">
            {editBilling ? (
              <input
                type="input"
                name="billing contact name"
                placeholder="name"
                spellCheck="false"
                autoComplete="off"
                value={billingContact.name}
                onChange={(e) =>
                  setBillingContact({
                    ...billingContact,
                    name: e.target.value,
                  })
                }
                className="w-max md:w-40 placeholder:italic placeholder:tracking-wide dark:placeholder:text-gray-300 placeholder:font-light dark:text-white dark:bg-transparent border-b dark:border-admin focus:outline-adminne"
              />
            ) : (
              <p>
                {billingContact.name || (
                  <span className="italic dark:text-gray-300 font-light">
                    name not specified
                  </span>
                )}
              </p>
            )}

            {editBilling ? (
              <input
                type="input"
                name="billing contact email"
                placeholder="email"
                spellCheck="false"
                autoComplete="off"
                value={billingContact.email}
                onChange={(e) =>
                  setBillingContact({
                    ...billingContact,
                    email: e.target.value,
                  })
                }
                className="w-max md:w-40 lg:w-60 placeholder:italic placeholder:tracking-wide dark:placeholder:text-gray-300 placeholder:font-light dark:text-white dark:bg-transparent border-b dark:border-admin focus:outline-adminne"
              />
            ) : (
              <p>
                {billingContact.email || (
                  <span className="italic dark:text-gray-300 font-light">
                    email not specified
                  </span>
                )}
              </p>
            )}
            {editBilling ? (
              <input
                type="input"
                name="billing contact phone number"
                placeholder="phone number"
                spellCheck="false"
                autoComplete="off"
                value={billingContact.phone_number}
                onChange={(e) =>
                  setBillingContact({
                    ...billingContact,
                    phone_number: e.target.value,
                  })
                }
                className="w-max md:w-40 placeholder:italic placeholder:tracking-wide dark:placeholder:text-gray-300 placeholder:font-light dark:text-white dark:bg-transparent border-b dark:border-admin focus:outline-adminne"
              />
            ) : (
              <p>
                {billingContact.phone_number || (
                  <span className="italic dark:text-gray-300 font-light">
                    phone number not specified
                  </span>
                )}
              </p>
            )}
            {editBilling && (
              <button
                className="justify-self-end p-1 px-2 text-xs dark:text-admin dark:hover:text-admin/60 border dark:border-admin duration-100 rounded-sm"
                onClick={() => {
                  if (
                    getCustomer.contacts.some(
                      (contact: Contact) => contact.contact_type === "Billing"
                    )
                  ) {
                    setEditBilling(false);
                    updateContact.mutate({
                      contactID: getCustomer.contacts.find(
                        (contact: Contact) => contact.contact_type === "Billing"
                      )?.contact_id,
                      contact: billingContact,
                    });
                  } else {
                    setEditBilling(false);
                    createContact.mutate({
                      contact: billingContact,
                    });
                  }
                }}
              >
                Save
              </button>
            )}
          </article>
        </article>
      </section>
    </section>
  );
};

export default Admin;
