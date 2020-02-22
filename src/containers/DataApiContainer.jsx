import React, { Fragment } from 'react';
import { Loader } from 'semantic-ui-react';

// A general component to render the returned data of an api call.
const DataApiContainer = ({
  apiState,
  showLoader = true,
  children
}) => {

  if (apiState.isError) {
    // throw api error
    if (apiState.error instanceof Error) {
      throw apiState.error;
    } else {
      throw new Error(apiState.error);
    }
  } else if (apiState.isLoading) {
    // show loader
    return (
      <Loader active={showLoader} />
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
