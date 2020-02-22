import React from 'react';

const layoutStyle = {
  margin: '2em'
};

const detailsStyle = {
  marginTop: '0.7em',
  whiteSpace: 'pre-wrap'
};

const sectionStyle = {
  marginTop: '0.7em'
};

class GeneralErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  // Note: error.stack is non-standard and is not on a standards track. It shouldn't be used in production,
  // but this is just displaying the stack trace.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack
  render() {
    if (this.state.errorInfo) {
      // Render error path
      return (
        <div style={layoutStyle}>
          <h2>Something went wrong.</h2>
          <div>{this.state.error.toString()}</div>
          <details style={detailsStyle}>
            <section style={sectionStyle}>
              <strong>Error Stack Trace</strong>
              <br />
              <span>{this.state.error.stack}</span>
            </section>
            <section style={sectionStyle}>
              <strong>Component Stack Trace</strong>
              <span>{this.state.errorInfo.componentStack}</span>
            </section>
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default GeneralErrorBoundary;
