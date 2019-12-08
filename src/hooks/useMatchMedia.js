import { useState, useEffect } from 'react';
/**
 * 
 * @param {string} mediaQuery The string representing the media query to parse, e.g. (min-width:500px)
 * @return {boolean} A Boolean that is true if the document currently matches the media query, or false if not.
 */
function useMatchMedia(mediaQuery) {
  const [matches, setMatches] = useState(() => matchMedia(mediaQuery).matches);

  useEffect(() => {
    const mediaQueryList = matchMedia(mediaQuery);

    const onChange = (event) => {
      setMatches(event.matches);
    };

    mediaQueryList.addListener(onChange);

    return(() =>{
      mediaQueryList.removeListener(onChange);
    })
  }, [mediaQuery]);

  return matches;
}

export default useMatchMedia;