import { useQuery, useMutation } from "react-query";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion } from "src/constants/general";
import { NewDiary } from "src/types/investigation";

const prefix = "investigation/templates";

// get a list of investigation diary templates
export const GetInvestigationTemplates = (env: string) =>
  useQuery<any, unknown, any, (string | boolean | (string | null)[] | null)[]>(
    ["get-investigation-templates", env],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}?env_id=${env}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: env !== "", keepPreviousData: true }
  );

// get a list of evidence (ie. search queries) in a diary template
export const GetInvestigationTemplateEvidence = (
  env: string,
  templateID: string
) =>
  useQuery<any, unknown, any, (string | (string | null)[] | null)[]>(
    ["get-investigation-template-evidence", env, templateID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/investigation/evidence-for-template?env_id=${env}&template_id=${templateID}`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: env !== "" && templateID !== "",
      keepPreviousData: true,
    }
  );

// create a template from an existing diary
export const CreateTemplate = (
  env: string,
  diaryID: string | (string | null)[] | null
) =>
  useMutation<any, unknown, any, (string | (string | null)[] | null)[]>(
    async ({ diary, signal }: { diary: NewDiary; signal: AbortSignal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}?env_id=${env}&diary_id=${diaryID}`,
          diary,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );
