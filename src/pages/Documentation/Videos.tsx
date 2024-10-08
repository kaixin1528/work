import ReactPlayer from "react-player/youtube";

const Videos = () => {
  return (
    <section className="flex flex-col flex-grow gap-5 mx-6 my-4">
      <h4 className="text-lg">Videos</h4>

      {/* list of explanatory video */}
      {/* <section className="grid md:grid-cols-3 gap-10">
        <article className="grid gap-5">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
            width="100%"
            height="12rem"
          />
          <h4>Using the Graph to pinpoint infrastructure changes</h4>
        </article>
        <article className="grid gap-5">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
            width="100%"
            height="12rem"
          />
          <h4>Using the Graph to pinpoint infrastructure changes</h4>
        </article>
        <article className="grid gap-5">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
            width="100%"
            height="12rem"
          />
          <h4>Using the Graph to pinpoint infrastructure changes</h4>
        </article>
      </section> */}
    </section>
  );
};

export default Videos;
