import { DiaryType } from "../../../../types/investigation";
import DeleteDiary from "./DeleteDiary";
import RecentQueries from "./RecentQueries";
import Tags from "./Tags";
import Users from "./Users";

const SidePanel = ({ diary }: { diary: DiaryType }) => {
  const closedDiary = diary?.status === "CLOSED";

  return (
    <aside className="relative md:col-span-2 lg:col-span-1 grid content-start gap-10 px-1 w-full z-10">
      {/* owner + collaborators */}
      <Users diary={diary} />

      {!closedDiary && (
        <>
          {/* tags */}
          <Tags />

          {/* get 10 most recent queries */}
          <RecentQueries />

          {/* delete diary */}
          <DeleteDiary diary={diary} />
        </>
      )}
    </aside>
  );
};

export default SidePanel;
