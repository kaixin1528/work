import {
  faFlag,
  faFilter,
  faSkullCrossbones,
} from "@fortawesome/free-solid-svg-icons";
import CCR from "src/pages/Dashboard/DetailTable/ExpandedView/CCR/CCR";
import CCS from "src/pages/Dashboard/DetailTable/ExpandedView/CCS/CCS";
import CDS from "src/pages/Dashboard/DetailTable/ExpandedView/CDS/CDS";
import CKS from "src/pages/Dashboard/DetailTable/ExpandedView/CKS/CKS";
import CNS from "src/pages/Dashboard/DetailTable/ExpandedView/CNS/CNS";
import CONT from "src/pages/Dashboard/DetailTable/ExpandedView/CONT/CONT";
import CRI from "src/pages/Dashboard/DetailTable/ExpandedView/CRI/CRI";
import CSS from "src/pages/Dashboard/DetailTable/ExpandedView/CSS/CSS";
import IGW from "src/pages/Dashboard/DetailTable/ExpandedView/IGW/IGW";
import VPC from "src/pages/Dashboard/DetailTable/ExpandedView/VPC/VPC";
import WKLD from "src/pages/Dashboard/DetailTable/ExpandedView/WKLD/WKLD";

export const expandedViewTypes = {
  repo: CCR,
  gcrimggrp: CCR,
  ecrimggrp: CCR,
  garimggrp: CCR,
  dkrimg: CRI,
  wkld: WKLD,
  cont: CONT,
  eks: CKS,
  gke: CKS,
  eksng: CNS,
  gnp: CNS,
  ec2: CCS,
  gce: CCS,
  s3: CSS,
  gcb: CSS,
  rdsi: CDS,
  gcs: CDS,
  vpc: VPC,
  igw: IGW,
};

export const diffTabs = [
  {
    key: "removed",
    icon: "/graph/evolution/removed-nodes.svg",
    iconColor: "text-removed",
  },
  {
    key: "modified",
    icon: "/graph/evolution/modified-nodes.svg",
    iconColor: "text-modified",
  },
  {
    key: "created",
    icon: "/graph/evolution/created-nodes.svg",
    iconColor: "text-created",
  },
];

export const inferenceTabs = [
  {
    key: "unusual",
    icon: faFlag,
    iconColor: "text-[#FCEE21]",
  },
  {
    key: "anomalous",
    icon: faFilter,
    iconColor: "text-[#F7931E]",
  },
  {
    key: "malicious",
    icon: faSkullCrossbones,
    iconColor: "text-[#FF0000]",
  },
];

export const tableHeaderIndex = {
  cloudinfra: "InfraBody",
  vpc: "InfraVPCBody",
  s3bucket: "InfraS3BucketBody",
  securitygroup: "InfraSecurityGroupBody",
  workload: "InfraWorkloadGroupBody",
  others: "InfraOthersGroupBody",
  inference: "InferenceEventBody",
};

export const excludeCols = [
  "detail_info",
  "ip_permissions",
  "ip_permission_egress",
  "nat_gateway_addresses",
  "version_enabled",
  "encryption_enabled",
  "node_id",
];

export const containerTimes = [
  {
    name: "7d",
    value: 6.048e11,
  },
  {
    name: "30d",
    value: 2.592e12,
  },
];

export const containerMetricColors = [
  "border-[#25A1CB] bg-[#245874]",
  "border-[#F18D04] bg-[#615239]",
  "border-[#14606D] bg-[#14606D]",
];

export const containerlegends = [
  {
    icon: "/dashboard/expanded/cont/spike.svg",
    name: "Spike",
  },
  {
    icon: "/dashboard/expanded/cont/level-shift.svg",
    name: "Level Shift",
  },
  {
    icon: "/dashboard/expanded/cont/out-of-memory.svg",
    name: "Out of Memory",
  },
  {
    icon: "/dashboard/expanded/cont/delete.svg",
    name: "Delete Event",
  },
];

export const metricColors = ["#25A1CB", "#F18D04", "#14606D"];

export const regionMarkers = {
  aws: {
    "us-west-1": { lat: 40, lng: -123 },
    "us-west-2": { lat: 44, lng: -120 },
    "us-east-1": { lat: 38, lng: -76 },
    "us-east-2": { lat: 42, lng: -80 },
    "af-south-1": { lat: -32, lng: 18 },
    "ap-east-1": { lat: 24, lng: 115 },
    "ap-southeast-3": { lat: -4, lng: 105 },
    "ap-south-1": { lat: 17, lng: 74 },
    "ap-northeast-3": { lat: 35, lng: 135 },
    "ap-northeast-2": { lat: 37, lng: 127 },
    "ap-southeast-1": { lat: 2, lng: 104 },
    "ap-southeast-2": { lat: -30, lng: 150 },
    "ap-northeast-1": { lat: 37, lng: 140 },
    "ca-central-1": { lat: 50, lng: -73 },
    "eu-central-1": { lat: 51, lng: 9 },
    "eu-west-1": { lat: 52, lng: -8 },
    "eu-west-2": { lat: 52, lng: -2 },
    "eu-south-1": { lat: 45, lng: 10 },
    "eu-west-3": { lat: 48, lng: 5 },
    "eu-north-1": { lat: 60, lng: 15 },
    "me-south-1": { lat: 25, lng: 51 },
    "sa-east-1": { lat: -23, lng: -50 },
    "us-gov-east-1": { lat: 40, lng: -117 },
    "us-gov-west-1": { lat: 38, lng: -82 },
  },
  gcp: {
    "asia-east1": { lat: 24, lng: 121 },
    "asia-east2": { lat: 24, lng: 115 },
    "asia-northeast1": { lat: 37, lng: 140 },
    "asia-northeast2": { lat: 35, lng: 135 },
    "asia-northeast3": { lat: 37, lng: 127 },
    "asia-south1": { lat: 17, lng: 74 },
    "asia-south2": { lat: 27, lng: 77 },
    "asia-southeast1": { lat: 2, lng: 104 },
    "asia-southeast2": { lat: -4, lng: 105 },
    "australia-southeast1": { lat: -30, lng: 150 },
    "australia-southeast2": { lat: -36, lng: 145 },
    "europe-central2": { lat: 52, lng: 20 },
    "europe-north1": { lat: 61, lng: 25 },
    "europe-southwest1": { lat: 40, lng: -3 },
    "europe-west1": { lat: 51, lng: 4 },
    "europe-west2": { lat: 52, lng: -2 },
    "europe-west3": { lat: 51, lng: 9 },
    "europe-west4": { lat: 53, lng: 6 },
    "europe-west6": { lat: 47, lng: 8 },
    "europe-west8": { lat: 45, lng: 10 },
    "europe-west9": { lat: 48, lng: 5 },
    "northamerica-northeast1": { lat: 46, lng: -76 },
    "northamerica-northeast2": { lat: 44, lng: -79 },
    "southamerica-east1": { lat: -23, lng: -50 },
    "southamerica-west1": { lat: -34, lng: -71 },
    "us-central1": { lat: 41, lng: -98 },
    "us-central1-custom": { lat: 41, lng: -95 },
    "us-east1": { lat: 33, lng: -81 },
    "us-east4": { lat: 38, lng: -76 },
    "us-east5": { lat: 42, lng: -80 },
    "us-east7": { lat: 39, lng: -83 },
    "us-south1": { lat: 33, lng: -97 },
    "us-west1": { lat: 44, lng: -120 },
    "us-west2": { lat: 34, lng: -118 },
    "us-west2-custom": { lat: 34, lng: -115 },
    "us-west3": { lat: 41, lng: -115 },
    "us-west4": { lat: 37, lng: -117 },
    "me-west1": { lat: 25, lng: 55 },
    "me-central1": { lat: 25, lng: 51 },
  },
};

export const usageKeys = [
  {
    key: "object-store",
    name: "ObjectStore",
    ObjectStore: "bg-[#14606D]",
  },
  {
    key: "operational-store",
    name: "Operational Store",
    "Operational Store": "bg-[#31652D]",
  },
  {
    key: "warehouse",
    name: "Warehouse",
    Warehouse: "bg-[#7A541D]",
  },
  {
    key: "others",
    name: "Others",
    Others: "bg-[#495867]",
  },
];

export const usageTime = [
  {
    key: "24hr",
    previousDays: 3,
  },
  {
    key: "7d",
    previousDays: 8,
  },
  {
    key: "30d",
    previousDays: 31,
  },
];

export const axisColor = "#7894B0";

export const axisBottomTickLabelProps = {
  dy: "0.25em",
  textAnchor: "middle" as const,
  fontFamily: "Arial",
  fontSize: 10,
  fill: "#FFF",
};

export const axisLeftTickLabelProps = {
  dx: "-0.25em",
  dy: "0.25em",
  fontFamily: "Arial",
  fontSize: 10,
  textAnchor: "end" as const,
  fill: "#FFF",
};

export const rollUp = {
  daily: "grid-cols-28 grid-rows-1",
  weekly: "grid-cols-52 grid-rows-1",
  monthly: "grid-cols-12 grid-rows-1",
  quarterly: "grid-cols-8 grid-rows-1",
};

export const devWorkflowColors = {
  dependencies: "bg-[#ffc658]",
  critical_vuln: "bg-[#780000]",
  high_vuln: "bg-[#DC0000]",
};

export const enTabs = [
  {
    section: "firewall",
    name: "Firewall",
  },
  {
    section: "cpm",
    name: "Container Port Mapping",
  },
];
