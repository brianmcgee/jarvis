import React, { ReactElement } from 'react'
import '@/styles/globals.css'
import { useApollo } from '@/lib/graphql/client/apollo'
import { ApolloProvider } from '@apollo/client'
import { AppProps } from 'next/app'

const MyApp = ({ Component, pageProps }: AppProps): ReactElement | null => {
    const apolloClient = useApollo(pageProps.initialApolloState)
    return (
        <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
        </ApolloProvider>
    )
}

export default MyApp
