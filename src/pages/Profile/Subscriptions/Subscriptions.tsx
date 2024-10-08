/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { GetSubscriptions } from "src/services/general/general";
import { KeyStringVal } from "src/types/general";
import { sortTextData } from "src/utils/general";
import SubscriptionDetails from "./SubscriptionDetails";

const Subscriptions = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: subscriptions } = GetSubscriptions(true);

  const categories = [
    ...new Set(
      subscriptions?.reduce(
        (pV: string[], cV: KeyStringVal) => [...pV, cV.artifact_type],
        []
      )
    ),
  ] as string[];
  const filteredSubscriptions = sortTextData(
    subscriptions
      ?.filter(
        (subscription: KeyStringVal) =>
          subscription.artifact_type === selectedCategory
      )
      .reduce((pV: KeyStringVal[], cV: KeyStringVal) => {
        if (
          !pV.some(
            (subscription) => subscription.artifact_name === cV.artifact_name
          )
        )
          return [...pV, cV];
        else return [...pV];
      }, []),
    "artifact_name",
    "asc"
  );

  useEffect(() => {
    if (
      categories?.length > 0 &&
      (filteredSubscriptions?.length === 0 || selectedCategory === "")
    )
      setSelectedCategory(categories[0]);
  }, [categories]);

  return (
    <section className="flex flex-col flex-grow gap-5 p-5 text-sm overflow-auto scrollbar">
      <h4 className="text-base">Subscriptions</h4>
      <nav className="flex items-center gap-1">
        {categories.map((category) => (
          <button
            key={category}
            className={`py-2 px-4 ${
              selectedCategory === category
                ? "dark:bg-signin/20 border dark:border-signin"
                : "dark:bg-filter/20 dark:hover:bg-signin/40 duration-100 border dark:border-filter"
            } rounded-sm`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </nav>
      {subscriptions ? (
        filteredSubscriptions?.length > 0 ? (
          <ul className="grid gap-5">
            {filteredSubscriptions?.map((subscription: KeyStringVal) => {
              return (
                <SubscriptionDetails
                  key={subscription.artifact_name}
                  subscription={subscription}
                />
              );
            })}
          </ul>
        ) : (
          <p>No subscriptions yet</p>
        )
      ) : null}
    </section>
  );
};

export default Subscriptions;
