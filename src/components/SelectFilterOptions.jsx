import React from 'react';
import { Form } from 'semantic-ui-react';
import styled from '@emotion/styled';
import isSubstring from '../utils/isSubstring'

const SearchCommitteeInput = styled(Form.Input)({
  paddingRight: '.8em'
});

export const getCheckboxText = (filterValue, filterName) => {
  const numberOfSelectedCheckbox = Object.values(filterValue).filter(value => value).length;
  const textRep = numberOfSelectedCheckbox ? `${filterName} : ${numberOfSelectedCheckbox}` : filterName;
  return textRep;
};

const SelectFilterOptions = ({
  filter,
  options,
  searchCommitteeQuery,
  setSearchCommitteeQuery,
}) => {
  const { value, handleChange } = filter;

  const onChange = (e, { name, checked }) => {
    handleChange(name, checked);
  };

  const onSearchCommiteeChange = (e, { value }) => {
    setSearchCommitteeQuery(value);
  };

  const filteredOptions = options.filter(({ text }) => isSubstring(text, searchCommitteeQuery));

  return (
    <Form>
      <SearchCommitteeInput
        placeholder='Search Committee Names'
        value={searchCommitteeQuery}
        onChange={onSearchCommiteeChange} />
      {filteredOptions.map(option =>
        <Form.Checkbox
          key={option.name}
          label={option.text}
          name={option.name}
          checked={value[option.name]}
          onChange={onChange}
        />)}
    </Form>
  );
};

export default React.memo(SelectFilterOptions);