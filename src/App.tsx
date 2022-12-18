import React from 'react';
import './App.css';
import GoogleLogin from "react-google-login";
import Footer from "./components/Footer";
import Header from "./components/Header";


function App() {
    return (
        <div className="App">
            <body>
                <Header/>

                <GoogleLogin clientId={"18533555788-5hsflia0fi81s1ppisusuejpo1rbttla.apps.googleusercontent.com"}></GoogleLogin>

                <Footer/>
            </body>
        </div>
    );
}

export default App;
