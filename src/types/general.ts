export interface GeneralStore {
  openSidebar: boolean;
  setOpenSidebar: (openSidebar: boolean) => void;
  error: KeyStringVal;
  setError: (error: KeyStringVal) => void;
  env: string;
  setEnv: (env: string) => void;
  spotlightSearchString: string;
  setSpotlightSearchString: (spotlightSearchString: string) => void;
}

export interface Notification {
  notification_id: string;
  time: number;
  type: string;
  description: string;
  initiator: string;
  state: string;
  meta: {
    comment_id: string;
    graph_element_id: string;
    graph_artifact_id: string;
    graph_element_type: string;
    integration_type: string;
    resource_type: string;
    severity?: string;
    event_cluster_id: string;
    diary_id: string;
    evidence_id: string;
    note_id: string;
    sender_user_email: string;
  };
}

export interface Filter {
  field: string;
  op: string;
  value: string | number;
  type: string;
  set_op: string;
}

export interface jwtToken {
  sub: string;
  name: string;
  fullName: string;
  defaultEnvTypeID: string;
  defaultEnvType: string;
  iat: number;
  scope: {
    customer: string;
    customer_id: string;
    auth_scheme: string;
    auth_provider: string;
    groups: {
      group_id: string;
      group_name: string;
    }[];
    roles: {
      name: string;
      id: string;
      role_type: string;
    }[];
  };
  exp: number;
  twofa_needed: boolean;
  twofa_secret_is_set: boolean;
  twofa_is_setup: boolean;
}

export interface Role {
  name: string;
  id: string;
  role_type: string;
}

export interface AddSubscription {
  artifact_type: string;
  artifact_category: string;
  artifact_name: string;
  subscription_frequency: string;
  distribution_option_id: string;
}

export interface Subscription {
  artifact_type: string;
  artifact_category: string;
  artifact_name: string;
  subscription_frequency: string;
}

export interface CreateDistributionOption {
  delivery_destination_type: string;
  destination_user_handle: string;
}

export interface DistributionOption {
  customer_id: string;
  user_id: string;
  distribution_option_id: string;
  delivery_destination_type: string;
  destination_user_handle: string;
}

export interface AddFavorite {
  artifact_type: string;
  artifact_category: string;
  artifact_name: string;
  is_favorite: boolean;
  metadata?: string;
}
export interface Favorite {
  artifact_type: string;
  artifact_category: string;
  artifact_name: string;
  is_favorite: boolean;
  creation_timestamp_musec_since_epoch: number;
  metadata?: string;
}

export interface Publication {
  artifact_type: string;
  artifact_category: string;
  artifact_name: string;
  artifact_id: string;
  content_format: string;
  metadata: {
    title: string;
    summary: string;
    tags: string;
    description: string;
    frequency: string;
  };
  path_to_content_template: string;
}

export interface AutocompleteMetadata {
  [key: string]: {
    cloud: string[];
    name: string[];
    uno_class: string;
  };
}

export interface LoginInfo {
  mfa: {
    twofa_needed: boolean;
    twofa_secret_set: boolean;
    twofa_verified: boolean;
  };
  token: {
    access_token: string;
    token_type: string;
  };
  customer: {
    customer_id: string;
    customer_alias: string;
  };
  profile: {
    email: string;
  };
}

export interface SortRows {
  order: string;
  orderBy: string;
}

export interface GraphNode {
  id: string;
  type?: string;
  integrationType?: string;
  sourceAccountID?: string;
  nodeType?: string;
  nodeTypeName?: string;
  data?: GraphNodeData;
  parentNodeType?: string;
  position?: { x: number; y: number };
}

export interface GraphNodeData {
  id: string;
  type?: string;
  integrationID?: string;
  sourceAccountID?: string;
  integrationType?: string;
  nodeTypeName?: string;
  nodeType?: string;
  isHorizontal?: boolean;
  isSearched?: string;
  diffNode?: any;
  uniqueID?: string;
  attributes?: any;
  hasEvents?: boolean;
  hasComments?: boolean;
  graphAnnotation?: KeyStringVal;
  simulationAnnotation?: KeyStringVal;
  impacted?: boolean;
  level?: number;
  name?: string;
  properties?: KeyStringArrayVal;
  isEgress?: boolean;
  graphHasIngress?: boolean;
  searchHasIngress?: boolean;
  searchHasEgress?: boolean;
}

export interface GraphEdge {
  id: string;
  integrationType?: string;
  type?: string;
  source?: string;
  target?: string;
  animated?: boolean;
  data?: {
    id: string;
    integrationType?: string;
    source?: string;
    target?: string;
    attributes?: KeyStringVal;
    properties?: KeyStringArrayVal;
    hasComments?: boolean;
    isEgress?: boolean;
    diffEdge?: any;
    graphAnnotation?: KeyStringVal;
    simulationAnnotation?: KeyStringVal;
    impacted?: boolean;
  };
}

export interface GraphInfo {
  root: string;
  depth: number;
  showOnlyAgg: boolean;
  showPanel: boolean;
}

export interface GraphNodeAttribute {
  value: string | number | unknown;
  data_type: string;
  property_name: string;
  display_name: string;
  short_desc?: string;
  long_desc?: string;
  property_type?: string;
}

export interface AlertItem {
  event_cluster_id: string;
  count: number;
  alert_info: {
    impact: string;
    category: string;
    findings: string;
    severity: string;
    GRC: {
      requirements: string[];
    };
    references: string[];
    description: string;
    remediation: string;
    exploitability: any;
    additional_information: any;
  };
}

export interface ListHeader {
  display_name: string;
  property_name: string;
  data_type?: string;
}

export interface FilterPagination {
  filters: Filter[];
  pager: {
    page_number: number;
    page_size: number;
  };
}

export interface KeyStringVal {
  [key: string]: string;
}

export interface KeyStringArrayVal {
  [key: string]: string[];
}

export interface KeyNumVal {
  [key: string]: number;
}

export interface KeyNumArrayVal {
  [key: string]: number[];
}

export interface KeyAllVal {
  [key: string]: string | number | string[];
}
