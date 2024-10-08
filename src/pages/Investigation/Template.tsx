/* eslint-disable no-restricted-globals */
import {
  InvestigationTemplate,
  TemplateEvidenceType,
} from "../../types/investigation";
import { useNavigate } from "react-router-dom";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { showVariants } from "../../constants/general";
import { decodeJWT } from "../../utils/general";
import ModalLayout from "../../layouts/ModalLayout";
import { queryClient } from "src/App";
import { useGeneralStore } from "src/stores/general";
import { CreateInvestigation } from "src/services/investigation/diary/diary";
import { AddAsEvidence } from "src/services/investigation/diary/evidence/evidence";
import { GetInvestigationTemplateEvidence } from "src/services/investigation/templates";

const Template = ({
  template,
  previewTemplateID,
  setPreviewTemplateID,
}: {
  template: InvestigationTemplate;
  previewTemplateID: string;
  setPreviewTemplateID: (previewTemplateID: string) => void;
}) => {
  const navigate = useNavigate();
  const jwt = decodeJWT();

  const { env } = useGeneralStore();

  const { data: templateEvidence } = GetInvestigationTemplateEvidence(
    env,
    template.template_id
  );
  const createDiary = CreateInvestigation(env);
  const addAsEvidence = AddAsEvidence(env);

  const loading =
    createDiary.status === "loading" || addAsEvidence.status === "loading";

  const handleOnClose = () => {
    setPreviewTemplateID("");
  };

  return (
    <ModalLayout
      showModal={previewTemplateID === template.template_id}
      onClose={handleOnClose}
    >
      <section className="grid gap-5 py-5">
        <header className="flex items-center gap-2 mx-auto">
          <FontAwesomeIcon icon={faEye} className="dark:text-admin" />
          <h4 className="text-center text-base tracking-widest">
            PREVIEW SUMMARY
          </h4>
        </header>

        {/* template image */}
        <span
          style={{
            backgroundImage: `url(${template.image_url})`,
          }}
          className="mx-auto w-12 h-12 bg-no-repeat bg-cover bg-center grayscale rounded-full"
        ></span>

        <p className="text-center text-base">{template.description}</p>

        {/* list of template evidence */}
        {templateEvidence && (
          <motion.ul
            variants={showVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-3 mx-auto max-h-40 overflow-auto scrollbar"
          >
            {templateEvidence?.map((evidence: TemplateEvidenceType) => {
              return (
                <motion.li
                  variants={showVariants}
                  key={evidence.evidence_id}
                  className="flex items-start gap-3"
                >
                  <img
                    src={`/investigation/evidence-type/${evidence.evidence_type.toLowerCase()}.svg`}
                    alt={evidence.evidence_type.toLowerCase()}
                    className="mt-[0.4rem] w-4 h-4 dark:text-checkbox"
                  />
                  {/* search string */}
                  <article className="flex items-start gap-2 py-1 px-4 w-full break-all dark:text-white dark:bg-signin/20 border dark:border-signin rounded-sm overflow-auto scrollbar">
                    {/* firewall search by cloud */}
                    {evidence.evidence_type === "FIREWALL_SEARCH" && (
                      <img
                        src={`/general/integrations/${evidence.results.cloud}.svg`}
                        alt={String(evidence.results.cloud)}
                        className="w-4 h-4"
                      />
                    )}
                    <p>{evidence.query_string}</p>
                  </article>
                </motion.li>
              );
            })}
          </motion.ul>
        )}

        {loading ? (
          <p className="mx-auto">Diary is being created...</p>
        ) : (
          <section className="flex items-center mx-auto gap-5 mt-5">
            <button
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-b dark:from-filter dark:to-filter/60 dark:hover:from-filter dark:hover:to-filter/30 rounded-sm"
              onClick={handleOnClose}
            >
              Cancel
            </button>
            {/* use template */}
            <button
              disabled={loading}
              className="px-4 py-2 text-sm gradient-button rounded-sm"
              onClick={() => {
                createDiary.mutate(
                  {
                    newDiary: {
                      name: template.name,
                      description: template.description,
                      is_private: template.is_private,
                      image_url: template.image_url,
                    },
                  },
                  {
                    onSuccess: (diaryData) => {
                      queryClient.invalidateQueries(["get-investigations"]);
                      templateEvidence?.map((evidence: TemplateEvidenceType) =>
                        addAsEvidence.mutate(
                          {
                            body: {
                              query_string: evidence.query_string,
                              query_start_time: evidence.query_start_time,
                              query_end_time: evidence.query_end_time,
                              evidence_type: evidence.evidence_type,
                              results: evidence.results,
                              annotation_set: "{}",
                              annotation: "",
                              diary_id: diaryData.diary_id,
                              author: jwt?.name,
                              title: evidence.title,
                            },
                          },
                          {
                            onSuccess: () => {
                              navigate(
                                `/investigation/diary/details?diary_id=${diaryData.diary_id}`
                              );
                              queryClient.invalidateQueries([
                                "get-all-diary-evidence",
                                env,
                                diaryData.diary_id,
                              ]);
                            },
                          }
                        )
                      );
                    },
                  }
                );
              }}
            >
              Create Diary
            </button>
          </section>
        )}
      </section>
    </ModalLayout>
  );
};

export default Template;
