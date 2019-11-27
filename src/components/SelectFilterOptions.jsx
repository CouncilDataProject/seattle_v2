import React from 'react';
import { Form } from 'semantic-ui-react';
import styled from '@emotion/styled';
import isSubstring from '../utils/isSubstring'

/**
 * Generate the text representation of a list of checkboxes, by appending the number of selected checkboxes
 * to the defaultText.
 * @param {Object} checkboxes The object representation of the list of checkboxes, 
 * where the keys are the different options, and each value is a boolean(whether the option is selected).
 * @param {string} defaultText The default text representation, when no checkboxes are selected.
 * @returns {string} The text representation.
 */
export const getCheckboxText = (checkboxes, defaultText) => {
  const numberOfSelectedCheckbox = Object.values(checkboxes).filter(value => value).length;
  const textRep = numberOfSelectedCheckbox ? `${defaultText} : ${numberOfSelectedCheckbox}` : defaultText;
  return textRep;
};

const OptionQueryInput = styled(Form.Input)({
  paddingRight: '.8em'
});

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