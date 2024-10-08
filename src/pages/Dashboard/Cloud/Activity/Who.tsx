import { Line, LineChart, ResponsiveContainer } from "recharts";
import { KeyStringVal } from "src/types/general";
import { userColors } from "../../../../constants/general";

const Who = () => {
  const users: KeyStringVal = {
    "jack.sparrow@applecider.info": "Jack Sparrow",
    "rachel.chu@applecider.info": "Rachel Chu",
    "naruto.uzamaki@applecider.info": "Naruto Uzamaki",
    "hermione.granger@applecider.info": "Hermione Granger",
    "top.riddle@applecider.info": "Top Riddle",
    "sofia.pacheco@applecider.info": "Sofia Pacheco",
    "bruce.banner@applecider.info": "Bruce Banner",
    "mahamed.cordova@applecider.info": "Mahamed Cordova",
    "alaina.rivers@applecider.info": "Alaina Rivers",
    "olivia.hamilton@applecider.info": "Olivia Hamilton",
  };

  const filteredUsers = [
    "jack.sparrow@applecider.info",
    "rachel.chu@applecider.info",
    "naruto.uzamaki@applecider.info",
    "hermione.granger@applecider.info",
    "top.riddle@applecider.info",
    "sofia.pacheco@applecider.info",
    "bruce.banner@applecider.info",
    "mahamed.cordova@applecider.info",
    "alaina.rivers@applecider.info",
    "olivia.hamilton@applecider.info",
  ];

  const data: any[] = [];

  const rand = 300;
  for (let i = 0; i < 24; i++) {
    const timestamp = 1659843628137000 + 3.6e9 * i;
    const value = Math.random() * (rand + 50) + 100;

    let d = {
      timestamp: timestamp,
      value: value,
    };

    data.push(d);
  }

  const maxValue = Math.max(...data.reduce((pV, cV) => [...pV, cV.value], []));

  return (
    <section className="grid content-start gap-2">
      <h4>Who</h4>
      <ul className="grid grid-rows-5 grid-cols-2 grid-flow-col gap-x-5">
        {filteredUsers.map((email: string) => {
          return (
            <li className="flex items-center gap-3">
              <article
                key={email}
                className="flex items-center gap-3 py-2 w-full text-left text-xs"
              >
                <span
                  className={`grid content-center capitalize text-center dark:text-white font-medium w-5 h-5 bg-gradient-to-b ${
                    userColors[email[0].toLowerCase()]
                  } rounded-full shadow-sm dark:shadow-checkbox`}
                >
                  {users[email][0]}
                </span>
                <p className="hidden xl:grid">
                  {users[email]}
                  {"  "}
                  <span className="dark:text-checkbox">{email}</span>
                </p>
              </article>
              <article className="w-full xl:w-20 h-10">
                <ResponsiveContainer height="100%" width="100%">
                  <LineChart data={data}>
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0"
                        y1="0"
                        x2="100%"
                        y2="0"
                      >
                        {data.map((d) => {
                          const timePct = Math.floor(
                            ((d.timestamp - data[0].timestamp) /
                              (data[data.length - 1].timestamp -
                                data[0].timestamp)) *
                              100
                          );
                          const valuePct = Math.floor(
                            (d.value / maxValue) * 100
                          );
                          const color =
                            valuePct > 25
                              ? valuePct > 50
                                ? valuePct > 75
                                  ? "#1E6823"
                                  : "#44A340"
                                : "#8CC665"
                              : "#D6E685";
                          return (
                            <stop offset={`${timePct}%`} stopColor={color} />
                          );
                        })}
                      </linearGradient>
                    </defs>

                    <Line
                      type="linear"
                      dataKey="value"
                      stroke="url(#gradient)"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Who;
