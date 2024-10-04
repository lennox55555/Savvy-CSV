import React from "react";
interface AutosizeTextAreaProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    maxHeight: number;
    placeholder?: string;
}
declare const AutosizeTextArea: React.FC<AutosizeTextAreaProps>;
export default AutosizeTextArea;
