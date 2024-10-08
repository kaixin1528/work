/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { motion } from "framer-motion";
import { pageMapping } from "../../constants/general";
import { useNavigate } from "react-router-dom";
import Help from "./Help";
import Profile from "./Profile";
import Notification from "./Notification";
import EnvFilter from "../Filter/General/EnvFilter";
import SpotlightSearch from "./SpotlightSearch";
import Vuln from "./Vuln";
import { GetEnabledModules } from "src/services/general/general";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const { data: enabledModules } = GetEnabledModules();

  return (
    <header className="flex items-center justify-between py-3 px-4 dark:text-white border-0 border-transparent dark:bg-main">
      <article className="flex items-center gap-8">
        <button
          onClick={() =>
            navigate(
              enabledModules?.includes("EXTRA")
                ? `/getting-started`
                : "/regulation-policy/summary"
            )
          }
          className="flex items-center gap-10"
        >
          <img
            src="/general/logos/uno-id.svg"
            alt="unoai logo"
            className="w-7 h-7"
          />
        </button>
        <motion.h4 className="mt-1 text-lg">
          {pageMapping[sessionStorage.page]}
        </motion.h4>
        <EnvFilter />
      </article>

      <article className="flex gap-3 -mb-3">
        {enabledModules?.includes("EXTRA") && <>{/* <SpotlightSearch /> */}</>}
        <Help />
        <Profile />
        <Notification />
      </article>
    </header>
  );
};

export default Header;
