import React, { useRef, useEffect } from "react";
var AutosizeTextArea = function (_a) {
    var value = _a.value, onChange = _a.onChange, onKeyDown = _a.onKeyDown, maxHeight = _a.maxHeight, placeholder = _a.placeholder;
    var textAreaRef = useRef(null);
    useEffect(function () {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            var newHeight = Math.min(textAreaRef.current.scrollHeight, maxHeight);
            textAreaRef.current.style.height = "".concat(newHeight, "px");
        }
    }, [value, maxHeight]);
    var handleChange = function (event) {
        onChange(event.target.value);
    };
    return (React.createElement("textarea", { ref: textAreaRef, value: value, onChange: handleChange, onKeyDown: onKeyDown, placeholder: placeholder, rows: 1, style: { overflow: "hidden", resize: "none" } }));
};
export default AutosizeTextArea;
