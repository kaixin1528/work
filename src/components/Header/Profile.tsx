/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { userColors } from "../../constants/general";
import { checkIsAdmin, decodeJWT } from "../../utils/general";
import { LogOut } from "src/services/general/general";

const Profile = () => {
  const jwt = decodeJWT();
  const isAdmin = checkIsAdmin();

  const logOut = LogOut();

  return (
    <Menu as="article" className="relative inline-block text-left">
      <Menu.Button className="group relative">
        <span
          className={`grid content-center capitalize focus:outline-none text-center text-xs dark:text-white font-semibold w-7 h-7 bg-gradient-to-b ${
            userColors[jwt?.name[0].toLowerCase()]
          } dark:hover:opacity-80 duration-100 rounded-full`}
        >
          {jwt?.fullName[0]}
        </span>
        <span className="hidden group-hover:block absolute top-10 right-0 p-2 w-max text-xs dark:bg-filter black-shadow rounded-sm z-20">
          Profile
        </span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 grid mt-3 min-w-full origin-top-right text-xs dark:text-signin dark:bg-info focus:outline-none z-20">
          {jwt && (
            <article className="flex items-start gap-3 px-4 pt-4">
              <span
                className={`grid content-center w-8 h-8 capitalize text-center text-sm dark:text-white font-semibold bg-gradient-to-b ${
                  userColors[jwt?.name[0].toLowerCase()]
                } rounded-full`}
              >
                {jwt?.fullName[0]}
              </span>
              <article className="grid gap-1 pr-20 w-max">
                <h6 className="text-sm dark:text-white font-normal tracking-wider">
                  {jwt?.fullName}
                </h6>
                <p className="dark:text-checkbox font-extralight">
                  {jwt?.scope.roles[0]?.name}
                </p>
                <article className="flex items-center gap-2 pb-2 dark:text-checkbox">
                  <FontAwesomeIcon icon={faLocationPin} />
                  <p className="capitalize dark:text-checkbox font-extralight">
                    {jwt?.scope.customer_name}
                  </p>
                </article>
                <a
                  href="/profile/details?section=watch%20list"
                  className="underline dark:hover:text-signin/80 font-extralight"
                >
                  Go to Watchlist
                </a>
                {isAdmin && jwt?.scope.auth_scheme !== "OIDC" && (
                  <a
                    href="/profile/details?section=edit%20profile"
                    className="underline dark:hover:text-signin/80 font-extralight"
                  >
                    Edit Profile
                  </a>
                )}
              </article>
            </article>
          )}
          <button
            className="justify-self-end px-4 py-2 dark:hover:text-signin/80 font-extralight"
            onClick={() => logOut.mutate({})}
          >
            Log Out
          </button>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Profile;
