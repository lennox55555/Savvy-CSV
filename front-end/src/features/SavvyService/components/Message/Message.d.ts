import React from "react";
import { TableObject, UserMessage } from "../../../../utils/types";
interface MessageProps {
    message: UserMessage;
    index: number;
    downloadCSV: (table: TableObject | null | string, rank: number | null) => void;
}
declare const Message: React.FC<MessageProps>;
export default Message;
