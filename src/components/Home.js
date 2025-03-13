import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="background-gradient h-screen flex flex-col justify-center items-center text-center">
      <div className="home-container">
        <h1 className="text-5xl font-bold text-pink-600 mb-4">Pica Pica Photo Booth</h1>
        <p className="text-lg text-gray-700 mb-6">
          Welcome to picapica.app - Your personal web-based photo booth with vintage film effects!
        </p>      
        <p className="text-md text-gray-600 mb-4">
          Capture moments, apply beautiful filters, and create shareable photo strips instantly.
        </p>
          
        <img 
          src="/photobooth-strip.png" 
          alt="Pica Pica Photo Booth Strip Example" 
          className="photobooth-strip"
        />
        
        <button 
          onClick={() => navigate("/welcome")} 
          className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition"
        >
          START YOUR PHOTO BOOTH
        </button>

        <footer className="mt-8 text-sm text-gray-600">
          {/*made by{" "}
           <a
            href="https://agneswei.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: "pink", textDecoration: "none" }}>agneswei</a> */}
          <p>© 2025 picapica.app - The Web Photo Booth App</p>
        </footer>
      </div>
    </div>
    );
  };

export default Home;
