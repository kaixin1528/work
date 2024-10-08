import { KeyStringArrayVal } from "./general";

export interface Inventory {
  category: string;
  type: string;
  count: number;
}

export interface ChartData {
  [key: string]: number;
}

export interface MetricCategory {
  category: string;
  members: MetricType[];
  metadata: any;
}

export interface MetricType {
  metric_name: string;
  metric_uom: {
    name: string;
    family: string;
    plural: string;
    short_name: string;
    scale_factor: number;
  };
  timestamp_uom: {
    name: string;
    family: string;
    plural: string;
    short_name: string;
    scale_factor: number;
  };
}

export interface PatternInfo {
  spike_test: SpikeTest[];
  level_test: LevelTest[];
}
export interface SpikeTest {
  timestamp: number;
  pattern_value: number;
  metric_value: number;
  windowed: boolean;
  window_start: number;
  window_end: number;
  tags: any;
  context: any;
  metadata_info: any;
}
export interface LevelTest {
  timestamp: number;
  pattern_value: number;
  metric_value: number;
  windowed: boolean;
  window_start: number;
  window_end: number;
  tags: any;
  context: any;
  metadata_info: any;
}
export interface Events {
  OUT_OF_MEMORY_EVENT: Event[];
  DELETE_EVENT: Event[];
}
export interface Event {
  event_time: number;
  context: { logs: string };
}
export interface Finding {
  uri: string;
  cve_name: string;
  severity: string;
  description: string | null;
  attributes: {
    Key: string;
    Value: string;
  }[];
}
export interface Region {
  graph_artifact_id: string;
  score: number;
  activity_level: string;
}
export interface OriginalFirewallNode {
  node_id: string;
  node_type: string;
  node_name: string;
  integration_type: string;
  timestamp: number;
  firewall_rules: KeyStringArrayVal;
  firewall_ids: number[];
  is_egress: boolean;
  edge_ids: string[];
  properties: KeyStringArrayVal;
  customer_id: string;
  env_type: string;
  customer_cloud_id: string;
}

export interface Sort {
  order: string;
  orderBy: string;
}
export interface AffectedRepo {
  name: string;
  images: string[];
  active_container: boolean;
}
export interface AffectedImage {
  image_tag: string;
  image_sha: string;
  active_container: boolean;
}
export interface ImageTagTimetamps {
  [key: number]: string;
}

export interface VulnerabilitySpan {
  description: string;
  earliest_scan_time: number;
  id: number;
  images_alternative_dict: ImageTagTimetamps;
  latest_scan_time: number;
  name: string;
  severity: string;
  uri: string;
}
export interface CVEInfo {
  containers: {
    [key: string]: string[];
  };
  cve: {
    affected_repositories: AffectedRepo[];
    cve_name: string;
    cvss_score: string;
    cvss_vector: string;
    description: string;
    package_name: string;
    package_version: string;
    uri: string;
  };
  first_observed: number;
  live_services: number;
  total_images: number;
  unaddressed_for: number;
}

export interface EffectiveIPType {
  is_egress: boolean;
  properties: {
    [key: string]: string[];
  };
}

export interface PortProtocolType {
  is_egress: boolean;
  properties: {
    [key: string]: string[];
  };
}

export interface RegionAttribute {
  data_type: string;
  display_name: string;
  include_in_diff: string;
  property_name: string;
  value: string;
}

export interface RegionDetail {
  node_id: string;
  key_info: {
    [key: string]: RegionAttribute;
  };
}

export interface RegionAttributes {
  [key: string]: RegionAttribute;
}

export interface InfraNodeSummary {
  category: string;
  type: string;
  vendor: string;
  count: number;
}

export interface RepoImage {
  sha: string;
  tag: string;
  pushed_at: number;
}
