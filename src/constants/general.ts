import ATTACK from "src/components/Graph/NodeType/ATTACK";
import FirewallEdge from "../components/Graph/EdgeType/FirewallEdge";
import MainEdge from "../components/Graph/EdgeType/MainEdge";
import AGG from "../components/Graph/NodeType/AGG";
import NON_AGG from "../components/Graph/NodeType/NON_AGG";
import FIREWALL from "src/components/Graph/NodeType/FIREWALL";
import {
  faComment,
  faEye,
  faNoteSticky,
  faUserTag,
} from "@fortawesome/free-solid-svg-icons";
import CPM from "src/components/Graph/NodeType/CPM";
import CPMEdge from "src/components/Graph/EdgeType/CPMEdge";
import MappingEdge from "src/components/Graph/EdgeType/MappingEdge";
import Mapping from "src/components/Graph/NodeType/Mapping";
import { env } from "src/env";

export const baseURL = env.REACT_APP_BASE_URL;
export const wsBaseURL = env.REACT_APP_WEBSOCKET_BASE_URL;
export const apiVersion = env.REACT_APP_VERSION;
export const googleClientID = env.REACT_APP_GOOGLE_CLIENT_ID;
export const pageSize = 100;
export const poc = env.REACT_APP_POC;
export const grc = env.REACT_APP_COMPLIANCE;
export const simulation = env.REACT_APP_SIMULATION;
export const disableGRC = env.REACT_APP_DISABLE_GRC;

export const pageMapping = {
  "Getting Started": "Getting Started",
  "Enterprise Knowledge Graph": "Enterprise Knowledge Graph",
  Dashboard: "Dashboard",
  Investigation: "Investigation",
  Simulation: "Simulation",
  "Third Party Risk": "Third Party Risk",
  "Business Continuity": "Business Continuity",
  "Regulation & Policy": "Regulation & Policy",
  "Risk Intelligence": "Risk Intelligence",
  "Audits & Assessments": "Audits & Assessments",
  "Agreement & Contract Review": "Agreement & Contract Review",
  Inference: "Inference",
  RCA: "Root Cause Analysis",
  Recommendation: "Recommendation",
  Summaries: "Summaries: Reports & Insights",
  Help: "Help",
  Settings: "Settings",
  Documentation: "Documentation",
  Profile: "Profile",
};

export const sidebarItems = [
  {
    icon: "getting-started-nav",
    name: "Getting Started",
    href: "/getting-started",
  },
  {
    icon: "regulation-policy-nav",
    name: "Regulation & Policy",
    href: "/regulation-policy/summary",
  },
  {
    icon: "third-party-risk-nav",
    name: "Third Party Risk",
    href: "/third-party-risk/summary",
  },
  {
    icon: "audits-assessments-nav",
    name: "Audits & Assessments",
    href: "/audits-assessments/summary",
  },
  {
    icon: "business-continuity-nav",
    name: "Business Continuity",
    href: "/business-continuity/summary",
  },
  {
    icon: "agreement-contract-review-nav",
    name: "Agreement & Contract Review",
    href: "/agreement-contract-review/summary",
  },
  {
    icon: "summaries-nav",
    name: "Summaries",
    href: "/summaries/summary",
  },
  {
    icon: "graph-nav",
    name: "Enterprise Knowledge Graph",
    href: "/graph/summary",
  },
  {
    icon: "risk-intelligence-nav",
    name: "Risk Intelligence",
    href: "/risk-intelligence/summary",
  },
  {
    icon: "investigation-nav",
    name: "Investigation",
    href: "/investigation/summary",
  },
  {
    icon: "simulation-nav",
    name: "Simulation",
    href: "/simulation/summary",
  },
  {
    icon: "dashboard-nav",
    name: "Dashboard",
    href: "/dashboard/summary",
  },
  // {
  //   icon: "inference-nav",
  //   name: "Inference",
  //   href: "/inference/summary",
  // },
  // {
  //   icon: "rca-nav",
  //   name: "RCA",
  //   href: "/rca/summary",
  // },
  // {
  //   icon: "recommendation-nav",
  //   name: "Recommendation",
  //   href: "/recommendation/summary",
  // },
  // {
  //   icon: "help-nav",
  //   name: "Help",
  //   href: "/help",
  // },
  {
    icon: "settings-nav",
    name: "Settings",
    href: "/settings/details?section=organization",
  },
];

export const nodeTypes = {
  AGG: AGG,
  NON_AGG: NON_AGG,
  ATTACK: ATTACK,
  FIREWALL: FIREWALL,
  CPM: CPM,
  mapping: Mapping,
};

export const edgeTypes = {
  main: MainEdge,
  PortProtocol: FirewallEdge,
  cpm: CPMEdge,
  mapping: MappingEdge,
};

export const autcompleteQueryParams = [
  "type",
  "edge_type",
  "id",
  "rel",
  "is_egress",
  "port_from",
  "port_to",
  "port",
  "protocol",
  "protocol_name",
  "ingress_ip",
  "service_type",
  "cluster_ip",
  "node_port",
  "target_port",
  "svc_name",
  "cloud_id",
  "impact_radius",
  "application",
  "connected",
  "annotation",
  "extension",
  "aggregation_type",
  "resource_status",
  "cloud_provider",
  "radius",
  "audit_type",
  "audit",
  "audit_event",
  "audit_property_type",
  "audit_is_assumed_role",
  "audit_user_name",
  "audit_user_arn",
  ...[
    "property",
    "connected_property",
    "annotation_property",
    "extension_property",
    "audit_property",
    "node_property",
    "edge_property",
  ]
    .map((param) => {
      return ["", "_name", "_operator", "_value"].map((suffix) => {
        return `${param}${suffix}`;
      });
    })
    .flat(),
];

export const sidebarVariants = {
  hidden: {
    width: 0,
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
  show: {
    opacity: 1,
    width: "auto",
    transition: {
      duration: 0.5,
    },
  },
};

export const showVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, staggerChildren: 0.3 },
  },
};

export const pathVariants = {
  hidden: { pathLength: 0, pathOffset: 0 },
  visible: {
    pathLength: 1,
    pathOffset: 0,
    transition: {
      staggerChildren: 0.5,
      duration: 5,
      ease: "easeInOut",
    },
  },
};

export const setupVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? -200 : 200,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? -200 : -200,
      opacity: 0,
    };
  },
};

export const validVariants = {
  hidden: { x: 0 },
  visible: {
    x: 5,
    transition: { duration: 0.5, type: "spring", stiffness: 2000 },
  },
};

export const filterVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.1, staggerChildren: 0.05 },
  },
};

export const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export const rightPanelVariants = {
  hidden: {
    x: 500,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
    },
    zIndex: 20,
  },
};

export const leftPanelVariants = {
  hidden: {
    x: -500,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
    },
    zIndex: 20,
  },
};

export const chatVariants = {
  hidden: { opacity: 0, transition: { duration: 0.5 } },
  visible: {
    opacity: 1,
    transition: { duration: 1, delay: 0.5 },
  },
};

export const pointerVariants = {
  hidden: { opacity: 0, transition: { duration: 0.7 } },
  visible: {
    opacity: 1,
    transition: { duration: 1, delay: 1, staggerChildren: 0.3 },
  },
};

export const childrenVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
};

export const paragraphVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, staggerChildren: 0.1 },
  },
};

export const listVariants = {
  visible: {
    opacity: 1,
    transition: { duration: 2 },
  },
  hidden: {
    opacity: 0,
    transition: { when: "afterChildren" },
  },
};

export const actionVariants = {
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
  hidden: {
    opacity: 0,
    transition: { duration: 2, staggerChildren: 5 },
  },
};

export const userColors = {
  a: "from-[#575893] to-[#52588B]",
  b: "from-[#C1C40F] to-[#627356]",
  c: "from-[#CC6665] to-[#48556C]",
  d: "from-[#26A4A4] to-[#375D73]",
  e: "from-[#32742C] to-[#3A5768]",
  f: "from-[#ee9b00] to-[#3A5768]",
  g: "from-[#2997BE] to-[#2E8BAE]",
  h: "from-[#32742C] to-[#3A5768]",
  i: "from-[#32742C] to-[#3A5768]",
  j: "from-[#ee9b00] to-[#3A5768]",
  k: "from-[#CC6665] to-[#48556C]",
  l: "from-[#5CA031] to-[#57933D]",
  m: "from-[#BA0F61] to-[#A31D64]",
  n: "from-[#26A4A4] to-[#375D73]",
  o: "from-[#2997BE] to-[#2E8BAE]",
  p: "from-[#26A4A4] to-[#375D73]",
  q: "from-[#575893] to-[#52588B]",
  r: "from-[#CC6665] to-[#48556C]",
  s: "from-[#5CA031] to-[#57933D]",
  t: "from-[#606162] to-[#575E65]",
  u: "from-[#C1C40F] to-[#627356]",
  v: "from-[#ee9b00] to-[#3A5768]",
  w: "from-[#606162] to-[#575E65]",
  x: "from-[#BA0F61] to-[#A31D64]",
  y: "from-[#C1C40F] to-[#627356]",
  z: "from-[#575893] to-[#52588B]",
  0: "from-[#575893] to-[#52588B]",
  1: "from-[#C1C40F] to-[#627356]",
  2: "from-[#CC6665] to-[#48556C]",
  3: "from-[#26A4A4] to-[#375D73]",
  4: "from-[#32742C] to-[#3A5768]",
  5: "from-[#ee9b00] to-[#3A5768]",
  6: "from-[#2997BE] to-[#2E8BAE]",
  7: "from-[#32742C] to-[#3A5768]",
  8: "from-[#32742C] to-[#3A5768]",
  9: "from-[#ee9b00] to-[#3A5768]",
};

export const filterIndex = {
  is: "eq",
  "is not": "ne",
  "=": "eq",
  "!=": "ne",
  contains: "ilike",
  "does not contain": "notilike",
  ">=": "ge",
  "<=": "le",
  ">": "gt",
  "<": "lt",
  "is true": "eq",
  "is false": "eq",
};

export const operatorMappings = {
  "=": "equals",
  "!=": "not equals",
  "~": "similar to",
  "!~": "not similar to",
  "~~": "similar to",
  "!~~": "not similar to",
};

export const attributeColors = {
  created: "px-2 py-1 w-max border border-[#91D19F] bg-[#33505B] rounded-sm",
  removed:
    "px-2 py-1 w-max dark:text-white/60 border border-[#F04163] bg-[#423A52] rounded-sm",
  modified: "px-2 py-1 w-max border border-[#FF9900] bg-[#3D3C31] rounded-sm",
  good: "px-2 py-1 w-max border border-[#91D19F] bg-[#33505B] rounded-sm",
  likely: "px-2 py-1 w-max bg-high/50 border-2 dark:border-high rounded-sm",
  unlikely: "px-2 py-1 w-max bg-low/50 border-2 dark:border-low rounded-sm",
  rare: "px-2 py-1 w-max bg-filter/50 border-2 dark:border-filter rounded-sm",
  possible:
    "px-2 py-1 w-max bg-medium/50 border-2 dark:border-medium rounded-sm",
  negligible:
    "px-2 py-1 w-max bg-filter/50 border-2 dark:border-filter rounded-sm",
  low: "px-2 py-1 w-max bg-low/50 border-2 dark:border-low rounded-sm",
  medium: "px-2 py-1 w-max bg-medium/50 border-2 dark:border-medium rounded-sm",
  moderate:
    "px-2 py-1 w-max bg-medium/50 border-2 dark:border-medium rounded-sm",
  warning: "px-2 py-1 w-max border border-[#FF9900] bg-[#3D3C31] rounded-sm",
  danger: "px-2 py-1 w-max border border-[#F04163] bg-[#423A52] rounded-sm",
  high: "px-2 py-1 w-max bg-high/50 border-2 dark:border-high rounded-sm",
  critical:
    "px-2 py-1 w-max bg-critical/50 border-2 dark:border-critical rounded-sm",
  severe:
    "px-2 py-1 w-max bg-critical/50 border-2 dark:border-critical rounded-sm",
  completed:
    "px-2 py-1 w-max uppercase border border-[#61AE25] bg-[#274751] rounded-sm",
  success:
    "px-2 py-1 w-max uppercase border border-[#61AE25] bg-[#274751] rounded-sm",
  failure:
    "px-2 py-1 w-max uppercase border border-[#F04163] bg-[#423A52] rounded-sm",
  pass: "px-2 py-1 w-max uppercase border border-[#61AE25] bg-[#274751] rounded-sm",
  fail: "px-2 py-1 w-max uppercase border border-[#F04163] bg-[#423A52] rounded-sm",
  cancelled:
    "px-2 py-1 w-max uppercase border border-[#F04163] bg-[#423A52] rounded-sm",
  active:
    "px-2 py-1 w-max uppercase border border-[#61AE25] bg-[#274751] rounded-sm",
  major: "px-2 py-1 w-max border border-[#F04163] bg-[#423A52] rounded-sm",
  minor: "px-2 py-1 w-max bg-low/50 border-2 dark:border-low rounded-sm",
  enabled:
    "px-2 py-1 w-max uppercase border border-[#61AE25] bg-[#274751] rounded-sm",
  "setup now":
    "px-2 py-1 w-max text-left border border-[#61AE25] bg-[#274751] text-[#61AE25] rounded-sm",
  inactive:
    "px-2 py-1 w-max  uppercase border border-[#FF9900] bg-[#3D3C31] rounded-sm",
  stale:
    "px-2 py-1 w-max  uppercase border border-[#FF9900] bg-[#3D3C31] rounded-sm",
  disabled:
    "px-2 py-1 w-max uppercase border border-[#7893B0] bg-[#223B54] text-[#7893B0] rounded-sm",
  "not enabled":
    "px-2 py-1 w-max uppercase border border-[#7893B0] bg-[#223B54] text-[#7893B0] rounded-sm",
  true: "px-2 py-1 w-max text-left uppercase border border-[#61AE25] bg-[#274751] text-[#61AE25] rounded-sm",
  false:
    "px-2 py-1 w-max uppercase border border-[#F04163] bg-[#3A2B45] text-[#F04163] rounded-sm",
  "open to all":
    "px-2 py-1 w-max uppercase border border-[#F04163] bg-[#3A2B45] text-[#F04163] rounded-sm",
  available:
    "px-2 py-1 w-max uppercase border border-[#61AE25] bg-[#61AE25] rounded-sm",
  implemented:
    "px-2 py-1 w-max uppercase border border-[#61AE25] bg-[#61AE25] rounded-sm",
  unavailable:
    "px-2 py-1 w-max uppercase border border-[#FF9900] bg-[#3D3C31] bg-[#FF9900] rounded-sm",
  "not implemented":
    "px-2 py-1 w-max  uppercase border border-[#FF9900] bg-[#3D3C31] rounded-sm",
  before:
    "px-2 py-1 dark:text-white/60 border border-[#F04163] bg-[#423A52] rounded-sm",
  after: "px-2 py-1 border border-[#91D19F] bg-[#33505B] rounded-sm",
  ready: "px-3 py-1 w-max uppercase bg-no rounded-full",
  in_progress: "px-3 py-1 w-max uppercase bg-purple-500 rounded-full",
  "in progress": "px-3 py-1 w-max uppercase bg-purple-500 rounded-sm",
  draft: "px-3 py-1 w-max uppercase bg-event rounded-full",
  parsed: "px-3 py-1 w-max uppercase bg-event rounded-full",
  "auto extracted by uno": "px-3 py-1 w-max uppercase bg-event rounded-sm",
  approved: "px-3 py-1 w-max uppercase bg-no rounded-full",
};

export const excludePaths = [
  "/signin",
  "/reset_password/details",
  "/400",
  "/403",
  "/404",
  "/500",
  "/502",
  "/503",
];

export const chartLegendColors = {
  0: "bg-[#D0D104]",
  1: "bg-[#26A4A4]",
  2: "bg-[#F18D04]",
  3: "bg-[#61AE25]",
  4: "bg-[#25A1CB]",
  5: "bg-[#82ca9d]",
  6: "bg-[#8884d8]",
  7: "bg-[#CC6665]",
  8: "bg-[#D2005E]",
  9: "bg-[#0065DE]",
  10: "bg-[#29ABE2]",
  11: "bg-[#030D22]",
  12: "bg-[#616161]",
  13: "bg-[#FCEE21]",
  14: "bg-[#7993B0]",
  15: "bg-[#45E15B]",
  16: "bg-[#A0ABB6]",
  17: "bg-[#423A52]",
  18: "bg-[#516F92]",
  19: "bg-[#FFFDD0]",
};

export const chartDataColors = {
  0: "#D0D104",
  1: "#26A4A4",
  2: "#F18D04",
  3: "#61AE25",
  4: "#25A1CB",
  5: "#82ca9d",
  6: "#8884d8",
  7: "#CC6665",
  8: "#D2005E",
  9: "#0065DE",
  10: "#29ABE2",
  11: "#030D22",
  12: "#616161",
  13: "#FCEE21",
  14: "#7993B0",
  15: "#45E15B",
  16: "#A0ABB6",
  17: "#423A52",
  18: "#516F92",
  19: "#FFFDD0",
};

export const severities = [
  "undefined",
  "informational",
  "low",
  "medium",
  "high",
  "critical",
];

export const severityBGColors = {
  0: "bg-filter",
  undefined: "bg-filter",
  1: "bg-informational",
  informational: "bg-informational",
  2: "bg-low",
  low: "bg-low",
  3: "bg-medium",
  medium: "bg-medium",
  4: "bg-high",
  high: "bg-high",
  5: "bg-critical",
  critical: "bg-critical",
};

export const severityChartColors = {
  0: "#41576D",
  undefined: "#41576D",
  1: "#22B573",
  informational: "#22B573",
  2: "#FDC500",
  low: "#FDC500",
  3: "#FD8C00",
  medium: "#FD8C00",
  4: "#DC0000",
  high: "#DC0000",
  5: "#780000",
  critical: "#780000",
  others: "#41576D",
};

export const severityLegends = {
  5: "critical",
  4: "high",
  3: "medium",
  2: "low",
  1: "informational",
  0: "undefined",
};

export const severityMappingToNumerals = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  informational: 1,
  undefined: 0,
};

export const queryStringColors = {
  0: "px-2 py-1 w-max break-all text-sm bg-no/30 border border-contact rounded-sm",
  1: "px-2 py-1 w-max break-all text-sm bg-admin/30 border border-admin rounded-sm",
  2: "px-2 py-1 w-max break-all text-sm bg-event/30 border border-event rounded-sm",
  3: "px-2 py-1 w-max break-all text-sm bg-progress/30 border border-progress rounded-sm",
  4: "px-2 py-1 w-max break-all text-sm bg-purple-500/30 border border-purple-500 rounded-sm",
  5: "px-2 py-1 w-max break-all text-sm bg-metric/30 border border-metric rounded-sm",
  6: "px-2 py-1 w-max break-all text-sm bg-checkbox/30 border border-checkbox rounded-sm",
  7: "px-2 py-1 w-max break-all text-sm bg-pink-500/30 border border-pink-500 rounded-sm",
  8: "px-2 py-1 w-max break-all text-sm bg-signin/30 border border-signin rounded-sm",
  9: "px-2 py-1 w-max break-all text-sm bg-progress/30 border border-progress rounded-sm",
  10: "px-2 py-1 w-max break-all text-sm bg-no/30 border border-contact rounded-sm",
};

export const detailPanelTabs = [
  "Info",
  "Impact",
  "Damages",
  "Alerts",
  "Notes",
  "Timeline",
];

export const initialFilter = {
  field: "",
  op: "",
  value: "",
  type: "",
  set_op: "",
};

export const initialSort = {
  order: "asc",
  orderBy: "",
};

export const notificationTypes = {
  "New comment posted": {
    text: "posted a new note",
    icon: faComment,
    iconColor: "text-signin",
  },
  mentioned: {
    text: "mentioned you",
    icon: faUserTag,
    iconColor: "text-user",
  },
  ALERT_NOTIFICATION: {
    text: "alert analysis for",
    icon: faEye,
    iconColor: "text-event",
  },
  UNORDERLY_DIARY_SUMMARY: {
    text: "",
    icon: faNoteSticky,
    iconColor: "text-filter",
  },
};

export const documentationLinks = [
  {
    section: "keyboard%20shortcuts",
    name: "Keyboard Shortcuts",
  },
  {
    section: "videos",
    name: "Videos",
  },
];

export const profileTabs = [
  "subscriptions",
  "watch list",
  "edit profile",
  // "settings",
];

export const documentationTabs = ["keyboard shortcuts", "videos"];
export const gettingStartedPointers = [
  {
    short: "alerts",
    name: "Important alerts",
  },
  {
    short: "investigations",
    name: "Key investigations",
  },
  {
    short: "changes",
    name: "Changes in the past day",
  },
  {
    short: "findings",
    name: "Key Summary findings",
  },
  {
    short: "attention",
    name: "Needs attention",
  },
  {
    short: "contrafactuals",
    name: "Contrafactuals",
  },
];

export const accordionColors = {
  high: ["h-3 dark:bg-high-bright", "h-20 dark:bg-high-middle"],
  medium: ["h-3 dark:bg-high-middle", "h-16 dark:bg-regular-middle"],
  low: ["h-3 dark:bg-regular-middle", "h-10 dark:bg-low-middle"],
  no: ["h-2 dark:bg-low-middle", "h-6 dark:bg-none"],
};

export const integrationTypes = ["AWS", "GCP"];

export const slaBGColors = {
  "90+ days": "bg-critical",
  "31-90 days": "bg-high",
  "16-30 days": "bg-medium",
  "8-15 days": "bg-low",
  "3-7 days": "bg-informational",
  "0-2 days": "bg-filter",
};

export const datePickerTimes = [
  {
    name: "Last 4 hours",
    value: 14400000,
    number: 4,
    unit: "hours",
  },
  {
    name: "Last 24 hours",
    value: 86400000,
    number: 24,
    unit: "hours",
  },
  {
    name: "Last 3 days",
    value: 2.592e8,
    number: 3,
    unit: "days",
  },
  {
    name: "Last 7 days",
    value: 604800000,
    number: 7,
    unit: "days",
  },
];

export const quickSelect = {
  hour: 3600000,
  hours: 3600000,
  days: 86400000,
  months: 2.628e9,
};
