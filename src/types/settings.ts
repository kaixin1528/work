export interface CustomerInput {
  customer_name: string;
  customer_alias: string;
  address: string;
  auth_scheme: string;
  auth_provider: string;
  domain: string;
  site_admin: boolean;
}

export interface Customer {
  customer_id: string;
  customer_alias: string;
  customer_name: string;
  address: string | null;
  last_updated: string | null;
  who_updated: string | null;
  contacts: Contact[];
  auth_scheme: string;
  auth_provider: string;
  domain: string | null;
  has_site_admin: boolean;
  current_user_customer: boolean;
}

export interface Contact {
  contact_id: string;
  contact_type: string;
  name: string;
  email: string;
  phone_number: string;
}
export interface ContactInput {
  contact_type: string;
  name: string;
  email: string;
  phone_number: string;
}
export interface GroupInput {
  group_name?: string;
  group_description?: string;
  user_ids?: string[];
}

export interface Account {
  customer_cloud_id?: string | null;
  integration_type: string;
  integration_id?: string;
  integration_status?: string | null;
  customer_id?: string;
  integration_tags?: string[];
  current_state?: number;
  source_account_id?: string | null;
}

export interface CustomerEnv {
  env_id: string;
  env_type: string;
}

export interface CustomerEnvInput {
  env_type: string;
}

export interface AccountInput {
  customer_cloud_id?: string;
  integration_type: string;
  integration_status?: string;
}

export interface UpdateAccountInput {
  customer_envs?: string[];
  integration_tags?: string[];
  current_state?: number;
}

export interface Group {
  group_id: string;
  group_name: string;
  group_description: string;
  created_at: number;
  updated_at: string | null;
  customer_id: string;
  users_count: number;
}

export interface UserGroup {
  group_id: string;
  group_name: string;
}

export interface UserRole {
  role_id: string;
  role_type: string;
  role_name: string;
}
export interface User {
  customer_id: string;
  default_env: string;
  user_id: string;
  user_name: string;
  user_given_name: string;
  user_family_name: string;
  user_email: string;
  oidc_account_id: string | null;
  last_login: number;
  failure_count: number;
  activated: boolean;
  groups: UserGroup[];
  roles: UserRole[];
  is_oidc: boolean;
}
export interface UserInput {
  user_email?: string;
  user_given_name?: string;
  user_family_name?: string;
  oidc_account_id?: string;
  group_ids?: string[];
  role_ids?: string[];
  action: string;
}

export interface UserDetails {
  user_name: string;
  user_email?: string;
  user_given_name?: string;
  user_family_name?: string;
  oidc_account_id?: string;
  default_env: string;
  group_ids: string[];
  role_ids: string[];
}

export interface Role {
  customer_id: string;
  role_id: string;
  role_type: string;
  role_name: string;
}

export interface jwtRole {
  name: string;
  id: string;
  role_type: string;
}

export interface RoleInput {
  role_name: string;
  role_type: string;
}

export interface Credentials {
  [key: string]: string | any;
}

export interface TempEmail {
  email: string;
  base_url: string;
  expiration_time_in_mins: number;
  user_id: string;
}

export interface NewPassword {
  user_email: string;
  temp_password: string;
  new_password: string;
}

export interface SelectedTags {
  [key: string]: string[];
}
export interface AvailableIntegration {
  category: string;
  integration_type: string;
  integration_provider: string;
  description: string;
  enabled_at: number;
  current_state: number;
}
