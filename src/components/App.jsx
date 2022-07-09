import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { CurrentUserContext } from '../context/CurrentUserContext';
import Header from './Header';
import Login from './Login';
import Register from './Register';
import Main from './Main';
import Footer from './Footer';
import PopupProfil from './PopupProfil';
import PopupCard from './PopupCard';
import PopupAvatar from './PopupAvatar';
import ImagePopup from './ImagePopup';
import PopupDelete from './PopupDelete';
import InfoTooltip from './InfoTooltip';
import api from '../utils/api';
import register from '../utils/register';
import ProtectedRoute from './ProtectedRoute';
import '../index.css';


const App = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({});
    const [cardForPopup, setCardForPopup] = useState(null); 
    const [isPopupProfilOpen, setIsPopupProfilOpen] = useState(false);
    const [isPopupCardOpen, setIsPopupCardOpen] = useState(false);
    const [isPopupAvatarOpen, setIsPopupAvatarOpen] = useState(false);
    const [isPopupDelete, setIsPopupDelete] = useState(false);
    const [isDeleteCard, setIsDeleteCard] = useState({});
    const [isInfoTooltip, setIsInfoTooltip] = useState(false)
    const [cards, setCards] = useState([]);
    const [user, setUser] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState('');    
    const [userData, setUserData] = useState({});

    useEffect(() => {
         api.getInitialProfil().then((data) => {
            setCurrentUser(data);
            })
            .catch((err) => console.log(err));

        api.getInitialCards().then((data) => {
            setCards(data);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        const jwt = localStorage.getItem("JWT");
        if (jwt) {
            register.getControl(jwt)
                .then((res) => {
                    setEmail(res.data.email);
                    setUser(true);
                    setLoggedIn(true);
                    navigate("/main");
                }).catch((err) => console.log(err))
        } else {
            navigate("/sign-up");
        }
    }, [loggedIn])
    
    const handleCardLike = (card, isLiked) => {
        api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
          setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => console.log(err));
    }

    const handleLogin = () => {
        user ? navigate("/sign-in") : navigate("/sign-up");        
    }

    const registrationSubmit = (data) => {
        register.getRegistration(data)
            .then((res) => {
                console.log(res);
               if (res) {
                setUser(true);
                setIsInfoTooltip(true);
               } else {
                setUser(false);
                setIsInfoTooltip(true);
               };
            })
            .catch(err => console.log(err))
    }

    const avtorizationSubmit = (data) => {
        setEmail(data.email);
         register.getAvtorization(data)
            .then((res) => {
                if (res.token) {
                    setLoggedIn(true);
                    localStorage.setItem('JWT', res.token);
                    navigate("/main")
                } else {
                    setUser(false);
                    setIsInfoTooltip(true);
                }
                
                
            })
            .catch(err => console.log(err))
        }

    const handlePopupDelete = (card) => {
        setIsPopupDelete(true);
        setIsDeleteCard(card);
    }

    const deleteCard = () => {
        handleCardDelete();
        setIsPopupDelete(false)
    }

    const handleCardDelete = () => {
        api.deleteCard(isDeleteCard._id).then(() => {
            setCards((cards) => cards.filter((c) => c._id !== isDeleteCard._id));
            setIsPopupDelete(false);
        })
        .catch((err) => console.log(err))          
    }

    const onUpdateUser = (e) => {
        api.correctUserInfo(e).then((data) => {
            setCurrentUser(data);
            setIsPopupProfilOpen(false);
        })
        .catch((err) => console.log(err));
    }

    const onUpdateAvatar = (e) => {
        api.correctUserAvatar(e).then((data) => {
            setCurrentUser(data);
            setIsPopupAvatarOpen(false);
        })
        .catch((err) => console.log(err))
    }

    const addNewCard = (e) => {
        api.addNewCards(e).then((data) => {
            setCards((cards) => {
                return [data, ...cards];
            });
            setIsPopupCardOpen(false);
        })
        .catch((err) => console.log(err))
    }

    const onProfilPopupOpen = () => {
        setIsPopupProfilOpen(true)
    }

    const onAvatarPopupOpen = () => {
        setIsPopupAvatarOpen(true);
    }

    const onPopupCarOpen = () => {
        setIsPopupCardOpen(true)
    }

    const closeAllPopups = () => {
        setIsPopupProfilOpen(false);
        setIsPopupCardOpen(false);
        setIsPopupAvatarOpen(false);
        setIsPopupDelete(false);
        setIsInfoTooltip(false);
        setIsDeleteCard([]);
    }

    const handleCardClick = (card) => {
        setCardForPopup(card);
    }

    const onCardClick = () => {
        setCardForPopup(null);
    }

    const handleRegistration = () => {
        if (user && loggedIn) {
          localStorage.removeItem("JWT");
          setLoggedIn(false);
          setEmail('')
          navigate("/sign-in");
        } else if (user) {
          setUser(false);
          navigate("/sign-up");
        } else {
          setUser(true);
          navigate("/sign-in")
        }
      }

    return ( 
    <div className="page">
            <CurrentUserContext.Provider value={currentUser} >
                    <Header user={user} email={email} loggedIn={loggedIn} handleClick={handleRegistration} />
                    <Routes>                        
                        <Route path="/sign-up" element={<Register onSubmit={registrationSubmit} handleLogin={handleLogin} />} />
                        <Route path="/sign-in" element={<Login  onSubmit={avtorizationSubmit} />} />
                        <Route path="/main" element={
                            <ProtectedRoute loggedIn={loggedIn} >
                                <Main onEditProfile={onProfilPopupOpen} 
                                     onAddPlace={onPopupCarOpen} 
                                    onEditAvatar={onAvatarPopupOpen}                         
                                    handleCardClick={handleCardClick}
                                    cards={cards}
                                    handleCardLike={handleCardLike}
                                    handleDeleteClick={handlePopupDelete}/>
                                <Footer />
                            </ProtectedRoute>
                            } />
                        <Route path="*" element={<Register onSubmit={registrationSubmit} handleLogin={handleLogin} /> } />
                    </Routes>
                    <InfoTooltip isOpen={isInfoTooltip} onClose={closeAllPopups} user={user}  />
                    <ImagePopup card={cardForPopup} onCardClick={onCardClick} />
                    <PopupAvatar isOpen={isPopupAvatarOpen} onClose={closeAllPopups} onUpdateAvatar={onUpdateAvatar} />
                    <PopupProfil isOpen={isPopupProfilOpen} onClose={closeAllPopups} onUpdateUser={onUpdateUser} />
                    <PopupCard isOpen={isPopupCardOpen} onClose={closeAllPopups} handleNewCard={addNewCard} />
                    <PopupDelete isOpen={isPopupDelete} onClose={closeAllPopups} deleteCard={deleteCard} />       
            </CurrentUserContext.Provider>
    </div>
    );
}

export default App;