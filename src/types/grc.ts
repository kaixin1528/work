import { KeyStringVal } from "./general";

export interface GRCStore {
  GRCCategory: string;
  setGRCCategory: (GRCCategory: string) => void;
  selectedMappingNode: any;
  setSelectedMappingNode: (selectedNode: any) => void;
  GRCQuery: string;
  setGRCQuery: (GRCQuery: string) => void;
  GRCQueryOption: string;
  setGRCQueryOption: (GRCQueryOption: string) => void;
  GRCQuestionIDNotif: string;
  setGRCQuestionIDNotif: (GRCQuestionIDNotif: string) => void;
  selectedGRCAssessment: KeyStringVal;
  setSelectedGRCAssessment: (selectedGRCAssessment: KeyStringVal) => void;
  selectedGRCQuestionBank: KeyStringVal;
  setSelectedGRCQuestionBank: (selectedGRCQuestionBank: KeyStringVal) => void;
  selectedAnchorID: string;
  setSelectedAnchorID: (selectedAnchorID: string) => void;
  showGRCPanel: boolean;
  setShowGRCPanel: (showGRCPanel: boolean) => void;
  selectedGRCPanelTab: string;
  setSelectedGRCPanelTab: (selectedGRCPanelTab: string) => void;
}
export interface MappingNodeData {
  id: string;
  type: string;
  documentType: string;
  document_id?: string;
  document_name?: string;
  documentColor?: number;
  mapping_id?: string;
  generated_id?: string;
  section_type?: string;
  framework_id?: string;
  policy_id?: string;
  thumbnail_uri?: string;
  center: boolean;
  ip_score?: string;
  user_email?: string;
  content?: string;
  section_title?: string;
  sub_section_id?: string;
  policy_type?: string;
  framework_regulatory_authority?: string;
  sub_section_title?: string;
  document_type?: string;
  extracted_tags?: string[];
  secondary_tags?: string[];
}
