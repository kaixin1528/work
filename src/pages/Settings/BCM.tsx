/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import NumericFilter from "src/components/Filter/General/NumericFilter";
import BCMRowFilter from "src/components/Filter/Settings/BCMRowFilter";
import BIAMatchingColumnFilter from "src/components/Filter/Settings/BIAMatchingColumnFilter";
import { GetBCMSettings, SaveBCMSettings } from "src/services/settings/bcm";
import { KeyStringVal } from "src/types/general";
import { getCustomerID } from "src/utils/general";

const BCM = () => {
  const customerID = getCustomerID();

  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [rowFilters, setRowFilters] = useState<KeyStringVal[]>([]);
  const [matchingColumns, setMatchingColumns] = useState<string[]>([]);
  const [sectionsToExport, setSectionsToExport] = useState<number>(0);

  const { data: bcmSettings } = GetBCMSettings(customerID);
  const saveBCMSettings = SaveBCMSettings(customerID);

  const handleInitialize = () => {
    setRowFilters(bcmSettings.row_filter);
    setMatchingColumns(bcmSettings.bia_matching_columns);
    setSectionsToExport(bcmSettings.section_to_export);
  };

  const handleReset = () => {
    handleInitialize();
    setIsEdited(false);
  };

  useEffect(() => {
    if (bcmSettings && isEdited) handleInitialize();
  }, [bcmSettings]);

  useEffect(() => {
    setIsEdited(true);
  }, [sectionsToExport]);

  return (
    <section className="flex flex-col flex-grow gap-5 p-4 overflow-auto scrollbar">
      <h4>BCM</h4>
      {isEdited && (
        <article className="flex items-center gap-2 text-sm">
          <button className="discard-button" onClick={handleReset}>
            Discard
          </button>
          <button
            className="save-button"
            onClick={() => {
              saveBCMSettings.mutate({
                rowFilters: rowFilters,
                sectionsToExport: sectionsToExport,
                biaMatchingColumns: matchingColumns,
              });
              handleReset();
            }}
          >
            Save
          </button>
        </article>
      )}
      <section className="grid text-sm divide-y dark:divide-yellow-500">
        <BCMRowFilter
          label="Row Filters"
          rowFilters={rowFilters}
          setRowFilters={setRowFilters}
          setIsEdited={setIsEdited}
        />
        <article className="py-5">
          <NumericFilter
            label="Sections to Export"
            value={sectionsToExport}
            setValue={setSectionsToExport}
          />
        </article>
        <BIAMatchingColumnFilter
          label="BIA Matching Columns"
          list={bcmSettings?.bia_matching_columns}
          columns={matchingColumns}
          setColumns={setMatchingColumns}
          setIsEdited={setIsEdited}
        />
      </section>
    </section>
  );
};

export default BCM;
