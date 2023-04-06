import React, { useState, useEffect, useRef } from "react";
import "../styles/Card.css";

const CardName = ({ cardName, imageUrl, uri, layout }) => {
  const [showImage, setShowImage] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const hoverContainerRef = useRef(null);

  // display image on hover (there was an easier way to do this, but it
  // would break when combining hovering with trackpad scrolling)
  useEffect(() => {

    // on mouseMove, update Image position
    const updateImagePosition = (e) => {

      // subtract image container ref from current mouse position, adjusting
      // for scrolling
      if (hoverContainerRef.current) {
        const containerRect = hoverContainerRef.current.getBoundingClientRect();
        setImagePosition({
          x: e.pageX - containerRect.left - window.pageXOffset,
          y: e.pageY - containerRect.top - window.pageYOffset,
        });
      }
    };

    // if mouse is over image, add global event to listen
    if (showImage) {
      window.addEventListener("mousemove", updateImagePosition);
    }

    // if mouse leaves image, cleanup the eventlistener
    return () => {
      window.removeEventListener("mousemove", updateImagePosition);
    };
  }, [showImage]);

  const handleMouseEnter = () => {
    setShowImage(true);
  };

  const handleMouseLeave = () => {
    setShowImage(false);
  };

  const imageStyle = {
    top: imagePosition.y + 15 + "px",
    left: imagePosition.x + 15 + "px",
  };

  return (
    <span
      ref={hoverContainerRef}
      className="hover-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a href={uri} target="_blank" rel="noreferrer">{cardName}</a>
      {showImage && (
        <div className="hover-image" style={imageStyle}>
          <img src={imageUrl} alt={cardName} />
        </div>
      )}
    </span>
  );
};

export default CardName;