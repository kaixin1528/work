/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import TextFilter from "src/components/Filter/General/TextFilter";
import { GetSelectionOptions } from "src/services/summaries/summaries";
import { KeyStringVal } from "src/types/general";

const SelectionOptions = ({
  short,
  long,
  selectedSource,
  setSelectedSource,
  selectedVersion,
  setSelectedVersion,
  selectedIntegrationType,
  setSelectedIntegrationType,
  selectedSourceAccountID,
  setSelectedSourceAccountID,
}: {
  short: string;
  long: string;
  selectedSource: string;
  setSelectedSource: (selectedSource: string) => void;
  selectedVersion: string;
  setSelectedVersion: (selectedVersion: string) => void;
  selectedIntegrationType?: string;
  setSelectedIntegrationType?: (selectedIntegrationType: string) => void;
  selectedSourceAccountID?: string;
  setSelectedSourceAccountID?: (selectedSourceAccountID: string) => void;
}) => {
  const { data: selectionOptions } = GetSelectionOptions(short, long);

  const sources = [
    ...new Set(
      selectionOptions?.reduce((pV: string[], cV: KeyStringVal) => {
        if (cV.cve_source) return [...pV, cV.cve_source];
        else return [...pV];
      }, [])
    ),
  ] as string[];
  const selectedSourceList = selectionOptions?.filter(
    (option: KeyStringVal) => option.cve_source === selectedSource
  );
  const versions = [
    ...new Set(
      selectedSourceList?.reduce((pV: string[], cV: KeyStringVal) => {
        if (cV.cve_version) return [...pV, cV.cve_version];
        else return [...pV];
      }, [])
    ),
  ] as string[];
  const selectedVersionList = selectionOptions?.filter(
    (option: KeyStringVal) =>
      option.cve_source === selectedSource &&
      option.cve_version === selectedVersion
  );
  const integrationTypes = [
    ...new Set(
      selectedVersionList?.reduce((pV: string[], cV: KeyStringVal) => {
        if (
          cV.integration_type !== null &&
          !pV.some(
            (sourceAccount: any) =>
              sourceAccount.integration_type === cV.integration_type
          )
        )
          return [...pV, cV.integration_type];
        else return [...pV];
      }, [])
    ),
  ] as string[];
  const selectedIntegrationList = selectionOptions?.filter(
    (option: KeyStringVal) =>
      option.cve_source === selectedSource &&
      option.cve_version === selectedVersion &&
      option.integration_type === selectedIntegrationType
  );
  const sourceAccountIDs = [
    ...new Set(
      selectedIntegrationList?.reduce((pV: string[], cV: KeyStringVal) => {
        if (
          cV.source_account_id !== null &&
          !pV.some(
            (sourceAccount: any) =>
              sourceAccount.source_account_id === cV.source_account_id
          )
        )
          return [...pV, cV.source_account_id];
        else return [...pV];
      }, [])
    ),
  ] as string[];

  useEffect(() => {
    if (sources?.length > 0 && !sources.includes(selectedSource))
      setSelectedSource(sources[0]);
    if (versions?.length > 0 && !versions.includes(selectedVersion))
      setSelectedVersion(versions[0]);
    if (
      integrationTypes?.length > 0 &&
      !integrationTypes.includes(String(selectedIntegrationType)) &&
      setSelectedIntegrationType
    )
      setSelectedIntegrationType(integrationTypes[0]);
    if (
      sourceAccountIDs?.length > 0 &&
      !sourceAccountIDs.includes(String(selectedSourceAccountID)) &&
      setSelectedSourceAccountID
    )
      setSelectedSourceAccountID(sourceAccountIDs[0]);
  }, [sources, versions, integrationTypes, sourceAccountIDs]);

  return (
    <section className="flex flex-wrap items-center gap-10">
      <TextFilter
        label="Source"
        list={sources}
        value={selectedSource}
        setValue={setSelectedSource}
      />
      <TextFilter
        label="Version"
        list={versions}
        value={selectedVersion}
        setValue={setSelectedVersion}
      />
      {selectedIntegrationType &&
        setSelectedIntegrationType &&
        selectedSourceAccountID &&
        setSelectedSourceAccountID && (
          <article className="flex items-center gap-10">
            <TextFilter
              label="Integration Type"
              list={integrationTypes}
              value={selectedIntegrationType}
              setValue={setSelectedIntegrationType}
            />
            <TextFilter
              label="Source Account ID"
              list={sourceAccountIDs}
              value={selectedSourceAccountID}
              setValue={setSelectedSourceAccountID}
            />
          </article>
        )}
    </section>
  );
};

export default SelectionOptions;
