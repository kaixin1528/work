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

export class StrikeThrough extends Component<Props> {
  render() {
    const { position, onClick, onMouseOver, onMouseOut } = this.props;

    const { rects } = position;

    return (
      <article className="Highlight">
        <ul className="Highlight__parts">
          {rects.map((rect, index) => (
            <li
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              key={index}
              style={rect}
              className="Highlight__part"
            />
          ))}
        </ul>
      </article>
    );
  }
}

export default StrikeThrough;
