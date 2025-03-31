// src/components/PrivacyPolicy.js

import React from 'react';
import '../App.css';
import Meta from './Meta';

const PrivacyPolicy = () => {
  return (
    <>
      <Meta 
        title="Privacy Policy"
        description="Picapica Photo Booth Privacy Policy - Learn how we collect, use, and protect your information when you use our online photo booth service."
        canonicalUrl="/privacy-policy"
      />
      <div className="background-gradient min-h-screen py-8 px-4 overflow-auto">
        <div className="privacy-container">
          <div className="text-center mb-8">
            <img 
              src="/images/picapica-icon.svg" 
              alt="Pica Pica Logo" 
              className="w-20 h-20 mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold text-pink-600 mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-500">Last Updated: March 2025</p>
          </div>
          
          <div className="privacy-section">
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">Our Commitment to Privacy</h2>
            <p className="text-lg text-gray-700 mb-4">
              At Pica Pica Photo Booth, your privacy is our top priority. We've designed our application with privacy in mind from the ground up.
            </p>
          </div>
          
          <div className="privacy-section">
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">Data Collection</h2>
            <div className="flex items-start mb-3">
              <div className="text-pink-600 mr-3 mt-1">✓</div>
              <p className="text-lg text-gray-700">
                <strong>Minimal Personal Data Collection:</strong> We do not track, collect, or store any personal identification data like emails, names, or accounts.
              </p>
            </div>
            <div className="flex items-start mb-3">
              <div className="text-pink-600 mr-3 mt-1">✓</div>
              <p className="text-lg text-gray-700">
                <strong>Local Processing:</strong> Most photos taken are processed locally on your device when possible.
              </p>
            </div>
            <div className="flex items-start mb-3">
              <div className="text-pink-600 mr-3 mt-1">✓</div>
              <p className="text-lg text-gray-700">
                <strong>No Cookies or Trackers:</strong> We do not use cookies, tracking pixels, or any other tracking technologies on our site.
              </p>
            </div>
          </div>
          
          <div className="privacy-section">
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">Camera Access</h2>
            <p className="text-lg text-gray-700 mb-4">
              Our application requires access to your device's camera to function. This access is used solely for the purpose of capturing photos within the application. Camera access is:
            </p>
            <ul className="list-disc pl-8 text-lg text-gray-700 mb-4">
              <li>Only active when you're using the photo booth feature</li>
              <li>Automatically disabled when you leave the photo booth or close the application</li>
              <li>Never used to record or transmit video/images without your knowledge</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">Photo Sharing & Storage</h2>
            <p className="text-lg text-gray-700 mb-4">
              When you choose to use our sharing features (such as generating a shareable link, pixel art transformation, or getting a four frames interpretation), please be aware of the following:
            </p>
            <ul className="list-disc pl-8 text-lg text-gray-700 mb-4">
              <li><strong>Temporary Server Storage:</strong> Your photos will be uploaded to our secure servers to enable sharing functionality.</li>
              <li><strong>7-Day Retention Policy:</strong> All uploaded photos and their derivatives (pixel art versions, AI interpretations) are automatically deleted after 7 days.</li>
              <li><strong>No Third-Party Sharing:</strong> We do not sell, share, or provide your photos to any third parties except as necessary to provide the requested service.</li>
              <li><strong>Public Access:</strong> Anyone with your generated link can access your shared photo during the 7-day period - please share links responsibly.</li>
            </ul>
            <p className="text-lg text-gray-700 mb-4">
              If you prefer not to have your photos temporarily stored on our servers, you can still use the local download functionality without generating a shareable link.
            </p>
          </div>
          
          <div className="privacy-section">
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">AI Features</h2>
            <p className="text-lg text-gray-700 mb-4">
              Our app offers AI-powered features like "PicaPica My Moments" interpretation and pixel art transformation. When using these features:
            </p>
            <ul className="list-disc pl-8 text-lg text-gray-700 mb-4">
              <li>Your photos are processed by our AI services to generate interpretations or transformations</li>
              <li>The results of these analyses are subject to the same 7-day deletion policy</li>
              <li>We do not use your photos to train AI models or for any purpose other than providing the requested feature</li>
            </ul>
          </div>
          
          <div className="privacy-section">
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">Additional Information</h2>
            <p className="text-lg text-gray-700 mb-4">
              For more details about how we operate our service, please review our <a href="/terms-of-service" className="text-pink-600 hover:underline">Terms of Service</a>.
            </p>
          </div>
          
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              By using Pica Pica Photo Booth, you agree to the privacy practices described in this policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
