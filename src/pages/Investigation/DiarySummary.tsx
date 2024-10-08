/* eslint-disable no-restricted-globals */
import React from "react";
import { useNavigate } from "react-router-dom";
import { userColors } from "../../constants/general";
import { DiaryType } from "../../types/investigation";

const DiarySummary = ({ diary }: { diary: DiaryType }) => {
  const navigate = useNavigate();

  return (
    <section
      key={diary.diary_id}
      className="relative grid content-start gap-5 cursor-pointer group rounded-sm"
      onClick={() =>
        navigate(`/investigation/diary/details?diary_id=${diary.diary_id}`)
      }
    >
      <article
        style={{
          backgroundImage: `url(${diary.image_url})`,
        }}
        className="relative h-60 bg-blend-multiply dark:group-hover:bg-signin/60 bg-no-repeat bg-cover bg-center grayscale"
      >
        <section className="absolute bottom-5 grid content-start gap-2 mx-3 dark:text-white">
          <h4 className="w-max break-all">Owner</h4>
          <article className="flex items-center gap-2 w-full">
            <span
              className={`grid content-center capitalize text-center text-[0.65rem] dark:text-white font-medium w-6 h-6 bg-gradient-to-b ${
                userColors[diary.owner[0].toLowerCase()]
              } rounded-full shadow-sm dark:shadow-checkbox`}
            >
              {diary.owner[0]}
            </span>
            <h4>{diary.owner}</h4>
          </article>
        </section>
      </article>
      <header className="grid gap-2">
        <h4 className="text-xl tracking-wider">{diary.name}</h4>
      </header>
    </section>
  );
};

export default DiarySummary;
