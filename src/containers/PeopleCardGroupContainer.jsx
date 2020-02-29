import React from 'react';
import DataApiContainer from './DataApiContainer';
import PeopleCardGroup from '../components/PeopleCardGroup';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useDataApi from '../hooks/useDataApi';

const PeopleCardGroupContainer = () => {
  const [apiState] = useDataApi('getAllPeople', null, null);
  useDocumentTitle('City Council Members');

  return (
    <DataApiContainer apiState={apiState}>
      <PeopleCardGroup people={apiState.data} />
    </DataApiContainer>
  );
}

export default PeopleCardGroupContainer;