import {
  faArrowLeftLong,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const KnowledgeBase = () => {
  return (
    <section className="grid content-start gap-5 pr-10 m-5 w-full text-sm">
      <h4 className="text-base">Keyboard Shortcuts</h4>
      <article className="flex items-start justify-between gap-5">
        <article className="grid">
          <p className="font-light">Unselect element</p>
        </article>
        <span className="px-2 py-1 selected-button rounded-sm">esc</span>
      </article>
      <article className="flex items-start justify-between gap-5">
        <article className="grid">
          <p className="font-light">Return to previous page</p>
        </article>
        <span className="px-2 py-1 selected-button rounded-sm">Backspace</span>
      </article>
      <article className="flex items-start justify-between gap-5">
        <article className="grid">
          <p className="font-light">Spotlight search</p>
        </article>
        <article className="flex items-center gap-2">
          <span className="px-2 py-1 selected-button rounded-sm">shift</span>
          <span className="px-2 py-1 selected-button rounded-sm">s</span>
        </article>
      </article>
      <article className="flex items-start justify-between gap-5">
        <article className="grid">
          <p className="font-light">Toggle graph snapshot times</p>
          <p className="font-light">Toggle graph temporal search days</p>
        </article>
        <article className="flex items-center gap-2">
          <span className="px-2 py-1 selected-button rounded-sm">
            <FontAwesomeIcon icon={faArrowLeftLong} />
          </span>
          <span className="px-2 py-1 selected-button rounded-sm">
            <FontAwesomeIcon icon={faArrowRightLong} />
          </span>
        </article>
      </article>
      <article className="flex items-start justify-between gap-5">
        <article className="grid">
          <p className="font-light">Download viewport screenshot</p>
        </article>
        <article className="flex items-center gap-2">
          <span className="px-2 py-1 selected-button rounded-sm">shift</span>
          <span className="px-2 py-1 selected-button rounded-sm">d</span>
        </article>
      </article>
      <article className="flex items-start justify-between gap-5">
        <article className="grid">
          <p className="font-light">Download graph screenshot</p>
        </article>
        <article className="flex items-center gap-2">
          <span className="px-2 py-1 selected-button rounded-sm">shift</span>
          <span className="px-2 py-1 selected-button rounded-sm">g</span>
        </article>
      </article>
    </section>
  );
};

export default KnowledgeBase;
