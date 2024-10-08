import { Component } from "react";
import { LTWHP } from "react-pdf-highlighter";

interface Props {
  position: {
    boundingRect: LTWHP;
    rects: Array<LTWHP>;
  };
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  comment: {
    emoji: string;
    text: string;
  };
  isScrolledTo: boolean;
}

export class Highlight extends Component<Props> {
  render() {
    const { position, onClick, onMouseOver, onMouseOut, isScrolledTo } =
      this.props;

    const { rects } = position;

    return (
      <div
        className={`Highlight ${
          isScrolledTo ? "Removed-Highlight--scrolledTo" : ""
        }`}
      >
        <div className="Highlight__parts">
          {rects.map((rect, index) => (
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              key={index}
              style={rect}
              className={`Highlight__part`}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Highlight;
