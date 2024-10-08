import { Account } from "./settings";

export interface SummaryStore {
  period: number;
  setPeriod: (period: number) => void;
  selectedReportAccount: Account | undefined;
  setSelectedReportAccount: (
    selectedReportAccount: Account | undefined
  ) => void;
  selectedVRSeverity: string;
  setSelectedVRSeverity: (selectedVRSeverity: string) => void;
  selectedVRCVE: string;
  setSelectedVRCVE: (selectedVRCVE: string) => void;
  selectedVRIntegrationType: string;
  setSelectedVRIntegrationType: (selectedVRIntegrationType: string) => void;
  selectedVRPage: number;
  setSelectedVRPage: (selectedVRPage: number) => void;
  selectedDSNav: string;
  setSelectedDSNav: (selectedDSNav: string) => void;
  selectedDSResourceType: string;
  setSelectedDSResourceType: (selectedDSResourceType: string) => void;
  selectedDSResourceID: string;
  setSelectedDSResourceID: (selectedDSResourceID: string) => void;
  selectedCSAction: string;
  setSelectedCSAction: (selectedCSAction: string) => void;
  selectedCSNodeType: string;
  setSelectedCSNodeType: (selectedCSNodeType: string) => void;
  selectedCSNodeID: string;
  setSelectedCSNodeID: (selectedCSNodeID: string) => void;
}
export interface CVEInfo {
  cve_id: string;
  cve_name: string;
  score: number;
  cvssscore: number;
  package_type: string;
  fix_available: boolean;
  pacakage_issue: PackageIssue[];
  weighted_score: number;
}

export interface PackageIssue {
  generated_id: string;
  cpe_vulnerable: boolean;
  cpe_version_start_including: string;
  cpe_match_criteria_id: string;
  record_time: number;
  id: string;
  cpe_criteria: string;
  cpe_version_end_excluding: string;
}

export interface DevWorkflowRepo {
  branch_count: number;
  commit_count: number;
  committer_info: number;
  org_name: string;
  release_count: number;
  repo_name: string;
  repo_name_with_org: string;
  tag_count: number;
  workflow_runs: number;
}

export interface DevWorkflowWFRunImage {
  workflowrun_id: number;
  workflowrun_name: string;
  workflowrun_nodeid: string;
  workflowrun_headbranch: string;
  workflowrun_conclusion: string;
  workflowrun_url: string;
  image_digest: string;
  image_pushed_at: number;
  image_tag: string;
}

export interface DevWorkflowContainer {
  container_node_id: string;
  container_name: string;
  container_id: string;
  svc_image: string;
}

export interface OpenResource {
  customer_cloud_id: string;
  firewalls: {
    [key: string]: {
      ports: {
        [key: string]: {
          ipv4: string[];
          ipv6: string[];
        };
      };
    };
  };
  resource_class: string;
  resource_id: string;
}

export interface DiffNode {
  node_id: string;
  old_state: any;
  node_class: string;
  customer_cloud_id: string;
  integration_type: string;
  action: string;
  new_record_time: number;
  old_record_time: number;
  new_state: any;
  customer_id: string;
  env_type: string;
  unique_id: string;
}
