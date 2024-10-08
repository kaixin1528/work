import React from "react";
import Lottie from "react-lottie-player";
import waitingTea from "../../lottie/coffee.json";

const PouringTea = () => {
  return (
    <article className="absolute top-1/3 left-1/2 -translate-x-1/2 grid pt-10 mx-auto w-32 h-12 z-50">
      <article data-test="diff-lottie" className="h-[7rem]">
        <Lottie
          loop
          animationData={waitingTea}
          play={true}
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </article>
    </article>
  );
};

export default PouringTea;
