import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm.js';
import ImagePopup from './ImagePopup.js';
import React from 'react';
import api from '../utils/Api';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import InfoTooltip from './InfoTooltips.js';
import { CurrentUserContext, defaultCurrentUser } from '../contexts/CurrentUserContext';
import Login from './Login.js';
import Register from './Register.js';
import * as auth from '../utils/auth.js';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.js'
import { BrowserRouter } from 'react-router-dom';


function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isTooltipPopupOpen, setIsTooltipPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(defaultCurrentUser);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isRegisterOk, setRegisterOk] = React.useState(false);
  const [authUser, setAuthUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  const history = useHistory();

  React.useEffect(() => {
    api.getUserInfo()
      .then((data) => {
        setCurrentUser(data)

      })
      .catch((err) => {
        setIsTooltipPopupOpen(true);
        console.log(err);
      })
  }, []);

  React.useEffect(() => {
    checkAuthUser();
  }, []);

  function checkAuthUser() {
    const token = localStorage.getItem('token');
    if (token) {
      auth.checkToken(token)
        .then((data) => {
          if (data && data.data) {
            setLoggedIn(true);
            setAuthUser(data.data);
            history.push("/");
          }
        })
        .catch((err) => {
          setIsTooltipPopupOpen(true);
          console.log(err);
        })
    }
  }

  React.useEffect(() => {
    api.getCards()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => {
        setIsTooltipPopupOpen(true);
        console.log(err);
      })
  }, [])


  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsTooltipPopupOpen(false);
    setSelectedCard({});
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleUpdateUser(userData) {
    api.updateUserInfo(userData)
      .then((userDataServer) => {
        setCurrentUser(userDataServer)
        closeAllPopups()
      })
      .catch((err) => {
        setIsTooltipPopupOpen(true);
        console.log(err);
      })
  };

  function handleUpdateAvatar(userAvatar) {
    api.updateUserAvatar(userAvatar)
      .then((userAvatarServer) => {
        setCurrentUser(userAvatarServer)
        closeAllPopups()
      })
      .catch((err) => {
        setIsTooltipPopupOpen(true);
        console.log(err);
      })
  };

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
      .catch((err) => {
        setIsTooltipPopupOpen(true);
        console.log(err);
      })
  };

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then((deletedCard) => {
        setCards((cards) => cards.filter((c) => c._id !== card._id))
      })
      .catch((err) => {
        setIsTooltipPopupOpen(true);
        console.log(err);
      })
  }

  function handleAddPlaceSubmit(card) {
    api.createNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        setIsTooltipPopupOpen(true);
        console.log(err);
      })
  }

  function handleSignOut() {
    setLoggedIn(false);
    localStorage.removeItem('token');
    history.push('/sign-in');
  }

  function handleRegister(email, password) {
    auth.register(password, email)
      .then((data) => {
        if (data && data.data) {
          setRegisterOk(true);
          // setIsTooltipPopupOpen(true);
          history.push("/sign-in");
        } else {
          setRegisterOk(false);
          // setIsTooltipPopupOpen(true);
          console.log("ERROR", data)
        }
      })
      .catch((err) => {
        // setIsTooltipPopupOpen(true);
        console.log(err)
      })
      .finally(setIsTooltipPopupOpen(true));
  }

  function handleLogin(email, password) {
    auth.authorize(password, email)
      .then((data) => {
        if (data && data.token) {
          localStorage.setItem('token', data.token);
          checkAuthUser();
        } else {
          setIsTooltipPopupOpen(true);
          console.log("ERROR", data);
        }
      })
      .catch((err) => {
        setIsTooltipPopupOpen(true);
        console.log(err);
      })
  }

  return (

    <CurrentUserContext.Provider value={currentUser}>

      <div className="page">
        <InfoTooltip
          name="tooltip"
          isOpen={isTooltipPopupOpen}
          onClose={closeAllPopups}
          isRegisterOk={isRegisterOk}
        />
        <ImagePopup
          name="open-pic"
          card={selectedCard}
          onClose={closeAllPopups}
          isOpen={isImagePopupOpen}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <PopupWithForm
          name="delete"
          title="Вы уверены?"
          buttonName="Да"
        />

        <Header signOut={handleSignOut} authUser={authUser} />

        <Switch>
          <ProtectedRoute
            exact
            path="/"
            onCardClick={handleCardClick}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
            component={Main}
            loggedIn={loggedIn}
          />
          <Route exact path="/">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
          <Route path="/sign-in">
            <Login
              title="Вход"
              buttonText="Войти"
              onLogin={handleLogin}
            />
          </Route>

          <Route path="/sign-up">
            <Register
              title="Регистрация"
              buttonText="Зарегисторироваться"
              onRegister={handleRegister}
            />
          </Route>
        </Switch>
        <Footer />
      </div>

    </CurrentUserContext.Provider>
  );
}

export default App;