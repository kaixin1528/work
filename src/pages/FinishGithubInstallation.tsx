/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from "react-query";
import { parseURL } from "../utils/general";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FinishGithubInstallation = () => {
  const parsed = parseURL();

  const [installationStored, setInstallationStored] = useState<boolean>(false);
  const navigate = useNavigate();

  if (parsed.installation_id) {
    let installation_id = String(parsed.installation_id);
    let state = String(parsed.state);
    StoreGitHubAppInstallationId(installation_id, state, setInstallationStored);
  }

  return (
    <>
      <section>
        {!installationStored ? (
          <h1>Redirecting to GitHub App installation...</h1>
        ) : (
          navigate(
            "/settings/details?section=integrations&integration=GITHUB_APP"
          )
        )}
      </section>
    </>
  );
};

export const StoreGitHubAppInstallationId = (
  installation_id: string,
  state: string,
  setInstallationStored: any
) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["store-github-installation-id", installation_id, state],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/customers/finish_github_installation`,
          {
            installation_id: installation_id,
            state: state,
          },
          {
            signal,
          }
        );
        setInstallationStored(true);
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: installation_id !== "",
    }
  );

export default FinishGithubInstallation;
