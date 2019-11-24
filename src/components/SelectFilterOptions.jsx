import React from 'react';
import { Form } from 'semantic-ui-react';
import styled from '@emotion/styled';
import isSubstring from '../utils/isSubstring'

const OptionQueryInput = styled(Form.Input)({
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
  optionQuery,
  setOptionQuery,
}) => {
  const { filterName, value, handleChange } = filter;

  const onChange = (e, { name, checked }) => {
    handleChange(name, checked);
  };

  const onOptionQueryChange = (e, { value }) => {
    setOptionQuery(value);
  };

  let filteredOptions = options;
  if (options.length > 5) {
    filteredOptions = options.filter(({ text }) => isSubstring(text, optionQuery));
  }

  return (
    <Form>
      {options.length > 5 && <OptionQueryInput
        placeholder={`Search ${filterName} Options`}
        value={optionQuery}
        onChange={onOptionQueryChange} />}
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