import React from 'react';

/**
 * @param {Object} checkboxes The object representation of a list of checkboxes,
 * where the keys are the different options, and each value is a boolean(whether the option is selected).
 * @return {string[]} The list of selected options.
 */
export function getSelectedOptions(checkboxes) {
  return Object.keys(checkboxes).filter(k => checkboxes[k]);
}

/**
* @param {Object} initialState The inital filter object, where the keys are the filter options and values are the filter values.
* @param {string} filterName The name of the filter. It also used as the default text representation,
* when all filter values are the default filter value.
* @param {(boolean|string)} defaultData The default filter value.
* @param {Function} textRepFunction The function to generate the text representation of the filter object.
* @return {Object} An object that encapsulates the fitler object state along with other methods to handle state changes
* and get other useful informations about the state.
*/
function useFilter(initialState, filterName, defaultData, textRepFunction) {
  // value is the filter object, set is the function that updates it
  const [value, set] = React.useState(initialState);

  /**
   * Assign the default filter value to all filter options.
   */
  const clear = () => {
    set(prevValue => {
      const newValue = { ...prevValue };
      Object.keys(newValue).forEach(option => newValue[option] = defaultData);
      return newValue;
    });
  }

  /**
   * Callback for when a filter value has changed in order
   * to set the filter option to a new filter value.
   * @param {string} option The filter option.
   * @param {(string|boolean)} dataValue The new filter value.
   */
  const handleChange = (option, dataValue) => {
    set(prevValue => {
      return { ...prevValue, [option]: dataValue };
    });
  }

  /**
   * @return {string} The text representation of the filter object.
   */
  const getTextRep = () => {
    return textRepFunction(value, filterName);
  }

  /**
 * 
 * @return {boolean} Whether any of the filter values does not equal the default filter value.
 */
  const isActive = () => {
    return Object.values(value).some(v => v !== defaultData);
  }

  /**
   *
   * @param {Object} otherValue The other filter object that is of the same type as this filter object.
   * @return {boolean} Whether the other filter object is the same as this filter object.
   */
  const isSameValue = (otherValue) => {
    if (!otherValue) {
      return !isActive();
    }
    const options = Object.keys(value);
    let option;
    for (option of options) {
      if (value[option] && !otherValue.hasOwnProperty(option)) {
        return false;
      }
      if ((value[option] !== otherValue[option]) && otherValue.hasOwnProperty(option)) {
        return false;
      }
    }
    return true;
  }

  return { filterName, value, set, clear, handleChange, getTextRep, isActive, isSameValue };
}

export default useFilter;