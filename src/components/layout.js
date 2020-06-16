import React from 'react';
import PropTypes from 'prop-types';
import BaseLayout from '@arcblock/ux/lib/Layout';

export default function Layout({ title, children, contentOnly }) {
  const links = [
    { url: '/', title: 'Home' },
    { url: '/profile', title: 'Profile' },
    { url: '/payment', title: 'Payment' },
  ];

  return (
    <BaseLayout
      title={title}
      brand={window.env.appName}
      links={links}
      contentOnly={contentOnly}
      baseUrl={window.env.baseUrl}>
      {children}
    </BaseLayout>
  );
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  contentOnly: PropTypes.bool,
};

Layout.defaultProps = {
  contentOnly: false,
};
