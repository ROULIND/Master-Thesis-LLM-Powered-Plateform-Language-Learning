import React, { useState, useRef, useEffect } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const VideoTranscript = ({ videoTranscript, handleWordClick }) => {
  const [translation, setTranslation] = useState(""); // State for the translation
  const [selectedIndices, setSelectedIndices] = useState([]); // Track selected word indices
  const [isSelecting, setIsSelecting] = useState(false); // Track if the user is selecting
  const [tooltipVisible, setTooltipVisible] = useState(false); // Control tooltip visibility
  const [tooltipTargetIndex, setTooltipTargetIndex] = useState(null); // Store the last word's index for tooltip
  const words = videoTranscript.split(" ");
  const transcriptRef = useRef(null); // Reference to the transcript container
  const selectionStart = useRef(null); // Store the start index of the selection

  if (words.length > 0) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }

  // Handle translation of the selected text
  const translateSelection = async () => {
    const selectedWords = selectedIndices.map((index) => words[index]).join(" ");
    const translatedText = await handleWordClick(selectedWords); // Fetch translation for selected text
    setTranslation(translatedText);
    setTooltipVisible(true); // Show the tooltip with translation
  };

  // Handle mouse down (start of selection)
  const handleMouseDown = (index) => {
    setIsSelecting(true);
    setSelectedIndices([index]); // Start selection with the clicked word
    selectionStart.current = index; // Save the starting index
  };

  // Handle mouse enter (extend selection)
  const handleMouseEnter = (index) => {
    if (isSelecting) {
      const startIndex = selectionStart.current;
      const endIndex = index;
      // Update selectedIndices to include all indices between start and end
      const newSelection =
        startIndex < endIndex
          ? Array.from({ length: endIndex - startIndex + 1 }, (_, i) => startIndex + i)
          : Array.from({ length: startIndex - endIndex + 1 }, (_, i) => startIndex - i);
      setSelectedIndices(newSelection);
    }
  };

  // Handle mouse up (end of selection)
  const handleMouseUp = (index) => {
    setIsSelecting(false); // End selection mode
    setTooltipTargetIndex(index); // Set the tooltip target to the last word's index
    translateSelection(); // Trigger translation
  };

  // Clear selection and hide tooltip if clicked outside the transcript
  const clearSelection = (event) => {
    if (transcriptRef.current && !transcriptRef.current.contains(event.target)) {
      setSelectedIndices([]);
      setTooltipVisible(false);
      setTranslation("");
    }
  };

  // Add event listener for clicks outside the transcript
  useEffect(() => {
    document.addEventListener("mousedown", clearSelection);
    return () => {
      document.removeEventListener("mousedown", clearSelection);
    };
  }, []);

  return (
    <div
      ref={transcriptRef}
      style={{
        userSelect: "none", // Disable native text selection
      }}
    >
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <Tippy
            content={translation} // Display translation
            visible={tooltipVisible && tooltipTargetIndex === index} // Show on the correct word
            onClickOutside={() => setTooltipVisible(false)} // Hide tooltip when clicked outside
          >
            <span
              style={{
                fontFamily: "Arial",
                fontSize: "17px",
                cursor: "pointer",
                color: selectedIndices.includes(index) ? "orange" : "black", // Highlight selected words
                backgroundColor: selectedIndices.includes(index) ? "#ffd966" : "transparent", // Highlight selection background
                padding: "0 2px",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseDown={() => handleMouseDown(index)} // Start selection
              onMouseEnter={() => handleMouseEnter(index)} // Extend selection
              onMouseUp={() => handleMouseUp(index)} // End selection
            >
              {word}
            </span>
          </Tippy>{" "}
        </React.Fragment>
      ))}
    </div>
  );
};

export default VideoTranscript;
