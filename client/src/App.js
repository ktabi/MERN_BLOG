import './App.css';
import Post from "./components/Post"
import Header from './components/Header';
import {Routes, Route} from "react-router-dom";
import Layout from './components/Layout';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';

function App() {

  return (
    <UserContextProvider>

    <Routes>
      <Route path="/" element ={<Layout />}>
        <Route index element={<Homepage />} />  
        <Route path= "/login" element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/create' element={<CreatePost />} />
        <Route path='/post/:id' element={<PostDetails/>}></Route>
      </Route>
    </Routes>

    </UserContextProvider>

  );
}

export default App;
