// React
import React from 'react'
// GraphQL
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
// Components
import Loading from './Components/Display/Loading'
import LoggedIn from './Components/LoggedIn'
import Signin from './Components/Signin'


class Start extends React.Component {
	render() {
		if (this.props.data && this.props.data.loading) {
			return <Loading status={true} text='Loading...' />
		}
		if (this.props.data && this.props.data.user && this.props.data.user.id) {
			return <LoggedIn />
		}
		return <Signin refetch={this.props.data.refetch} />
	}
}

const userQuery = gql`
	query User {
		user {
			id
			email
			nameFirst
			nameLast
		}
	}
`

export default compose(
	// graphql(userQuery, { props: ({ data: { refetch, user } }) => ({ refetch, user }) })
	graphql(userQuery, { options: { fetchPolicy: 'network-and-cache' } })
)(Start)
