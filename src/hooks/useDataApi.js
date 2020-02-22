import { useEffect, useReducer, useState } from 'react';
import * as apiFunctions from '../api';

/**
 * A reducer to manage the state of data fetching from api
 * @param {Object} state The state.
 * @param {Boolean} state.isLoading Whether fetching the data is in progress.
 * @param {Boolean} state.isError Whether fetching the data failed.
 * @param {Object} state.error The error object.
 * @param {Object} state.data The resulting data fromo api call.
 * @param {Object} action The action to change the state.
 * @param {string} action.type The str description of the action.
 * @param {Object} [action.payload] The action's data.
 * @return {Object} A new state.
 */
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload.data,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
        error: action.payload.error
      };
    default:
      return state;
  }
};

/**
 * A custom hook for data fetching from api.
 * @param {String} functionName The name of the api function to call.
 * @param {Object[]} initialFunctionArgs The list of args for the api function.
 * @param {Object} initialData The initial data to be returned by api function.
 * @return {Object[]} The state of the api function call and a function
 * to update the list of args.
 */
const useDataApi = (functionName, initialFunctionArgs, initialData) => {
  // The list of args and a function to update the list.
  const [functionArgs, setFunctionArgs] = useState(initialFunctionArgs);
  // state is a React state of the api function call. dispatch is used to send
  // an action to dataFetchReducer to update the state.
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    error: null,
    data: initialData,
  });

  useEffect(() => {
    // a boolean flag to prevent setting React state when the component is unmounted
    let didCancel = false;

    const fetchData = async () => {
      // dispatch fetching data is in progress
      dispatch({ type: 'FETCH_INIT' });

      try {
        // fetch data from api
        const data = await apiFunctions[functionName](...functionArgs);
        if (!didCancel) {
          // dispatch fetching data succeeded 
          dispatch({ type: 'FETCH_SUCCESS', payload: { data: data } });
        }
      } catch (error) {
        if (!didCancel) {
          // dispatch fetching data failed
          dispatch({ type: 'FETCH_FAILURE', payload: { error: error } });
        }
      }
    };

    fetchData();

    // return a clean up function for when the component unmounts
    return () => {
      // a true boolean flag to let data fetching logic know that it shouldn't set React state
      didCancel = true;
    };
  }, [functionName, functionArgs]);

  return [state, setFunctionArgs];
};

export default useDataApi;
