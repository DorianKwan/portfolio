import React from "react";
import PropTypes from "prop-types";

const Paragraph = ({ content }) => {
  return (
    <p>{content}</p>
  );
};

Paragraph.propTypes = {
  content: PropTypes.string.isRequired,
};

export default Paragraph;
