import App, { Container } from 'next/app'
import React from 'react'
import withReduxStore from '../lib/redux-store'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { Provider as UrqlProvider, createClient } from 'urql';

const client = createClient({
  url: '/graphql',
});

class MyApp extends App {
  constructor (props) {
    super(props)
    this.persistor = persistStore(props.reduxStore)
  }

  render () {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Container>
        <UrqlProvider value={client}>
          <Provider store={reduxStore}>
            <PersistGate
              loading={<Component {...pageProps} />}
              persistor={this.persistor}
            >
              <Component {...pageProps} />
            </PersistGate>
          </Provider>
        </UrqlProvider>
      </Container>
    )
  }
}

export default withReduxStore(MyApp)
