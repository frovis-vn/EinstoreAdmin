import PropTypes from 'prop-types'
import qs from 'query-string'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/button'
import '../components/form.sass'
import TextInput from '../components/textInput'
import IconEnter from '../shapes/enter'
import IconInfo from '../shapes/info'
import IconNewUser from '../shapes/newUser'
import './login.sass'

export default class Login extends Component {
	state = {
		icon: this.props.icon || '',
	}

	componentWillReceiveProps(props) {
		this.setState({
			icon: props.icon || '',
		})
		console.log(this.state.icon)
	}

	handleLogin = (event) => {
		const { returnUrl } = qs.parse(this.props.location.search, {
			ignoreQueryPrefix: true,
		})
		this.context.connector
			.auth(this.state.email, this.state.password)
			.then((auth) => {
				this.context.setAuthToken(auth.token)
				return this.context.connector.token(auth.token)
			})
			.then((token) => {
				console.log('TOKEN', token.id)
				this.context.setToken(token.jwt)
				if (returnUrl) {
					window.location.href = returnUrl
				} else {
					this.props.history.push('/')
				}
			})
			.catch((error) => {
				this.setState({
					// TODO: Handle more failures (can't connect, incorrect credentials, server error...)
					showError: true,
				})
				console.log(error)
			})
		event.preventDefault()
	}

	handleChange = (event) => {
		let change = {}
		change[event.target.name] = event.target.value
		this.setState(change)
	}

	render() {
		console.log(this.state)
		return (
			<div className="login">
				<form onSubmit={this.handleLogin} className="form">
					<div className="form-icon">
						<img
							src={this.state.icon[64]}
							srcSet={`${this.state.icon[64]}, ${this.state.icon[128]} 2x`}
							alt="Server icon"
						/>
					</div>
					<TextInput
						name="email"
						type="email"
						placeholder="E-mail"
						value={this.state.email || ''}
						onChange={this.handleChange}
					/>
					<TextInput
						name="password"
						type="password"
						placeholder="Password"
						value={this.state.password || ''}
						onChange={this.handleChange}
					/>
					<div className="login-texts">
						{this.state.showError === true ? (
							<div className="login-error">
								<IconInfo color="#ff0000" /> Incorrect credentials
							</div>
						) : null}
						<Link className="login-forgot" to="/reset-password">
							Forgotten password
						</Link>
					</div>
					<div className="login-links">
						<Link className="login-link" to="/register">
							<IconNewUser /> Register
						</Link>
						<Button>
							<IconEnter /> Login
						</Button>
					</div>
				</form>
			</div>
		)
	}
}

Login.contextTypes = {
	connector: PropTypes.object,
	token: PropTypes.string,
	setToken: PropTypes.func,
	setAuthToken: PropTypes.func,
	name: PropTypes.string,
}
