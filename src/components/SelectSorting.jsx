import React from 'react';
import { Form } from 'semantic-ui-react';
import { ORDER_OPERATORS } from '../api/database';

export const getSortText = (sort, filterName) => {
  let by;
  let order;
  if (sort.by) {
    switch (sort.by) {
      case 'name':
        by = 'Committee';
        break;
      case 'date':
        by = 'Date';
        break;
      case 'value':
        by = 'Relevance';
        break;
      default:
        break;
    }
  }
  if (sort.order) {
    order = sort.order === ORDER_OPERATORS.asc ? 'Ascending' : 'Descending';
  }
  let textRep = filterName;
  if (by && order) {
    textRep += ` by ${by}: ${order}`;
  } else if (by) {
    textRep += ` by ${by}`;
  } else if (order) {
    textRep += ` ${order}`;
  } else {
    textRep += ' By';
  }
  return textRep;
};

const SelectSorting = ({
  filter,
  sortByOptions
}) => {
  const { value, handleChange } = filter;

  const onChange = (e, { name, value }) => {
    handleChange(name, value);
  };

  return (
    <Form>
      <Form.Field>Sort By</Form.Field>
      {sortByOptions.map(byOption =>
        <Form.Checkbox
          key={byOption.value}
          radio
          label={byOption.label}
          name='by'
          value={byOption.value}
          checked={value.by === byOption.value}
          onChange={onChange}
        />)}
      <Form.Field>Sort Order</Form.Field>
      <Form.Checkbox
        radio
        label='Ascending'
        name='order'
        value={ORDER_OPERATORS.asc}
        checked={value.order === ORDER_OPERATORS.asc}
        onChange={onChange}
      />
      <Form.Checkbox
        radio
        label='Descending'
        name='order'
        value={ORDER_OPERATORS.desc}
        checked={value.order === ORDER_OPERATORS.desc}
        onChange={onChange}
      />
    </Form>
  );
};

export default React.memo(SelectSorting);