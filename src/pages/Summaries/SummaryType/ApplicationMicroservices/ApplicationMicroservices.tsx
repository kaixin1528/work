import React from "react";
import SummaryLayout from "src/layouts/SummaryLayout";
import LiveResources from "./LiveResources";
import ServiceLifecycle from "./ServiceLifecycle";
import VulnerabilityCountByService from "./VulnerabilityCountByService";
import ServicesAtScale from "./ServicesAtScale";
import ServicesScalingVolatility from "./ServicesScalingVolatility";
import ServiceActivity from "./ServiceActivity";
import ImagesPushed from "./ImagesPushed";
import ServiceActivityByAccount from "./ServiceActivityByAccount";
import Accounts from "../../Accounts";

const ApplicationMicroservices = () => {
  return (
    <SummaryLayout name="Applications and Microservices Footprint">
      <section className="grid gap-5">
        <Accounts />
        <LiveResources />
        <ServicesAtScale />
        <VulnerabilityCountByService />
        <ServiceLifecycle />
        <ServicesScalingVolatility />
        {/* <ServiceActivity /> */}
        <ImagesPushed defaultTopN={10} />
        {/* <ServiceActivityByAccount /> */}
      </section>
    </SummaryLayout>
  );
};

export default ApplicationMicroservices;
