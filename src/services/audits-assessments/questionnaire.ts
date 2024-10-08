import { useMutation, useQuery } from "react-query";
import { queryClient } from "src/App";
import { client } from "src/components/General/AxiosInterceptor";
import { apiVersion, pageSize } from "src/constants/general";

const prefix = `grc/assessments`;

export const GetAssessmentList = (
  pageNumber: number,
  tags: string[],
  sourceType: string
) =>
  useQuery<any, unknown, any, (string | number | string[])[]>(
    ["get-assessment-list", pageNumber, tags, sourceType],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}`,
          {
            pager: {
              page_number: pageNumber,
              page_size: pageSize,
            },
            tags: tags,
            source_type: sourceType,
          },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      keepPreviousData: false,
    }
  );

export const AddAssessment = () =>
  useMutation<any, unknown, any, string>(
    async ({
      name,
      requestingParty,
      dueDate,
      owner,
      reviewer,
      questionnaires,
      tags,
      sourceType,
      signal,
    }: {
      name: string;
      requestingParty: string;
      dueDate: number;
      owner: string;
      reviewer: string;
      questionnaires: string[];
      tags: string[];
      sourceType: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/new`,
          {
            name: name,
            requesting_party: requestingParty,
            due_date: dueDate,
            owner: owner,
            reviewer: reviewer,
            questionnaires: questionnaires,
            tags: tags,
            source_type: sourceType,
          },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-assessment-list"]);
      },
    }
  );

export const UpdateAssessment = () =>
  useMutation<any, unknown, any, string>(
    async ({
      assessmentID,
      name,
      requestingParty,
      dueDate,
      tags,
      owner,
      reviewer,
      sourceType,
      signal,
    }: {
      assessmentID: string;
      name: string;
      requestingParty: string;
      dueDate: number;
      tags: string[];
      owner: string;
      reviewer: string;
      sourceType: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/${prefix}/${assessmentID}`,
          {
            name: name,
            requesting_party: requestingParty,
            due_date: dueDate,
            tags: tags,
            owner: owner,
            reviewer: reviewer,
            source_type: sourceType,
          },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-assessment-list"]);
      },
    }
  );

export const RemoveAssessment = () =>
  useMutation<any, unknown, any, string>(
    async ({
      assessmentID,
      signal,
    }: {
      assessmentID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/${assessmentID}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-assessment-list"]);
      },
    }
  );

export const GetGlobalQuestionnaires = () =>
  useQuery<any, unknown, any, (string | number | undefined)[]>(
    ["get-global-questionnaires"],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/global_questionnaires`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const GetGlobalQuestionnaireQuestions = (questionnaireID: string) =>
  useQuery<any, unknown, any, (string | number | undefined)[]>(
    ["get-global-questionnaires", questionnaireID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/global_questionnaire_questions/${questionnaireID}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: questionnaireID !== "",
    }
  );

export const GetAssessmentQuestionnaires = (assessmentID: string) =>
  useQuery<any, unknown, any, (string | number | undefined)[]>(
    ["get-assessment-questionnaires", assessmentID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/grc/questionnaires/${assessmentID}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const SelectPredefinedQuestionnaires = (assessmentID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      questionnaireIDs,
      signal,
    }: {
      questionnaireIDs: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/grc/questionnaires`,
          questionnaireIDs,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-drafts", assessmentID]);
        queryClient.invalidateQueries([
          "get-assessment-questionnaires",
          assessmentID,
        ]);
      },
    }
  );

export const SubmitQuestionnaire = (assessmentID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      formData,
      signal,
    }: {
      formData: FormData;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${assessmentID}/drafts/new`,
          formData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-drafts", assessmentID]);
      },
    }
  );

export const UseQuestionBanks = () =>
  useMutation<any, unknown, any, string>(
    async ({
      questionBankIDs,
      signal,
    }: {
      questionBankIDs: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/config`,
          { QUESTION_BANK: questionBankIDs },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-drafts"]);
      },
    }
  );

export const GetQuestionBanks = (pageNumber: number) =>
  useQuery<any, unknown, any, (string | number | undefined)[]>(
    ["get-question-banks", pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/question-banks/all`,
          { page_size: pageSize, page_number: pageNumber },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

export const GetQuestionBankQuestions = (
  questionBankID: string,
  pageNumber: number
) =>
  useQuery<any, unknown, any, (string | number | undefined)[]>(
    ["get-question-bank-questions", questionBankID, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/question-banks/${questionBankID}/questions`,
          { page_size: pageSize, page_number: pageNumber },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: questionBankID !== "" }
  );

export const SubmitQuestionBank = () =>
  useMutation<any, unknown, any, string>(
    async ({
      formData,
      signal,
    }: {
      formData: FormData;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/question-banks/new`,
          formData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-drafts"]);
      },
    }
  );

export const RemoveQuestionBank = () =>
  useMutation<any, unknown, any, string>(
    async ({
      questionBankID,
      signal,
    }: {
      questionBankID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/question-banks/${questionBankID}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-question-banks"]);
      },
    }
  );

export const AddQAPair = () =>
  useMutation<any, unknown, any, string>(
    async ({
      questionBankID,
      question,
      answer,
      signal,
    }: {
      questionBankID: string;
      question: string;
      answer: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/question-banks/${questionBankID}/questions/add`,
          { to_add: [{ question: question, answer: answer }] },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-question-bank-questions"]);
      },
    }
  );

export const EditQAPair = (questionBankID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      questionID,
      newQuestion,
      newResponse,
      signal,
    }: {
      questionID: string;
      newQuestion: string;
      newResponse: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/${prefix}/question-banks/${questionBankID}/questions/${questionID}`,
          { new_question: newQuestion, new_response: newResponse },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-question-bank-questions"]);
      },
    }
  );

export const RemoveQAPair = (questionBankID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      questionID,
      signal,
    }: {
      questionID: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.delete(
          `/api/${apiVersion}/${prefix}/question-banks/${questionBankID}/questions/${questionID}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-question-bank-questions"]);
      },
    }
  );

export const MarkDraftAsComplete = (assessmentID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      draftID,
      questions,
      signal,
    }: {
      draftID: string;
      questions: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${assessmentID}/drafts/${draftID}`,
          {
            questions: questions,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-drafts", assessmentID]);
      },
    }
  );

export const SubmitQuestion = (assessmentID: string, sourceType: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      questions,
      signal,
    }: {
      questions: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${assessmentID}/question`,
          {
            questions: questions,
            source_type: sourceType,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-drafts", assessmentID]);
        queryClient.invalidateQueries(["get-qna-list"]);
      },
    }
  );

export const GetDrafts = (assessmentID: string) =>
  useQuery<any, unknown, any, (string | (string | null)[])[]>(
    ["get-drafts", assessmentID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${assessmentID}/drafts`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      keepPreviousData: false,
      refetchInterval: 60000,
    }
  );

export const GetDraftStatus = (assessmentID: string, draftID: string) =>
  useQuery<any, unknown, any, (string | (string | null)[])[]>(
    ["get-draft-status", assessmentID, draftID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${assessmentID}/drafts/${draftID}/status`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: assessmentID !== "" && !["1", "2"].includes(draftID),
      keepPreviousData: false,
      refetchInterval: 60000,
    }
  );

export const GetQnAList = (
  assessmentID: string,
  pageNumber: number,
  query: string
) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-qna-list", assessmentID, pageNumber],
    async ({ signal }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${assessmentID}/history`,
          {
            page_number: pageNumber,
            page_size: pageSize,
            query: query,
          },
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      refetchInterval: 60000,
      keepPreviousData: false,
    }
  );

export const EditAnswer = (assessmentID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      questionID,
      answer,
      signal,
    }: {
      questionID: string;
      answer: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.patch(
          `/api/${apiVersion}/${prefix}/${assessmentID}/history/${questionID}`,
          answer,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-qna-list", assessmentID]);
      },
    }
  );

export const ExportResponses = (assessmentID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      includesCitations,
      questions,
      signal,
    }: {
      includesCitations: boolean;
      questions: any;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${assessmentID}/history/export`,
          { include_citations: includesCitations, questions: questions },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "get-export-responses-status",
          assessmentID,
        ]);
      },
    }
  );

export const GetExportResponsesStatus = (assessmentID: string) =>
  useQuery<any, unknown, any, (string | number)[]>(
    ["get-export-responses-status", assessmentID],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${assessmentID}/history/export/status`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      enabled: assessmentID !== "",
      keepPreviousData: false,
      refetchInterval: 30000,
    }
  );

export const DownloadResponses = (assessmentID: string) =>
  useMutation<any, unknown, any, string>(
    async ({ signal }: { signal: AbortSignal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/${assessmentID}/history/export`,
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "get-export-responses-status",
          assessmentID,
        ]);
      },
    }
  );

export const CreateQuestionnaireTemplate = (assessmentID: string) =>
  useMutation<any, unknown, any, string>(
    async ({
      title,
      questions,
      signal,
    }: {
      title: string;
      questions: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/${assessmentID}/template`,
          { title: title, questions: questions },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-global-questionnaires"]);
      },
    }
  );
