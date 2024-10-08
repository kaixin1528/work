import { useState } from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import { parseURL } from "src/utils/general";
import LeastActive from "./LeastActive";
import LeastCommonActivity from "./LeastCommonActivity";
import MostActive from "./MostActive";
import ResourceActivity from "./ResourceActivity";
import ResourceActivityDetails from "./ResourceActivityDetails";
import UserActivityCount from "./UserActivityCount";

const UserAudit = () => {
  const parsed = parseURL();

  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedResourceActivity, setSelectedResourceActivity] =
    useState<string>("");

  return (
    <SummaryLayout name="User Activity & Audit">
      {!parsed.resource_activity ? (
        <section>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 dark:bg-panel">
            <UserActivityCount selectedUser={selectedUser} />
            <MostActive
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          </section>
          <ResourceActivity
            setSelectedResourceActivity={setSelectedResourceActivity}
          />
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 dark:bg-panel black-shadow">
            <LeastCommonActivity />
            <LeastActive />
          </section>
        </section>
      ) : (
        <ResourceActivityDetails
          selectedResourceActivity={selectedResourceActivity}
        />
      )}
    </SummaryLayout>
  );
};

export default UserAudit;
