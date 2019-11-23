import React from 'react';

export function getSelectedOptions(value) {
  return Object.keys(value).filter(k => value[k]);
}

export function isActive(value) {
  return Object.values(value).some(option => option);
}

export function isSameValue(prevValue, currentValue) {
  if (!prevValue) {
    return !isActive(currentValue);
  }
  const keys = Object.keys(currentValue);
  let key;
  for (key of keys) {
    if (currentValue[key] && !prevValue.hasOwnProperty(key)) {
      return false;
    }
    if ((currentValue[key] !== prevValue[key]) && prevValue.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

function useFilter(initialState, filterName, defaultData, textRepFunction) {
  const [value, set] = React.useState(initialState);

  const clear = () => {
    set(prevValue => {
      const newValue = { ...prevValue };
      Object.keys(newValue).forEach(k => newValue[k] = defaultData);
      return newValue;
    });
  }

  const handleChange = (name, dataValue) => {
    set(prevValue => {
      return { ...prevValue, [name]: dataValue };
    });
  }

  const getTextRep = () => {
    return textRepFunction(value, filterName);
  }

  return { value, set, clear, handleChange, getTextRep };
}

export default useFilter;