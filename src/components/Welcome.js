import React from "react";
import { useNavigate } from "react-router-dom";
import Meta from "./Meta";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <>
      <Meta 
        title="Welcome to Picapica Photo Booth"
        description="Experience the fun of a vintage photo booth online with Picapica. Take 4 photos in a row, apply vintage film effects, and create shareable photo strips."
        canonicalUrl="/welcome"
      />
      <div className="welcome-container flex flex-col items-center justify-center h-screen text-left">
        <h1>Welcome to Pica Pica Photo Booth!</h1>
        <p>
          Experience the fun of a vintage photo booth right on picapica.app!
        </p>
        <p>
          You have <strong>3 seconds</strong> for each shot – no retakes! <br />
          Our photo booth captures <strong>4 pictures</strong> in a row, so strike your best pose and have fun!
        </p>
        <p>
          After the session, apply <strong>vintage film effects</strong> to your photos, then download your digital photo strip and share the fun!
        </p>
        <button onClick={() => navigate("/photobooth")}>START YOUR PHOTO SESSION</button>
      </div>
    </>
  );
};

export default Welcome;
