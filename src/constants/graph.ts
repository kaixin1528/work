export const depthHeights = {
  0: 1000,
  1: 1000,
  2: 700,
  3: 300,
  4: 260,
  5: 220,
  6: 170,
  7: 130,
  8: 100,
  9: 65,
  10: 65,
  11: 65,
  12: 65,
  13: 65,
  14: 65,
  15: 65,
  16: 65,
  17: 65,
  18: 65,
  19: 65,
  20: 65,
  21: 65,
  22: 65,
  23: 65,
  24: 65,
  25: 65,
};

export const orgCloud = "Organization Cloud";
export const defaultDepth = 2;
export const nodeThreshold = 150;
export const initialDiffFilter = ["created", "modified", "removed"];

export const alertTimes = [
  {
    name: "Last 24 hours",
    value: 8.64e10,
  },
  {
    name: "Last 7 days",
    value: 6.048e11,
  },
  {
    name: "Last 30 days",
    value: 2.592e12,
  },
];

export const alertIcons = {
  misconfiguration: {
    name: "Misconfiguration",
    icon: "/graph/alerts/misconfiguration.svg",
    color: "border-[#F87415]",
  },
  authentication: {
    name: "Authentication",
    icon: "/graph/alerts/authentication.svg",
    color: "border-[#7993B0]",
  },
  create_event: {
    name: "Create",
    icon: "/graph/alerts/create.svg",
    color: "border-[#22B573]",
  },
  update_event: {
    name: "Update",
    icon: "/graph/alerts/update.svg",
    color: "border-[#7993B0]",
  },
  delete_event: {
    name: "Delete",
    icon: "/graph/alerts/delete.svg",
    color: "border-[#FCEE21]",
  },
  stop_event: {
    name: "Stop",
    icon: "/graph/alerts/stop.svg",
    color: "border-[#FF0000]",
  },
  scale_event: {
    name: "Scale",
    icon: "/graph/alerts/scale.svg",
    color: "border-[#29ABE2]",
  },
  configure_event: {
    name: "Configure",
    icon: "/graph/alerts/configure.svg",
    color: "border-[#FFFFFF]",
  },
  missing_control: {
    name: "Missing Control",
    icon: "/graph/alerts/missing-control.svg",
    color: "border-[#F87415]",
  },
  dependabot_alert: {
    name: "Dependabot Alert",
    icon: "/graph/alerts/dependabot-alert.svg",
    color: "border-[#F87415]",
  },
  workflow_run_state: {
    name: "Workflow Run State",
    icon: "/graph/alerts/workflow-run-state.svg",
    color: "border-[#F87415]",
  },
  db_snapshot_backup: {
    name: "DB Snapshot Backup",
    icon: "/graph/alerts/db-snapshot-backup.svg",
    color: "border-[#22B573]",
  },
  db_snapshot_availability: {
    name: "DB Snapshot Availability",
    icon: "/graph/alerts/db-snapshot-availability.svg",
    color: "border-[#FCEE21]",
  },
  db_snapshot_configuration_change: {
    name: "DB Snapshot Configuration Change",
    icon: "/graph/alerts/db-snapshot-configuration-change.svg",
    color: "border-[#F87415]",
  },
  db_snapshot_creation: {
    name: "DB Snapshot Creation",
    icon: "/graph/alerts/db-snapshot-creation.svg",
    color: "border-[#22B573]",
  },
  db_snapshot_restoration: {
    name: "DB Snapshot Restoration",
    icon: "/graph/alerts/db-snapshot-restoration.svg",
    color: "border-[#29ABE2]",
  },
  db_snapshot_deletion: {
    name: "DB Snapshot Deletion",
    icon: "/graph/alerts/db-snapshot-deletion.svg",
    color: "border-[#FCEE21]",
  },
  db_snapshot_read_replica: {
    name: "DB Snapshot Read Replica",
    icon: "/graph/alerts/db-snapshot-read-replica.svg",
    color: "border-[#F87415]",
  },
};

export const nodeTimelineColors = {
  removed: "text-removed",
  delete: "text-removed",
  created: "text-created",
  modified: "text-modified",
  update: "text-note",
};

export const diffColors = {
  removed: "#FF3131",
  delete: "#FF3131",
  created: "#00AC46",
  modified: "#FFFDD0",
  update: "#D0D104",
};

export const diffBorderColors = {
  removed: "border-l-4 border-removed",
  created: "border-l-4 border-created",
  modified: "border-l-4 border-modified",
};

export const diffBGColors = {
  removed: "bg-removed",
  created: "bg-created",
  modified: "bg-modified",
  none: "bg-checkbox",
};

export const diffGradientColors = {
  removed: "bg-removed/60 hover:bg-removed/30 duration-100",
  created: "bg-created/60 hover:bg-created/30 duration-100",
  modified: "text-black bg-modified/60 hover:bg-modified/30 duration-100",
};

export const diffTextColors = {
  removed: "text-removed hover:text-signin/70",
  created: "text-created hover:text-signin/70",
  modified: "text-modified hover:text-signin/70",
};

export const annotationTextColors = {
  critical: "text-high hover:text-signin/70 duration-100",
  high: "text-medium hover:text-signin/70 duration-100",
};

export const annotationBGColors = {
  critical: "bg-high",
  high: "bg-medium",
};

export const annotationElementColors = {
  critical: "#DC0000",
  high: "#FD8C00",
};

export const searchedNodesColors = {
  source: "text-contact border-checkbox dark:hover:text-signin/70 duration-100",
  qualifying: "text-yellow-500 dark:hover:text-signin/70 duration-100",
};

export const initialContextMenu = {
  id: "",
  integrationType: "",
  nodeType: "",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export const infoTabs = ["Resource Details", "Key Insights"];

export const timelineTabs = [
  {
    short: "diff",
    name: "Config & State Change",
  },
  {
    short: "audit",
    name: "Audit",
  },
];

export const initialMatch = {
  match1Name: "",
  match1Value: "",
  relName: "",
  relValue: "",
  match2Name: "",
  match2Value: "",
};

export const newCondition = {
  match: "",
  propertyName: "",
  propertyOperator: "",
  propertyValue: "",
};

export const conditionKeyMapping = {
  match: "match",
  propertyName: "property_name",
  propertyOperator: "property_operator",
  propertyValue: "property_value",
};

export const cypherReturnTypes = ["table", "graph", "metadata"];

export const cypherMatch1Params = [
  "type",
  "id",
  "resource_status",
  "annotation",
  "extension",
];
