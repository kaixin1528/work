/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  disableGRC,
  pageMapping,
  poc,
  sidebarItems,
  sidebarVariants,
  simulation,
} from "../../constants/general";
import { useGeneralStore } from "../../stores/general";
import { jwtRole } from "../../types/settings";
import { decodeJWT, getCustomerCloud } from "../../utils/general";
import { useGraphStore } from "src/stores/graph";
import { defaultDepth } from "src/constants/graph";
import { KeyStringVal } from "src/types/general";
import { GetEnabledModules } from "src/services/general/general";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const jwt = decodeJWT();
  const customerCloud = getCustomerCloud();

  const { openSidebar, setOpenSidebar } = useGeneralStore();
  const {
    setGraphSearch,
    setGraphSearchString,
    setGraphSearching,
    setSnapshotTime,
    setNavigationView,
    setGraphInfo,
  } = useGraphStore();

  const { data: enabledModules } = GetEnabledModules();

  const handleGraphClear = () => {
    setNavigationView("snapshots");
    setGraphSearch(false);
    setGraphSearchString("");
    setGraphSearching(false);
    setSnapshotTime(new Date());
    setGraphInfo({
      root: customerCloud,
      depth: defaultDepth,
      showOnlyAgg: true,
      showPanel: false,
    });
  };

  return (
    <motion.aside
      animate={{
        width: openSidebar ? "14rem" : "4rem",
        transition: {
          duration: 0.2,
          type: "spring",
          damping: 15,
        },
      }}
      className={`grid content-start pt-5 text-sm dark:text-checkbox ${
        openSidebar
          ? "absolute inset-y-0 w-[14rem] z-30"
          : "w-[4rem] relative z-30"
      } bg-gradient-to-br dark:from-main dark:via-main dark:to-expand shadow-2xl dark:shadow-expand`}
    >
      {openSidebar && (
        <img
          src="/general/logos/uno-neg.svg"
          alt="uno"
          className="w-16 h-8 ml-5"
        />
      )}
      <nav className="grid">
        <article className={`grid ${openSidebar ? "pt-5" : "pt-0"}`}>
          {sidebarItems.map((navItem: KeyStringVal) => {
            if (
              navItem.name === "Settings" &&
              jwt?.scope.roles.some(
                (role: jwtRole) => role.role_type === "Regular"
              )
            )
              return null;
            const disabled =
              (![
                "Getting Started",
                "Third Party Risk",
                "Business Continuity",
                "Regulation & Policy",
                "Risk Intelligence",
                "Audits & Assessments",
                "Agreement & Contract Review",
                "Settings",
              ].includes(navItem.name) &&
                !enabledModules?.includes("EXTRA")) ||
              (navItem.name === "Simulation" && simulation === "false") ||
              (navItem.name !== "Getting Started" && poc === "true") ||
              ["Inference", "RCA", "Recommendation", "Help"].includes(
                navItem.name
              ) ||
              (disableGRC === "true" &&
                ["Third Party Risk", "Audits & Assessments"].includes(
                  navItem.name
                ));
            return (
              <button
                key={navItem.name}
                disabled={disabled}
                className={`group relative flex items-center gap-3 py-3 cursor-pointer ${
                  sessionStorage.page === navItem.name
                    ? "dark:text-white bg-gradient-to-b dark:from-card dark:to-expand"
                    : "hover:bg-gradient-to-b dark:hover:from-card/60 dark:hover:to-expand/0"
                } duration-100`}
                onClick={() => {
                  if (navItem.name === "Enterprise Knowledge Graph")
                    handleGraphClear();
                  sessionStorage.page = navItem.name;
                  navigate(navItem.href);
                }}
              >
                <img
                  src={`/general/nav/${navItem.icon}.svg`}
                  alt={navItem.name}
                  className={`ml-5 w-5 h-5 ${disabled ? "disable" : ""}`}
                />
                <AnimatePresence>
                  {openSidebar && (
                    <motion.p
                      variants={sidebarVariants}
                      initial="hidden"
                      animate="show"
                      className="text-left"
                    >
                      {navItem.name}
                    </motion.p>
                  )}
                </AnimatePresence>
                {!openSidebar && (
                  <article className="hidden group-hover:grid relative -top-4 z-50">
                    <article className="absolute left-5 px-4 py-2 w-max text-xs dark:text-white dark:bg-filter black-shadow rounded-sm">
                      {pageMapping[navItem.name]}
                    </article>
                    <svg
                      className="absolute dark:text-filter h-3 -right-5 top-3 rotate-90"
                      x="0px"
                      y="0px"
                      viewBox="0 0 255 255"
                      xmlSpace="preserve"
                    >
                      <polygon
                        className="fill-current"
                        points="0,0 127.5,127.5 255,0"
                      />
                    </svg>
                  </article>
                )}
              </button>
            );
          })}
        </article>

        {/* collapsible option */}
        <article
          className="flex items-center gap-3 py-3 cursor-pointer"
          onClick={() => setOpenSidebar(!openSidebar)}
        >
          <FontAwesomeIcon
            icon={faArrowRightLong}
            className={`ml-5 w-4 h-4 cursor-pointer duration-100 ${
              openSidebar ? "rotate-180 delay-75" : ""
            }`}
          />
          <AnimatePresence>
            {openSidebar && (
              <motion.p
                variants={sidebarVariants}
                initial="hidden"
                animate="show"
                className={`${openSidebar ? "visible" : "hidden"}`}
              >
                {openSidebar ? "Collapse" : ""}
              </motion.p>
            )}
          </AnimatePresence>
        </article>

        {/* toggle light/dark mode */}
        {/* <article className="flex py-3 gap-3 items-center">
            <button
              className={`flex items-center ml-4 w-6 h-4 rounded-full ${
                dark ? "bg-secondary" : "bg-gray-200"
              } `}
              // onClick={() => {
              //   if (document.documentElement.classList[0] === "dark") {
              //     document.documentElement.classList.remove("dark");
              //     setDark(false);
              //   } else {
              //     document.documentElement.classList.add("dark");
              //     setDark(true);
              //   }
              // }}
            >
              <span className="sr-only">Enable Dark Mode</span>
              <span
                className={`${
                  dark ? "translate-x-2" : "translate-x-1"
                } w-3 h-3 transform bg-main rounded-full`}
              />
            </button>
            <AnimatePresence>
              {openSidebar && (
                <motion.p
                  variants={sidebarVariants}
                  initial="hidden"
                  animate="show"
                  className={`w-full bg-red-300 ${
                    openSidebar ? "visible" : "hidden"
                  }`}
                >
                  {dark ? "Dark" : "Light"} Mode
                </motion.p>
              )}
            </AnimatePresence>
          </article> */}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
