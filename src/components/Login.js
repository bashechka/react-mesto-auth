import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as auth from '../utils/auth.js';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
// import './styles/Login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    // здесь нужно будет добавить логин
    if (!this.state.username || !this.state.password) {
      return;
    }
    auth.authorize(this.state.username, this.state.password)
      .then((data) => {
        if (data.jwt) {
          this.setState({
            username: '',
            password: ''
          }, () => {
            this.props.handleLogin(); // обновляем стейт внутри App.js
            this.props.history.push('/login'); // и переадресуем пользователя! 
          })
        }
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
      <form className="form">
         <h1 className="form__title">{this.props.title}</h1>
        <fieldset className="form__container-inputs">
          <input
            // onChange={this.handleChange}
            type="text"
            name="form__item-email"
            placeholder="Email"
            className="form__container-input form__container-input_type_email"
            minLength="2"
            maxLength="40"
            value={this.state.username}
            required />

          <span className="form__container form__container_email-error"></span>
          <input
            // onChange={this.handleChange}
            type="password"
            // id="popup__container_password"
            name="form__item-password"
            placeholder="Пароль"
            className="form__container-input form__container-input_type_password"
            value={this.state.password}
            minLength="2"
            maxLength="200"
            required />

          <span className="form__container form__container_password-error"></span>
        </fieldset>
        <button type="submit" className="form__submit-button">{this.props.buttonText}</button>
      </form>
    )
  }
}

export default withRouter(Login);
