import React from 'react';
import { withRouter } from 'react-router-dom';
import DataApiContainer from './DataApiContainer';
import Person from '../components/Person';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useDataApi from '../hooks/useDataApi';

const PersonContainer = ({ match: { params: { id } } }) => {
  const [apiState] = useDataApi('getVotesForPerson', [id], null);
  useDocumentTitle(apiState.data ? apiState.data.full_name : 'Loading...');

  return (
    <DataApiContainer apiState={apiState}>
      <Person personHistory={apiState.data} />
    </DataApiContainer>
  );
};

export default withRouter(PersonContainer);
