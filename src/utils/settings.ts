import { UseMutationResult } from "react-query";
import { Credentials } from "../types/settings";

// handles upload credentials on a new/existing account
export const handleUploadCredentials = (
  selectedAccountID: string,
  uploadCredentials: UseMutationResult<any, unknown, any, string[]>,
  createAccount: {
    mutate: (
      arg0: { account: { integration_type: string } },
      arg1: { onSuccess: (data: { id: string }) => void }
    ) => void;
  },
  updateAccount: {
    mutate: (arg0: {
      accountID: string;
      account: { customer_envs: string[]; integration_tags: string[] };
    }) => void;
  },
  credentials: Credentials,
  envIDs: string[],
  tags: string[],
  integrationType: string | (string | null)[] | null,
  customerCloudID?: string
) => {
  if (selectedAccountID !== "")
    uploadCredentials.mutate({
      accountID: selectedAccountID,
      credentials: credentials,
    });
  else
    createAccount.mutate(
      {
        account: {
          ...(customerCloudID && { customer_cloud_id: customerCloudID }),
          integration_type: String(integrationType),
        },
      },
      {
        onSuccess: (data) => {
          updateAccount.mutate({
            accountID: data?.id,
            account: {
              customer_envs: envIDs,
              integration_tags: tags,
            },
          });
          uploadCredentials.mutate({
            accountID: data?.id,
            credentials: credentials,
          });
        },
      }
    );
};
