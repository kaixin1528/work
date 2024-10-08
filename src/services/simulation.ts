/* eslint-disable no-restricted-globals */
import { useMutation, useQuery } from "react-query";
import { client } from "../components/General/AxiosInterceptor";
import { apiVersion } from "../constants/general";

const prefix = "simulation";

// get simulation package info
export const GetSimulationPackageInfo = (packageType: string) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-simulation-package-info", packageType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/fetch/package_info?package_type=${packageType}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: packageType !== "", keepPreviousData: false }
  );

// get simulation attack worflow
export const GetSimulationAttackWorkflow = (
  packageType: string,
  damageScope: string
) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-simulation-attack-workflow", packageType, damageScope],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/fetch/attack_workflow?package_type=${packageType}&damage_scope=${damageScope}`,
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
      enabled: packageType !== "" && damageScope !== "",
      keepPreviousData: false,
    }
  );

// run simulation impact
export const RunSimulationImpact = () =>
  useMutation<any, unknown, any, string[]>(
    async ({
      integrationType,
      integrationID,
      snapshotTime,
      packageType,
      impactScope,
    }: {
      integrationType: string;
      integrationID: string;
      snapshotTime: number;
      packageType: string;
      impactScope: string;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/run/impact?integration_type=${integrationType}&integration_id=${integrationID}&record_time=${snapshotTime}&package_type=${packageType}&impact_type=${impactScope}`,
          {}
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// get simulation graph
export const GetSimulationGraph = (env: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      snapshotTime,
      sourceNodeID,
      simulationType,
      affectedNodeIDs,
      signal,
    }: {
      snapshotTime: number;
      sourceNodeID: string;
      simulationType: string;
      affectedNodeIDs: string[];
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/run/subgraph?env_id=${env}&record_time=${snapshotTime}&node_id=${sourceNodeID}&simulation_type=${simulationType}`,
          {
            node_ids: affectedNodeIDs,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// get simulation possible damages
export const GetSimulationPossibleDamages = (env: string) =>
  useMutation<any, unknown, any, string[]>(
    async ({
      integrationType,
      integrationID,
      packageType,
      snapshotTime,
      sourceNodeID,
      affectedNodeIDs,
      damageScope,
      signal,
    }: {
      integrationType: string;
      integrationID: string;
      packageType: string;
      snapshotTime: number;
      sourceNodeID: string;
      affectedNodeIDs: string[];
      damageScope: string;
      signal: AbortSignal;
    }) => {
      try {
        const res = await client.post(
          `/api/${apiVersion}/${prefix}/run/possible_damage?env_id=${env}&integration_type=${integrationType}&integration_id=${integrationID}&package_type=${packageType}&record_time=${snapshotTime}&node_id=${sourceNodeID}&damage_scope=${damageScope}`,
          {
            node_ids: affectedNodeIDs,
          },
          { signal }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    }
  );

// get simulation element info
export const GetSimulationElementInfo = (
  env: string,
  annotationContext: string,
  elementID: string | null,
  elementType: string | null
) =>
  useQuery<any, unknown, any, (string | null)[]>(
    ["get-simulation-element-info", env, elementID, elementType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/fetch/info?env_id=${env}&graph_element_id=${elementID}&element_type=${elementType}`,
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
      enabled:
        env !== "" &&
        ["malicious", "non-malicious"].includes(annotationContext) &&
        elementID !== "" &&
        elementType !== "",
      keepPreviousData: false,
    }
  );

// get simulation package remedies
export const GetSimulationPackageRemedies = (packageType: string) =>
  useQuery<any, unknown, any, (string | boolean)[]>(
    ["get-simulation-package-remedies", packageType],
    async ({ signal }) => {
      try {
        const res = await client.get(
          `/api/${apiVersion}/${prefix}/fetch/package_remedies?package_type=${packageType}`,
          {
            signal,
          }
        );
        return res?.data;
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      }
    },
    { enabled: packageType !== "", keepPreviousData: false }
  );
