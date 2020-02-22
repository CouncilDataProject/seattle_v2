import React, { Fragment } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';

// A general component to render the returned data of an api call.
const DataApiContainer = ({
  apiState,
  children
}) => {
  const location = useLocation();

  if (apiState.isError) {
    // redirect to error page
    return (
      <Redirect
        to={{
          pathname: "/error",
          state: {
            error: apiState.error,
            referrer: `${location.pathname}${location.search}`
          }
        }}
      />
    );
  } else if (apiState.isLoading) {
    // show loader
    return (
      <Loader active />
    );
  } else {
    if (apiState.data) {
      // display children if there's data
      return (
        <Fragment>
          {children}
        </Fragment>
      );
    } else {
      return null;
    }
  }
};

export default DataApiContainer;
