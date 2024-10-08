export const auditAssessmentTabs = ["internal audit", "questionnaire"];

export const businessContinuityTabs = [
  "standard operating procedures",
  "business impact analysis",
];

export const riskComplianceTabs = [
  "overview",
  "frameworks",
  "circulars",
  "policies",
];

export const riskIntelligenceTabs = [
  "regulatory updates",
  "enforcement actions",
];

export const thirdPartyRiskTabs = [
  "vendors and partners",
  "vendor assessment",
  "privacy review",
];

export const targetDoc = {
  document_path: "",
  document_id: "",
};

export const documentColors = {
  0: "from-[#E81484] to-[#E81484]/60",
  1: "from-[#22B573] to-[#22B573]/60",
  2: "from-[#61AE25] to-[#61AE25]/60",
  3: "from-[#F7931E] to-[#F7931E]/60",
  4: "from-[#FF0000] to-[#FF0000]/60",
  5: "from-[#0065DE] to-[#0065DE]/60",
  6: "from-[#29ABE2] to-[#29ABE2]/60",
  7: "from-[#D044E3] to-[#D044E3]/60",
  8: "from-[#EF3D55] to-[#EF3D55]/60",
  9: "from-[#ACC244] to-[#ACC244]/60",
};

export const versionTimelineColors = [
  {
    text: "dark:text-note",
    bg: "dark:bg-note",
    ring: "dark:ring-note",
    border: "dark:border-note",
  },
  {
    text: "dark:text-event",
    bg: "dark:bg-event",
    ring: "dark:ring-event",
    border: "dark:border-event",
  },
  {
    text: "dark:text-reset",
    bg: "dark:bg-reset",
    ring: "dark:ring-reset",
    border: "dark:border-reset",
  },
  {
    text: "dark:text-purple-500",
    bg: "dark:bg-purple-500",
    ring: "dark:ring-purple-500",
    border: "dark:border-purple-500",
  },
  {
    text: "dark:text-no",
    bg: "dark:bg-no",
    ring: "dark:ring-no",
    border: "dark:border-no",
  },
];

export const driftColors = {
  insert: "bg-no/50 hover:bg-no/80 duration-100",
  delete: "bg-reset/50 hover:bg-reset/80 duration-100",
  replace: "bg-note/50 hover:bg-note/80 duration-100",
  equal: "bg-filter/50 hover:bg-filter/80 duration-100",
};

export const driftTooltipColors = {
  insert: "bg-no border border-no",
  delete: "bg-reset border border-reset",
  replace: "text-black bg-note border border-note",
  equal: "bg-filter border border-filter",
};

export const frameworkSortingTypes = ["framework_name", "regulatory_date"];

export const thirdPartySortingTypes = ["created_at"];

export const agreementContractReviewSortingTypes = [
  "agreement_name",
  "agreement_date",
];
