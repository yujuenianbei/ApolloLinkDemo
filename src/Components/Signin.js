// React
import React from 'react'
import validator from 'validator'
// GraphQL
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
// Components
import Button from './Display/Button'
import Input from './Display/Input'
import Loading from './Display/Loading'


class Signin extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			email: 'a@abc.com',
			password: '000000',
			loading: { status: false, text: '' }
		}
	}

	// AUTHENTICATION: Email authentication with password
	getAuthToken = () => {
		const { email, password } = this.state
		this.setState({ loading: { status: true, text: 'Please wait...' } })
		this.props.accountAuth({ variables: { email, password } })
			.then(({ data }) => {
				this.setState({ loading: { status: false, text: '' } })
				const { token, user } = data.accountAuth

				console.log('auth success')
				console.log(token, user)
				window.localStorage.setItem('AppDemo:login', token)
				this.props.refetch()

			})
			.catch((err) => this.setState({ loading: { status: false, text: '' } }))
	}

	// INPUT HANDLERS
	handleInput = (name, value) => this.setState({ [name]: value })

	handleKeyPress = (target) => {
		if (target.charCode === 13 && validator.isEmail(this.state.email) && this.state.password.length >= 6) {
			this.getAuthToken()
		}
	}

	// RENDER
	render() {
		return (
			<center>
				<Input
					name='email'
					onChange={(name, value) => this.handleInput(name, value)}
					onKeyPress={this.handleKeyPress}
					placeholder='Email'
					type='email'
					value={this.state.email}
				/>
				<br />
				<Input
					name='password'
					onChange={(name, value) => this.handleInput(name, value)}
					onKeyPress={this.handleKeyPress}
					placeholder='Password'
					type='password'
					value={this.state.password}
				/>
				<Loading status={this.state.loading.status} text={this.state.loading.text} />
				{!this.state.loading.status &&
					<Button
						action={() => this.getAuthToken()}
						disabled={!validator.isEmail(this.state.email) || this.state.password.length < 6}
						text='Sign in'
					/>
				}
			</center>
		)
	}
}


const accountAuthMutation = gql`
	mutation ($email: String!, $password: String!) {
		accountAuth(email: $email, password: $password) {
			token
			user {
				id
				email
				nameFirst
				nameLast
			}
		}
	}
`

export default compose(
	graphql(accountAuthMutation, { name: 'accountAuth' })
)(Signin)
