import { SearchResult } from "./graph";

export interface InvestigationStore {
  showEvidencePanel: boolean;
  setShowEvidencePanel: (showEvidencePanel: boolean) => void;
  selectedEvidencePanelTab: string;
  setSelectedEvidencePanelTab: (selectedEvidencePanelTab: string) => void;
  selectedEvidenceID: string;
  setSelectedEvidenceID: (selectedEvidenceID: string) => void;
}

export interface NewDiary {
  name: string;
  description: string;
  is_private: boolean;
  image_url: string;
  priority?: string;
}

export interface EditDiary {
  diary_id: string | (string | null)[] | null;
  name: string;
  description: string;
  status: string;
  archived: boolean;
  is_private: boolean;
}

export interface Collaborators {
  diary_id: string | (string | null)[] | null;
  emails_of_collaborators: string[];
}

export interface SearchQueryLog {
  query_input: string;
  query_start_time: number;
  query_end_time: number;
  results: any;
  ran_at: number;
}

export interface UpdateEvidence {
  evidence_id: string;
  evidence_type: string;
  title: string;
  annotation: string;
}

export interface Comment {
  evidence_id: string;
  parent_comment_id: string | null;
  author_email: string;
  body: string;
  tagged_users: string[];
}

export interface Note {
  parent_id: string;
  author_email: string;
  content: string;
}

export interface Tag {
  tag_name: string;
}

export interface DiaryTag {
  diary_id: string;
  tag_id: string;
}

export interface EditComment {
  comment_id: string;
  comment_body: string;
  tagged_users: string[];
}

export interface EditNote {
  note_id: string;
  note_content: string;
}
export interface QueryEvidence {
  query_string: string;
  results: SearchResult;
  annotation_set: string;
  annotation: string;
  diary_id: string;
  author: string;
  query_start_time: number;
  query_end_time: number;
  title: string;
  evidence_type: string;
}

export interface DiaryType {
  owner: string;
  diary_id: string;
  created_at: number;
  status: string;
  priority: string;
  customer_cloud_id: string;
  name: string;
  description: string;
  last_updated_at: number;
  is_private: boolean;
  customer_id: string;
  env_type: string;
  image_url: string;
}

export interface RecentQuery {
  query_input: string;
  query_start_time: number;
  query_end_time: number;
  ran_by: string;
  customer_id: string;
  env_type: string;
  results: SearchResult;
  query_log_id: string;
  ran_at: number;
  customer_cloud_id: string;
  search_type: string;
}

export interface QueryType {
  query_string: string;
  evidence_id: string;
  query_end_time: number;
  results: any;
  annotation: string;
  last_updated_at: number;
  search_type: string;
  customer_cloud_id: string;
  author: string;
  title: string;
  query_start_time: number;
  annotation_set: string;
  created_at: number;
  diary_id: string;
  customer_id: string;
  env_type: string;
}

export interface GeneralEvidenceType {
  query_string: string;
  query_start_time: number;
  query_end_time: number;
  evidence_type: string;
  evidence_id?: string;
  results?: any;
  annotation?: string;
  last_updated_at?: number;
  customer_cloud_id?: string;
  author?: string;
  title?: string;
  annotation_set?: string;
  created_at?: number;
  diary_id?: string;
  customer_id?: string;
  env_type?: string;
  note?: string;
  graph_artifact_id?: string;
  event_cluster_id?: string;
  severity?: string;
  description?: string;
}

export interface EvidenceType {
  evidence: {
    query_string: string;
    evidence_id: string;
    query_end_time: number;
    results: any;
    annotation: string;
    last_updated_at: number;
    evidence_type: string;
    customer_cloud_id: string;
    author: string;
    title: string;
    query_start_time: number;
    annotation_set: string;
    created_at: number;
    diary_id: string;
    customer_id: string;
    env_type: string;
  };
  num_of_comments: number;
  num_of_notes: number;
}

export interface AllTag {
  diary_id: string;
  tag_name: string;
  created_at: number;
  customer_cloud_id: string;
  env_type: string;
  tag_id: string;
  created_by: string;
  customer_id: string;
}

export interface DiaryTag {
  diary_id: string;
  tag_name: string;
  created_at: number;
  customer_cloud_id: string;
  env_type: string;
  tag_id: string;
  customer_id: string;
}
export interface Collaborator {
  referenced_user_email: string;
  referenced_user_name: string;
}

export interface NoteType {
  created_at: number;
  evidence_id: string;
  author_email: string;
  last_updated_at: number;
  customer_cloud_id: string;
  note_id: string;
  content: string;
  customer_id: string;
  env_type: string;
}

export interface CommentType {
  comment_id: string;
  parent_comment_id: string | null;
  body: string;
  last_updated_at: number;
  customer_cloud_id: string;
  author_email: string;
  evidence_id: string;
  created_at: number;
  customer_id: string;
  env_type: string;
}

export interface FilterDiaries {
  diaries: DiaryType[];
  search_queries: GeneralEvidenceType[];
  comments: CommentType[];
  notes: NoteType[];
}

export interface InvestigationTemplate {
  description: string;
  template_id: string;
  created_at: number;
  image_url: string;
  is_private: boolean;
  archived: boolean;
  customer_cloud_id: string;
  name: string;
  last_updated_at: number;
  status: string;
  priority: string;
  customer_id: string;
  env_type: string;
}

export interface TemplateEvidenceType {
  evidence_id: string;
  title: string;
  query_start_time: number;
  query_end_time: number;
  annotation_set: any;
  evidence_type: string;
  customer_cloud_id: string;
  template_id: string;
  query_string: string;
  results: any;
  annotation: string;
  customer_id: string;
  env_type: string;
}
