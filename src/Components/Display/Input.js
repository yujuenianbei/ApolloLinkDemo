// React
import React from 'react'

export default class Input extends React.Component {

	constructor(props) {
		super(props)
		this.state = { value: '' }
	}

	componentWillMount() {
		this.setState({ value: this.props.value })
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.value !== nextProps.value) {
			this.setState({ value: nextProps.value })
		}
	}

	handleChange = (e) => {
		this.setState({ value: e.target.value })
		this.props.onChange(e.target.name, e.target.value)
	}

	render() {
		const { align, disabled, name, onKeyPress, placeholder, type } = this.props
		return (
			<input
				disabled={disabled}
				name={name}
				onChange={this.handleChange}
				onKeyPress={onKeyPress}
				placeholder={placeholder}
				ref={(input) => { this.inputFocus = input }}
				style={{ textAlign: align }}
				type={type}
				value={this.state.value}
			/>
		)
	}

}
