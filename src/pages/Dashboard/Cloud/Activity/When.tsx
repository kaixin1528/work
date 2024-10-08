import { rollUp } from "../../../../constants/dashboard";

const When = ({ time }: { time: string }) => {
  const arrayLength = {
    daily: 7,
    weekly: 13,
    monthly: 3,
    quarterly: 2,
  };

  const data = new Array(arrayLength[time])
    .fill([
      {
        timestamp: 1659654000000000,
        activity_level: "low",
        additional_info: {
          info_1: "asdfsf",
        },
      },
      {
        timestamp: 1659654000000000,
        activity_level: "high",
        additional_info: {
          info_1: "asdfsf",
        },
      },
      {
        timestamp: 1659654000000000,
        activity_level: "no",
        additional_info: {
          info_1: "asdfsf",
        },
      },
      {
        timestamp: 1659654000000000,
        activity_level: "regular",
        additional_info: {
          info_1: "asdfsf",
        },
      },
    ])
    .flat();

  return (
    <section className="grid gap-8">
      <h4>When</h4>
      <article
        className={`grid ${rollUp[time]} items-center gap-y-1 justify-self-center w-full h-[10rem]`}
      >
        {data.map((bucket, index) => {
          return (
            <img
              key={index}
              src={`/dashboard/activity/when/${bucket.activity_level}-activity.svg`}
              alt="activity level"
              className="w-full cursor-pointer"
            />
          );
        })}
      </article>
    </section>
  );
};

export default When;
