import { GetCustomers } from "../../../services/settings/organization";
import { Customer } from "../../../types/settings";
import CustomerDetail from "./CustomerDetail";
import NewCustomer from "./NewCustomer";

const SuperAdmin = () => {
  const { data: allCustomers } = GetCustomers(true);

  return (
    <section className="grid content-start gap-5 p-5">
      <h4>CUSTOMERS ({allCustomers?.length})</h4>

      <ul className="grid grid-cols-1 md:grid-cols-3 content-start items-stretch gap-5 w-full h-full">
        {allCustomers?.map((customer: Customer, index: number) => {
          return <CustomerDetail key={index} customer={customer} />;
        })}

        <NewCustomer />
      </ul>
    </section>
  );
};

export default SuperAdmin;
