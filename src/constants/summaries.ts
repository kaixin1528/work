import UserAudit from "src/pages/Summaries/SummaryType/UserAudit/UserAudit";
import ComputeServices from "../pages/Summaries/SummaryType/ComputeServices/ComputeServices";
import DependencySupplyChain from "../pages/Summaries/SummaryType/DependencySupplyChain/DependencySupplyChain";
import DevWorkflow from "../pages/Summaries/SummaryType/DevWorkflow/DevWorkflow";
import LayeredCake from "../pages/Summaries/SummaryType/LayeredCake/LayeredCake";
import AccessibleOnInternet from "../pages/Summaries/SummaryType/AccessibleOnInternet/AccessibleOnInternet";
import PostureAssessment from "src/pages/Summaries/SummaryType/PostureAssessment/PostureAssessment";
import VulnerabilityRisks from "../pages/Summaries/SummaryType/VulnerabilityRisks/VulnerabilityRisks";
import CloudControls from "src/pages/Summaries/SummaryType/CloudControls/CloudControls";
import NetworkTopology from "src/pages/Summaries/SummaryType/NetworkTopology/NetworkTopology";
import IAMRisks from "src/pages/Summaries/SummaryType/IAMRisks/IAMRisks";
import DatabaseStorage from "src/pages/Summaries/SummaryType/DatabaseStorage/DatabaseStorage";
import ApplicationMicroservices from "src/pages/Summaries/SummaryType/ApplicationMicroservices/ApplicationMicroservices";
import CyberRisk from "src/pages/Summaries/SummaryType/CyberRisk/CyberRisk";
import AssetService from "src/pages/Summaries/SummaryType/CyberRisk/AssetService/AssetService";
import SystemEntropy from "src/pages/Summaries/SummaryType/SystemEntropy/SystemEntropy";
import AuditLogs from "src/pages/Summaries/SummaryType/AuditLogs/AuditLogs";
import IncidentResponse from "src/pages/Summaries/SummaryType/IncidentResponse/IncidentResponse";
import CommonVulnerabilities from "src/pages/Summaries/SummaryType/CommonVulnerabilities/CommonVulnerabilities";
import VulnSummaryLineage from "src/pages/Summaries/SummaryType/VulnSummaryLineage/VulnSummaryLineage";
import SLARemediation from "src/pages/Summaries/SummaryType/SLARemediation/SLARemediation";
import VulnByVendor from "src/pages/Summaries/SummaryType/VulnByVendor/VulnByVendor";

export const summaryLogos = {
  "CISO Summaries": "ciso",
  "Audit & Evolution": "audit",
  "Alerts, Events, & Incidents": "alerts",
  "Vulnerability Analysis": "vulnerability",
  "Software Supply Chain": "software",
  "Regulation & Policy": "compliance",
  "Identity & Access": "identity",
  "Data Perimeter & Flows": "data",
  Network: "network",
};

export const summaryTypes = {
  layered_cake: LayeredCake,
  development_workflow: DevWorkflow,
  accessible_on_the_internet: AccessibleOnInternet,
  compute_and_services_modifications: ComputeServices,
  dependency_and_supply_chain: DependencySupplyChain,
  vulnerability_risks: VulnerabilityRisks,
  user_activity_and_audit: UserAudit,
  posture_assessment: PostureAssessment,
  cloud_controls: CloudControls,
  network_topology: NetworkTopology,
  iam_risks: IAMRisks,
  database_and_storage: DatabaseStorage,
  applications_and_microservices_footprint: ApplicationMicroservices,
  cyber_risk_assessment: CyberRisk,
  overall_system_entropy: SystemEntropy,
  audit_logs: AuditLogs,
  incident_response: IncidentResponse,
  vulnerability_summary_lineage: VulnSummaryLineage,
  common_vulnerabilities: CommonVulnerabilities,
  sla_and_remediation: SLARemediation,
  vulnerability_by_vendor: VulnByVendor,
};

export const severityColors = {
  0: "bg-filter/50 hover:bg-filter/30 duration-100 border-2 dark:border-filter rounded-md",
  1: "bg-no/50 hover:bg-no/30 duration-100 border-2 dark:border-no rounded-md",
  2: "bg-low/50 hover:bg-low/30 duration-100 border-2 dark:border-low rounded-md",
  3: "bg-medium/50 hover:bg-medium/30 duration-100 border-2 dark:border-medium rounded-md",
  4: "bg-high/50 hover:bg-high/30 duration-100 border-2 dark:border-high rounded-md",
  5: "bg-critical/50 hover:bg-critical/30 duration-100 border-2 dark:border-critical rounded-md",
  "no score":
    "bg-filter/50 hover:bg-filter/30 duration-100 border-2 dark:border-filter rounded-md",
  undefined:
    "bg-filter/50 hover:bg-filter/30 duration-100 border-2 dark:border-filter rounded-md",
  informational:
    "bg-no/50 hover:bg-no/30 duration-100 border-2 dark:border-no rounded-md",
  low: "bg-low/50 hover:bg-low/30 duration-100 border-2 dark:border-low rounded-md",
  medium:
    "bg-medium/50 hover:bg-medium/30 duration-100 border-2 dark:border-medium rounded-md",
  high: "bg-high/50 hover:bg-high/30 duration-100 border-2 dark:border-high rounded-md",
  critical:
    "bg-critical/50 hover:bg-critical/30 duration-100 border-2 dark:border-critical rounded-md",
};

export const severityMapping = {
  0: "Unknown",
  1: "Minimal",
  2: "Low",
  3: "Medium",
  4: "High",
  5: "Critical",
};

export const testHeader = [
  { display_name: "CVE", property_name: "cve_name" },
  { display_name: "Service Name", property_name: "service_name" },
];

export const testData = [
  { cve_name: "1", service_name: "apigateway" },
  { cve_name: "2", service_name: "ec2" },
];

export const devWorkflowFrequency = ["daily", "monthly", "quaterly"];

export const heatmapColors = {
  0: "bg-no/0",
  10: "bg-no/10",
  20: "bg-no/20",
  30: "bg-no/30",
  40: "bg-no/40",
  50: "bg-no/50",
  60: "bg-no/60",
  70: "bg-no/70",
  80: "bg-no/80",
  90: "bg-no/90",
  100: "bg-no",
};

export const heatmapMaxColors = {
  0: "bg-no/0",
  10: "bg-no/10",
  20: "bg-no/20",
  30: "bg-no/30",
  40: "bg-no/40",
  50: "bg-no/50",
  60: "bg-no/60",
  70: "bg-no/70",
  80: "bg-no/80",
  90: "bg-no/90",
  100: "bg-no",
};

export const heatmapMinColors = {
  0: "bg-no",
  10: "bg-no/90",
  20: "bg-no/80",
  30: "bg-no/70",
  40: "bg-no/60",
  50: "bg-no/50",
  60: "bg-no/50",
  70: "bg-no/30",
  80: "bg-no/20",
  90: "bg-no/10",
  100: "bg-no/0",
};

export const slaColors = {
  critical: {
    0: "bg-critical/0",
    10: "bg-critical/10",
    20: "bg-critical/20",
    30: "bg-critical/30",
    40: "bg-critical/40",
    50: "bg-critical/50",
    60: "bg-critical/60",
    70: "bg-critical/70",
    80: "bg-critical/80",
    90: "bg-critical/90",
    100: "bg-critical",
  },
  high: {
    0: "bg-high/0",
    10: "bg-high/10",
    20: "bg-high/20",
    30: "bg-high/30",
    40: "bg-high/40",
    50: "bg-high/50",
    60: "bg-high/60",
    70: "bg-high/70",
    80: "bg-high/80",
    90: "bg-high/90",
    100: "bg-high",
  },
  medium: {
    0: "bg-medium/0",
    10: "bg-medium/10",
    20: "bg-medium/20",
    30: "bg-medium/30",
    40: "bg-medium/40",
    50: "bg-medium/50",
    60: "bg-medium/60",
    70: "bg-medium/70",
    80: "bg-medium/80",
    90: "bg-medium/90",
    100: "bg-medium",
  },
  low: {
    0: "bg-low/0",
    10: "bg-low/10",
    20: "bg-low/20",
    30: "bg-low/30",
    40: "bg-low/40",
    50: "bg-low/50",
    60: "bg-low/60",
    70: "bg-low/70",
    80: "bg-low/80",
    90: "bg-low/90",
    100: "bg-low",
  },
  informational: {
    0: "bg-informational/0",
    10: "bg-informational/10",
    20: "bg-informational/20",
    30: "bg-informational/30",
    40: "bg-informational/40",
    50: "bg-informational/50",
    60: "bg-informational/60",
    70: "bg-informational/70",
    80: "bg-informational/80",
    90: "bg-informational/90",
    100: "bg-informational",
  },
  undefined: {
    0: "bg-filter/0",
    10: "bg-filter/10",
    20: "bg-filter/20",
    30: "bg-filter/30",
    40: "bg-filter/40",
    50: "bg-filter/50",
    60: "bg-filter/60",
    70: "bg-filter/70",
    80: "bg-filter/80",
    90: "bg-filter/90",
    100: "bg-filter",
  },
};

export const periods = {
  1: "Today",
  5: "This Week",
  3: "This Month",
};

export const periodMapping = {
  1: "Daily",
  5: "Weekly",
  3: "Monthly",
  4: "Quarterly",
  // 5: "Yearly",
};

export const actionColors = {
  all: "px-2 py-1 bg-signin/30 border border-signin",
  created: "px-2 py-1 bg-no/30 border border-contact",
  added: "px-2 py-1 bg-no/30 border border-contact",
  modified: "px-2 py-1 bg-note/30 border border-note",
  changed: "px-2 py-1 bg-note/30 border border-note",
  removed: "px-2 py-1 bg-reset/30 border border-reset",
};

export const riskLevelColors = {
  good: "border border-[#91D19F] bg-[#33505B]",
  warning: "border border-[#FF9900] bg-[#3D3C31]",
  danger: "border border-[#F04163] bg-[#423A52]",
};

export const cyberRiskCategories = {
  Surface: [
    "Assets and Services",
    "Applications",
    "Interfaces",
    "Third Parties",
  ],
  Protection: [
    "Visibility",
    "Traceability",
    "Controls",
    "Operational Advantage",
  ],
  Exposure: ["Poor Hygiene", "Vulnerabilities", "Data", "Maturity Gaps"],
  Mitigation: [
    "Attack Surface Management",
    "Incident Response",
    "Business Risk Prioritization",
    "Coverage and Adaptability",
  ],
};

export const cyberRiskItems = {
  assets_and_services: AssetService,
};

export const percentageWidths = {
  "0": "w-0",
  "0.0833": "w-1/12",
  "0.166": "w-2/12",
  "0.25": "w-3/12",
  "0.333": "w-4/12",
  "0.416": "w-5/12",
  "0.5": "w-6/12",
  "0.583": "w-7/12",
  "0.666": "w-8/12",
  "0.75": "w-9/12",
  "0.833": "w-10/12",
  "0.916": "w-11/12",
  "1": "w-full",
};

export const percentageHeights = {
  "0": "h-[1rem]",
  "0.166": "h-1/6",
  "0.333": "h-2/6",
  "0.5": "h-3/6",
  "0.666": "h-4/6",
  "0.833": "h-5/6",
  "1": "h-full",
};

export const stackedHeights = {
  "0": "h-0",
  "0.0833": "h-3",
  "0.166": "h-6",
  "0.25": "h-10",
  "0.333": "h-12",
  "0.416": "h-16",
  "0.5": "h-20",
  "0.583": "h-24",
  "0.666": "h-28",
  "0.75": "h-30",
  "0.833": "h-34",
  "0.916": "h-36",
  "1": "h-full",
};

export const statusColors = {
  open: "bg-admin",
  "in progress": "bg-signin",
  unresolved: "bg-purple-500",
  snoozed: "bg-purple-500",
  closed: "bg-no",
};

export const severityTooltipColors = {
  high: "bg-reset",
  medium: "text-black bg-event",
  low: "text-black bg-low",
};

export const vrInfoDescription = {
  live_vulnerability_exposures:
    "Services counts that have been or are live which contain CVEs",
  open_over_90_days:
    "CVEs introduced to your system that have been around for over 90 days",
  high_risk:
    "Services that have been running or have run with High and Critical CVEs",
  newer_exposures: "CVEs introduced to your system in the last 7 days",
};
