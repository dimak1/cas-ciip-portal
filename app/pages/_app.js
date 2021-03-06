import React from 'react';
import {QueryRenderer, fetchQuery} from 'react-relay';
import NextApp from 'next/app';

import {initEnvironment, createEnvironment} from '../lib/relay-environment';
import ErrorBoundary from '../lib/error-boundary';

export default class App extends NextApp {
  static getInitialProps = async ({Component, ctx}) => {
    const {variables = {}} = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};
    try {
      if (initEnvironment && Component.query) {
        const {environment, relaySSR} = initEnvironment();

        await fetchQuery(environment, Component.query, variables);

        return {
          variables,
          relayData: await relaySSR.getCache()
        };
      }
    } catch (error) {
      console.log(error);
    }

    return {
      variables
    };
  };

  render() {
    const {Component, variables = {}, router = {}, relayData} = this.props;
    const environment = createEnvironment(
      relayData,
      JSON.stringify({
        queryID: Component.query ? Component.query().params.name : undefined,
        variables
      })
    );
    return (
      <ErrorBoundary>
        <QueryRenderer
          environment={environment}
          query={Component.query}
          variables={{...router.query, ...variables}}
          render={({error, props}) => {
            if (error) return <div>{error.message}</div>;
            if (props)
              return <Component {...props} router={this.props.router} />;
            return <div>Loading</div>;
          }}
        />
      </ErrorBoundary>
    );
  }
}
