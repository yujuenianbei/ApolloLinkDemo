// React
import React from 'react'
import reactDom from 'react-dom'
// Apollo Link State
import defaultState from './state'
import { withClientState } from 'apollo-link-state'
import { InMemoryCache } from 'apollo-cache-inmemory'
// GraphQL
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { ApolloLink, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
// Components
import Start from './Start'


// GRAPHQL
const httpLink = new HttpLink({ uri: 'https://afgen.us/' })
const wsLink = new WebSocketLink({
	uri: 'wss://afgen.us/',
	options: { reconnect: true }
})
const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query)
		return kind === 'OperationDefinition' && operation === 'subscription'
	},
	wsLink,
	httpLink
)
const middlewareLink = new ApolloLink((operation, forward) => {
	const token = window.localStorage.getItem('AppDemo:login')
	const authorizationHeader = token ? `Bearer ${token}` : null
	operation.setContext({ headers: { authorization: authorizationHeader } })
	return forward(operation)
})
const httpLinkWithAuthToken = middlewareLink.concat(link)

// LOCAL STATE
const cache = new InMemoryCache().restore(window.__APOLLO_STATE__)
const stateLink = withClientState({
	defaults: defaultState,
	// resolvers: {
	// 	Mutation: {
	// 		local state mutations — not used in demo app
	//		`withClientState` needs to be kept, though, since Apollo Client in production app manages both client and server state
	// 	}
	// },
	cache
})

const client = new ApolloClient({
	cache,
	link: ApolloLink.from([
		stateLink,
		httpLinkWithAuthToken
	])
})

// APP
reactDom.render((
	<ApolloProvider client={client}>
		<Start />
	</ApolloProvider>
), document.querySelector('AppDemo'))

console.log('Welcome to this demo app')
