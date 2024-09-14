import React, { useRef, useEffect } from "react";

interface AutosizeTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  maxHeight: number;
  placeholder?: string;
}

const AutosizeTextArea: React.FC<AutosizeTextAreaProps> = ({
  value,
  onChange,
  onKeyDown,
  maxHeight,
  placeholder
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {

      textAreaRef.current.style.height = "auto";

      const newHeight = Math.min(textAreaRef.current.scrollHeight, maxHeight);
      textAreaRef.current.style.height = `${newHeight}px`;
    }
  }, [value, maxHeight]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <textarea
      ref={textAreaRef}
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={1}
      style={{ overflow: "hidden", resize: "none" }}
    />
  );
};

export default AutosizeTextArea;
