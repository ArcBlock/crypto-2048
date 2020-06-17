import React from 'react';
import PropTypes from 'prop-types';

import Center from '@arcblock/ux/lib/Center';

export default function Layout({ children }) {
  return <Center>{children}</Center>;
}

Layout.propTypes = {
  children: PropTypes.any.isRequired,
};

Layout.defaultProps = {};
