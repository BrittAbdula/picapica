import React from 'react';
import { Helmet } from 'react-helmet-async';

const GoogleAnalytics = () => {
  return (
    <Helmet>
      {/* Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-KP5VEHQ08E"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KP5VEHQ08E');
        `}
      </script>
    </Helmet>
  );
};

export default GoogleAnalytics; 