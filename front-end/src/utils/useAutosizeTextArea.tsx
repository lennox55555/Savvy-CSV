import React, { useRef, useEffect } from "react";

interface AutosizeTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  maxHeight: number;
  placeholder?: string;
}

const AutosizeTextArea: React.FC<AutosizeTextAreaProps> = ({
  value,
  onChange,
  maxHeight,
  placeholder,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      // Reset height to calculate the scroll height correctly
      textAreaRef.current.style.height = "auto";

      // Set the height to the scroll height or maxHeight, whichever is smaller
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
      placeholder={placeholder}
      rows={1} // Ensures initial height isn't too large
      style={{ overflow: "hidden", resize: "none" }} // Prevent manual resizing
    />
  );
};

export default AutosizeTextArea;