import React from 'react';

function useDocumentTitle(title) {
  React.useEffect(() => {
    document.title = title;

    return () => {
      document.title = 'Council Data Project - Seattle';
    };
  }, [title]);
}

export default useDocumentTitle;