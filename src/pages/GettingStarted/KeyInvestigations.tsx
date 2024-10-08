import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import { pointerVariants, showVariants } from "src/constants/general";
import { GetKeyInvestigations } from "src/services/getting-started";
import { useGeneralStore } from "src/stores/general";
import { KeyStringVal } from "src/types/general";

const KeyInvestigations = () => {
  const navigate = useNavigate();

  const { env } = useGeneralStore();

  const { data: keyInvestigations } = GetKeyInvestigations(env, 3);

  return (
    <motion.section
      variants={pointerVariants}
      className="flex flex-col flex-grow content-start gap-3 p-4 w-full h-full text-center text-sm bg-gradient-to-b dark:bg-main border-1 dark:border-filter overflow-auto scrollbar z-20"
    >
      <h3 className="text-xl">Key Investigations</h3>
      {keyInvestigations?.length > 0 ? (
        <motion.ul
          variants={showVariants}
          initial="hidden"
          animate="visible"
          className="grid divide-y dark:divide-checkbox/20"
        >
          {keyInvestigations?.map((diary: KeyStringVal) => {
            return (
              <motion.li
                variants={showVariants}
                key={diary.diary_id}
                className="grid gap-2 p-4 place-items-center cursor-pointer dark:hover:bg-filter/30 duration-100"
                onClick={() =>
                  navigate(
                    `/investigation/diary/details?diary_id=${diary.diary_id}`
                  )
                }
              >
                <span
                  style={{
                    backgroundImage: `url(${diary.image_url})`,
                  }}
                  className="mx-auto w-10 h-10 bg-no-repeat bg-cover bg-center rounded-full"
                ></span>

                <p className="text-center text-base">{diary.name}</p>
                <p className="px-2 py-1 text-xs selected-button rounded-full">
                  <span>{diary.evidence_count}</span> pieces of evidence
                </p>
              </motion.li>
            );
          })}
        </motion.ul>
      ) : (
        <p>You have no key investigations as of now</p>
      )}
    </motion.section>
  );
};

export default KeyInvestigations;
