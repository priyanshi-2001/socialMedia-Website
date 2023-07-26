import {Routes,Route,BrowserRouter} from 'react-router-dom';
import Landing from './Components/Landing';
import Login from './Components/Login';
import MultiStepForm from './Components/MultiStepForm';
import HomeScreen from './Components/HomeScreen'
import CreatePost from './Components/CreatePost';
import socketIO from 'socket.io-client';
import Message from './Components/Message';
import MessagesMainWindow from './Components/MessagesMainWindow';
import MyNetwork from './Components/MyNetwork';
import ViewProfile from './Components/ViewProfile';
import Notifications from './Components/Notifications';
import MyProfile from './Components/MyProfile';
const socket = socketIO.connect('http://localhost:8000');
function App() {
  return (
    <BrowserRouter>
    <Routes>

    <Route path="" element={<Landing/>}></Route>
    <Route path="/login" element={<Login/>} ></Route>
    <Route path="/signup" element={<MultiStepForm/>} ></Route>
    <Route path="/homeScreen" element={<HomeScreen/>}></Route>
    <Route path="/createPosts" element={<CreatePost/>}></Route>
    <Route path="/Messages" element={<Message/>}></Route>
    <Route path="/messagesWindow" element={<MessagesMainWindow/>}></Route>
    <Route path="/MyNetwork" element={<MyNetwork/>}></Route>
    <Route path="/viewProfile/:id/:userId" element={<ViewProfile/>}></Route>
    <Route path="/Notifications/:id" element={<Notifications/>}></Route>
    <Route path="/viewMyProfile" element={<MyProfile/>}></Route>

    

    </Routes>

    </BrowserRouter>
    
    )
}

export default App;
