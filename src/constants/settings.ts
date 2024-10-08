import AWS from "src/pages/Settings/Integrations/IntegrationType/AWS";
import DATADOG from "src/pages/Settings/Integrations/IntegrationType/DATADOG";
import GCP from "src/pages/Settings/Integrations/IntegrationType/GCP";
import SLACK from "src/pages/Settings/Integrations/IntegrationType/SLACK";
import CIRCLECI from "src/pages/Settings/Integrations/IntegrationType/CIRCLECI";
import GITHUB_APP from "src/pages/Settings/Integrations/IntegrationType/GITHUB_APP";
import GITHUB from "src/pages/Settings/Integrations/IntegrationType/GITHUB";
import INSIGHTVM from "src/pages/Settings/Integrations/IntegrationType/INSIGHTVM";

export const integrationTypes = {
  AWS: AWS,
  GCP: GCP,
  DATADOG: DATADOG,
  GITHUB: GITHUB,
  GITHUB_APP: GITHUB_APP,
  SLACK: SLACK,
  CIRCLECI: CIRCLECI,
  INSIGHTVM: INSIGHTVM,
};

export const awsRegions = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "sa-east-1",
  "ap-east-1",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-northeast-3",
  "ap-south-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-southeast-3",
];

export const zones = [
  "australia-southeast1-b",
  "europe-central2-b",
  "us-east5-c",
  "southamerica-west1-a",
  "asia-east1-a",
  "asia-east1-b",
  "europe-west8-b",
  "europe-west3-c",
  "asia-northeast3-c",
  "asia-south2-a",
  "northamerica-northeast2-b",
  "europe-west9-a",
  "northamerica-northeast2-a",
  "europe-west2-a",
  "southamerica-west1-b",
  "us-west1-a",
  "europe-central2-a",
  "asia-northeast3-b",
  "us-west1-c",
  "europe-west9-c",
  "us-east1-d",
  "us-east1-c",
  "australia-southeast1-c",
  "southamerica-east1-c",
  "asia-southeast2-b",
  "europe-west4-b",
  "europe-southwest1-b",
  "northamerica-northeast1-c",
  "australia-southeast2-b",
  "asia-northeast2-c",
  "europe-west2-c",
  "asia-south1-a",
  "europe-west6-b",
  "us-east5-b",
  "europe-north1-c",
  "europe-southwest1-c",
  "us-east5-a",
  "us-west2-b",
  "northamerica-northeast1-b",
  "me-west1-c",
  "us-east4-b",
  "europe-west4-c",
  "us-west3-c",
  "europe-west9-b",
  "asia-east2-a",
  "us-west3-a",
  "asia-south2-c",
  "asia-southeast1-a",
  "asia-southeast2-c",
  "australia-southeast1-a",
  "europe-west6-c",
  "us-south1-b",
  "us-east1-b",
  "australia-southeast2-a",
  "asia-south1-b",
  "asia-south1-c",
  "us-west4-c",
  "europe-north1-a",
  "us-central1-b",
  "us-east4-a",
  "us-south1-a",
  "southamerica-east1-b",
  "us-central1-c",
  "us-west3-b",
  "asia-northeast2-a",
  "southamerica-east1-a",
  "us-west2-c",
  "us-west4-b",
  "me-west1-b",
  "europe-central2-c",
  "asia-northeast1-c",
  "asia-northeast1-b",
  "europe-southwest1-a",
  "europe-north1-b",
  "asia-northeast3-a",
  "europe-west1-c",
  "northamerica-northeast2-c",
  "asia-northeast2-b",
  "asia-east2-b",
  "europe-west3-a",
  "southamerica-west1-c",
  "asia-southeast1-b",
  "europe-west4-a",
  "me-west1-a",
  "europe-west8-c",
  "asia-northeast1-a",
  "us-east4-c",
  "europe-west6-a",
  "australia-southeast2-c",
  "asia-south2-b",
  "asia-southeast1-c",
  "us-south1-c",
  "europe-west1-d",
  "us-west1-b",
  "us-west4-a",
  "us-west2-a",
  "asia-east2-c",
  "europe-west8-a",
  "europe-west2-b",
  "us-central1-a",
  "europe-west1-b",
  "northamerica-northeast1-a",
  "europe-west3-b",
  "asia-southeast2-a",
  "asia-east1-c",
  "us-central1-f",
];

export const roleTypeColors = {
  "super admin":
    "py-1 px-2 text-xs dark:bg-[#D0D104]/60 border dark:border-[#D0D104] rounded-sm",
  admin:
    "py-1 px-2 text-xs dark:bg-admin/60 border dark:border-admin rounded-sm",
  regular:
    "py-1 px-2 text-xs dark:bg-checkbox/60 border dark:border-checkbox rounded-sm",
};

export const activationColors = {
  activated: [
    "px-2 py-1 uppercase border border-[#61AE25] bg-[#274751] rounded-sm",
  ],
  deactivated: [
    "px-2 py-1 uppercase border border-[#FF9900] bg-[#3D3C31] rounded-sm",
  ],
};

export const initialRoleDetails = {
  role_name: "",
  role_type: "",
};
