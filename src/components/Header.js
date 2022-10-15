import React from "react";

import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';

function Header(props) {
  return (
    <Switch>
      <Route exact path="/">
        <header className="header">
          <div className="header__logo"></div>
          <div className="header__nav">
            <p className="header__login">{props.userData.email}</p>
            <button onClick={props.signOut} className="header__button-exit">Выйти</button>
          </div>
        </header>
      </Route>
      <Route path="/sign-in">
        <div className="header">
        <div className="header__logo"></div>
          <Link to="/sign-up" className="header__link">Регистрация</Link>
        </div>
      </Route>
      <Route path="/sign-up">
        <div className="header">
        <div className="header__logo"></div>
          <Link to="/sign-in" className="header__link">Войти</Link>
        </div>
      </Route>
    </Switch>
  );
}

export default Header;

