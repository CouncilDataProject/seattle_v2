import React, { Component } from "react";
import ReactGA from "react-ga";

export default function withTracker(WrappedComponent, options = {}) {
  const trackPage = (page) => {
    console.log(page);
    ReactGA.set({
      page,
      ...options
    });
    ReactGA.pageview(page);
  };

  const HOC = class extends Component {
    componentDidMount() {
      trackPage(window.location.hash.substr(1));
    }

    componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname;
      const nextPage = nextProps.location.pathname;

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
}
