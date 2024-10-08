import React, { useState } from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import Accounts from "../../Accounts";
import AssessmentOverview from "./AssessmentOverview";
import AssessmentDetails from "./AssessmentDetails";

const CloudControls = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("status");
  const [selectedStatus, setSelectedStatus] = useState<string>("FAIL");
  const [selectedService, setSelectedService] = useState<string>("");

  return (
    <SummaryLayout name="Cloud Controls" hidePeriod>
      <Accounts />
      <AssessmentOverview
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
      />
      <AssessmentDetails
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        selectedService={selectedService}
      />
    </SummaryLayout>
  );
};

export default CloudControls;
