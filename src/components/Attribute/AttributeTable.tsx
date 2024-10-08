import { faSadTear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RegionAttributes } from "src/types/dashboard";
import { GraphNodeAttribute } from "src/types/general";
import TableLayout from "../../layouts/TableLayout";
import AttributeRow from "./AttributeRow";

const AttributeTable = ({
  attributes,
  curSearchSnapshot,
}: {
  attributes: GraphNodeAttribute | RegionAttributes;
  curSearchSnapshot: any;
}) => {
  return (
    <TableLayout fullHeight>
      <thead>
        <tr className="text-sm text-left dark:text-checkbox">
          <th className="px-4 py-3 font-medium">Attribute</th>
          <th className="px-4 py-3 break-words font-medium">Detail</th>
        </tr>
      </thead>
      <tbody>
        {attributes ? (
          Object.values(attributes)?.length > 0 ? (
            Object.values(attributes)?.map(
              (attribute: GraphNodeAttribute, index: number) => {
                if (attribute === null) return null;
                return (
                  <AttributeRow
                    key={`keyinfo-${index}`}
                    attribute={attribute}
                    curSearchSnapshot={curSearchSnapshot}
                  />
                );
              }
            )
          ) : (
            <tr className="w-full dark:bg-tooltip">
              <td className="flex items-center gap-2 pl-4 py-4">
                <FontAwesomeIcon
                  icon={faSadTear}
                  className="w-5 h-5 text-signin"
                />
                <p>No attributes available</p>
              </td>
              <td></td>
            </tr>
          )
        ) : null}
      </tbody>
    </TableLayout>
  );
};

export default AttributeTable;
