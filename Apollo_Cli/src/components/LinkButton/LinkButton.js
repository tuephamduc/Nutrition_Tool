import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

const LinkButton = (props) => {
  const {
    history,
    location,
    match,
    staticContext,
    to,
    onClick,
    children,
    disabled,
    ...rest
  } = props;
  return !disabled ? (
    <button
      {...rest}
      onClick={(event) => {
        onClick && onClick(event);
        history.push(to);
      }}
    >
      {children}
    </button>
  ) : (
    <button disabled onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

LinkButton.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default withRouter(LinkButton);
