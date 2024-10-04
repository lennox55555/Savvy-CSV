import React from "react";
import { TableObject } from "../../../../utils/types";
interface SavvyTableProps {
    data: TableObject | null;
    tableKey: string;
}
declare const SavvyTable: React.FC<SavvyTableProps>;
export default SavvyTable;
