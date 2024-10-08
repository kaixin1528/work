/* eslint-disable no-restricted-globals */
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { DiaryType, EvidenceType } from "../../../../types/investigation";
import { convertToMicrosec, parseURL } from "../../../../utils/general";
import TemporalDatepicker from "src/components/Datepicker/TemporalDatepicker";
import { useGeneralStore } from "src/stores/general";
import EvidenceDetail from "./EvidenceDetail";
import {
  EditDiaryEvidenceTimes,
  GetAllDiaryEvidence,
} from "src/services/investigation/diary/evidence/evidence";

const EvidenceList = ({ diary }: { diary: DiaryType }) => {
  const parsed = parseURL();
  const { env } = useGeneralStore();

  const [temporalStartDate, setTemporalStartDate] = useState<Date>(new Date());
  const [temporalEndDate, setTemporalEndDate] = useState<Date>(new Date());
  const [sort, setSort] = useState("desc");
  const [selectedEvidenceIDs, setSelectedEvidenceIDs] = useState<string[]>([]);

  const { data: allEvidence } = GetAllDiaryEvidence(env, parsed.diary_id);
  const editEvidenceTimes = EditDiaryEvidenceTimes(env, parsed.diary_id);

  const sortedAllEvidence =
    sort === "asc"
      ? allEvidence?.sort(
          (a: EvidenceType, b: EvidenceType) =>
            a.evidence.created_at - b.evidence.created_at
        )
      : allEvidence?.sort(
          (a: EvidenceType, b: EvidenceType) =>
            b.evidence.created_at - a.evidence.created_at
        );

  return (
    <section className="grid gap-5">
      {sortedAllEvidence?.length > 0 && (
        <button
          className="flex items-center gap-2 px-2 py-1 justify-self-start text-xs capitalize dark:bg-filter dark:hover:bg-filter/60 duration-100 rounded-sm"
          onClick={() => {
            if (sort === "asc") setSort("desc");
            else setSort("asc");
          }}
        >
          {sort === "asc" ? "oldest" : "latest"} first{" "}
          <FontAwesomeIcon icon={faSort} />
        </button>
      )}

      {selectedEvidenceIDs.length > 0 && (
        <section className="flex items-center gap-5">
          <h4>Select time range:</h4>
          <TemporalDatepicker
            temporalStartDate={temporalStartDate}
            setTemporalStartDate={setTemporalStartDate}
            temporalEndDate={temporalEndDate}
            setTemporalEndDate={setTemporalEndDate}
          />

          <button
            disabled={temporalStartDate.getTime() === temporalEndDate.getTime()}
            className="p-2 text-xs dark:disabled:bg-filter/10 dark:disabled:border-filter dark:bg-signin/10 dark:hover:bg-signin/30 duration-100 border dark:border-signin rounded-sm"
            onClick={() => {
              editEvidenceTimes.mutate({
                evidenceIDs: selectedEvidenceIDs,
                startTime: convertToMicrosec(temporalStartDate),
                endTime: convertToMicrosec(temporalEndDate),
              });
              setTemporalStartDate(new Date());
              setTemporalEndDate(new Date());
              setSelectedEvidenceIDs([]);
            }}
          >
            Update Queries
          </button>
        </section>
      )}

      <ul className="grid gap-10">
        {sortedAllEvidence?.map((evidence: EvidenceType) => {
          const curEvidence = evidence.evidence;
          return (
            <EvidenceDetail
              key={curEvidence.evidence_id}
              diary={diary}
              curEvidence={curEvidence}
              selectedEvidenceIDs={selectedEvidenceIDs}
              setSelectedEvidenceIDs={setSelectedEvidenceIDs}
            />
          );
        })}
      </ul>
    </section>
  );
};

export default EvidenceList;
