// React
import React from 'react'


export default class Button extends React.Component {

	render() {
		return (
			<div onClick={!this.props.disabled ? this.props.action : () => null} >
				{this.props.text}
			</div>
		)
	}

}
