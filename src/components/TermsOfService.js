import React from 'react';
import '../App.css';
import Meta from './Meta';

const TermsOfService = () => {
  return (
    <>
      <Meta 
        title="Terms of Service"
        description="Picapica Photo Booth Terms of Service - Read about the terms and conditions for using our online photo booth service."
        canonicalUrl="/terms-of-service"
      />
      <div className="background-gradient min-h-screen py-8 px-4 overflow-auto">
        <div className="privacy-container">
          <div className="text-center mb-8">
            <img 
              src="/images/picapica-icon.svg" 
              alt="Pica Pica Logo" 
              className="w-20 h-20 mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold text-pink-600 mb-2">Terms of Service</h1>
            <p className="text-sm text-gray-500">Last Updated: March 2025</p>
          </div>
          
          <div className="privacy-section">
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">Acceptance of Terms</h2>
            <p className="text-lg text-gray-700 mb-4">
              By accessing or using Pica Pica Photo Booth, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </div>
          
          <div className="privacy-section">
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">Service Description</h2>
            <p className="text-lg text-gray-700 mb-4">
              Pica Pica Photo Booth is a web application that allows users to take photos using their device's camera and apply various filters and effects to those photos.
            </p>
            <div className="flex items-start mb-3">
              <div className="text-pink-600 mr-3 mt-1">✓</div>
              <p className="text-lg text-gray-700">
                <strong>Local Processing:</strong> All photo processing occurs locally on your device.
              </p>
            </div>
            <div className="flex items-start mb-3">
              <div className="text-pink-600 mr-3 mt-1">✓</div>
              <p className="text-lg text-gray-700">
                <strong>No Account Required:</strong> You can use our service without creating an account.
              </p>
            </div>
          </div>
          
          <div className="privacy-section">
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">User Responsibilities</h2>
            <p className="text-lg text-gray-700 mb-4">
              When using Pica Pica Photo Booth, you agree to:
            </p>
            <ul className="list-disc pl-8 text-lg text-gray-700 mb-4">
              <li>Use the service in compliance with all applicable laws</li>
              <li>Not use the service for any illegal or unauthorized purpose</li>
              <li>Not attempt to interfere with or disrupt the service or its servers</li>
              <li>Not attempt to access features or areas of the service that you are not authorized to access</li>
            </ul>
          </div>
          
          <div className="privacy-section">
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">Intellectual Property</h2>
            <p className="text-lg text-gray-700 mb-4">
              The Pica Pica Photo Booth application, including its design, logo, and code, is the property of Pica Pica and is protected by copyright and other intellectual property laws.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Photos taken by users using our application belong to the users. We do not claim any ownership rights over these photos.
            </p>
          </div>
          
          <div className="privacy-section">
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">Limitation of Liability</h2>
            <p className="text-lg text-gray-700 mb-4">
              Pica Pica Photo Booth is provided "as is" without any warranties, expressed or implied. We do not guarantee that the service will be error-free or uninterrupted.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              In no event shall Pica Pica be liable for any damages arising out of the use or inability to use the service.
            </p>
          </div>
          
          <div className="privacy-section">
            <h2 className="text-2xl font-semibold text-pink-600 mb-3">Related Policies</h2>
            <p className="text-lg text-gray-700 mb-4">
              Please also review our <a href="/privacy-policy" className="text-pink-600 hover:underline">Privacy Policy</a>, which outlines our practices regarding the collection and use of your information.
            </p>
          </div>
          
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              By using Pica Pica Photo Booth, you agree to these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService; 