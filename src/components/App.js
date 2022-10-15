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
  const [selectedCard, setSelectedCard] = React.useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(defaultCurrentUser);
  const [cards, setCards] = React.useState([]);
  const [userData, setUserData] = React.useState({
    email: '',
    password: ''
});

  React.useEffect(() => {
    api.getUserInfo()
      .then((data) => {
        setCurrentUser(data)

      })
      .catch((err) => { console.log(err) })
  }, []);


  React.useEffect(() => {
    api.getCards()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => { console.log(err) })
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
      .catch((err) => { console.log(err) })
  };

  function handleUpdateAvatar(userAvatar) {
    api.updateUserAvatar(userAvatar)
      .then((userAvatarServer) => {
        setCurrentUser(userAvatarServer)
        closeAllPopups()
      })
      .catch((err) => { console.log(err) })
  };

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    });
  };

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then((deletedCard) => {
        setCards((cards) => cards.filter((c) => c._id !== card._id))
      })
      .catch((err) => { console.log(err) })
  }

  function handleAddPlaceSubmit(card) {
    api.createNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function handleSignOut() {
    localStorage.removeItem('jwt');
    useHistory.push('/sign-in');
}

  return (

    <CurrentUserContext.Provider value={currentUser}>

      <div className="page">
        <Header signOut={handleSignOut} userData={userData} />
        
        <Route path="/sign-in">
          <Login
            title="Вход"
            buttonText="Войти"
          />
        </Route>

        <Route path="/sign-up">
          <Register
            title="Регистрация"
            buttonText="Зарегисторироваться"
          />
        </Route>

        <Footer />
      </div>

    </CurrentUserContext.Provider>
  );
}

export default App;