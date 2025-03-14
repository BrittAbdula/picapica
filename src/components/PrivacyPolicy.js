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
                <strong>No Personal Data Collection:</strong> We do not track, collect, or store any personal data.
              </p>
            </div>
            <div className="flex items-start mb-3">
              <div className="text-pink-600 mr-3 mt-1">✓</div>
              <p className="text-lg text-gray-700">
                <strong>Local Processing:</strong> All photos taken are processed locally on your device and are not uploaded or saved to any external server.
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
