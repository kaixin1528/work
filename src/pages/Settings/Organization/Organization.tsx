/* eslint-disable react-hooks/exhaustive-deps */
import { GetCustomer } from "../../../services/settings/organization";
import SuperAdmin from "./SuperAdmin";
import Admin from "./Admin";
import { checkSuperOrSiteAdmin, getCustomerID } from "../../../utils/general";

const Organization = () => {
  const customerID = getCustomerID();

  const isSuperOrSiteAdmin = checkSuperOrSiteAdmin();

  const { data: getCustomer } = GetCustomer(customerID);

  return (
    <section className="grid content-start w-full h-full">
      {!isSuperOrSiteAdmin ? getCustomer && <Admin /> : <SuperAdmin />}
    </section>
  );
};

export default Organization;
