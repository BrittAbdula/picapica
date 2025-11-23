import React from "react";
import { useNavigate } from "react-router-dom";
import Meta from "./Meta";
import { Container, Button, Card } from "./ui";

// 步骤卡片组件
const StepCard = ({ number, title, icon, description }) => (
  <Card className="text-center hover:scale-105 transition-transform duration-300">
    <div className="w-16 h-16 bg-picapica-200 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
      {icon}
    </div>
    <div className="w-12 h-12 bg-picapica-300 rounded-full flex items-center justify-center text-white font-bold mb-4 mx-auto">
      {number}
    </div>
    <h3 className="font-bold text-picapica-900 text-xl mb-3">{title}</h3>
    <p className="text-picapica-700 leading-relaxed">{description}</p>
  </Card>
);

// FAQ卡片组件
const FAQCard = ({ question, answer }) => (
  <Card className="text-left">
    <h3 className="font-bold text-picapica-900 text-xl mb-3">{question}</h3>
    <p className="text-picapica-700 leading-relaxed">{answer}</p>
  </Card>
);

const Home = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   // 调试信息
  //   console.log('Home Component Mounted');

  //   // 检查 meta 标签
  //   setTimeout(() => {
  //     const canonicalLink = document.querySelector('link[rel="canonical"]');
  //     const metaDescription = document.querySelector('meta[name="description"]');

  //     console.log('Meta Tags Check:', {
  //       canonicalLink: canonicalLink ? canonicalLink.getAttribute('href') : 'Not found',
  //       metaDescription: metaDescription ? metaDescription.getAttribute('content') : 'Not found'
  //     });
  //   }, 1000);
  // }, []);

  return (
    <>
      <Meta
        title="Create Photo Strips Online"
        description="Picapica Photo Booth - Create beautiful photo strips online, add fun stickers, and share your memories with friends and family. Free web-based photo booth app."
        canonicalUrl="/"
      />
      {/* Hero Section */}
      <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-sm">
        <div className="max-w-4xl w-full text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold text-picapica-900 mb-4 tracking-tight">
            Picapica, Your Life in Strips
          </h1>
          <p className="text-xl text-picapica-700 mb-8 font-medium">
            💖 Online Photo Booth.
          </p>

          <div className="relative group mb-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-picapica-300 to-picapica-200 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img
              src="/photobooth-strip.png"
              alt="Pica Pica Photo Booth Strip Example"
              className="relative photobooth-strip rounded-lg shadow-picapica-medium transform transition duration-500 hover:scale-[1.02]"
              style={{ maxHeight: '400px', width: 'auto' }}
            />
          </div>

          {/* Two button options for hero section */}
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center">
            <button
              onClick={() => navigate("/photobooth")}
              className="flex-1 bg-white text-picapica-500 px-8 py-4 rounded-xl border-2 border-picapica-400 hover:bg-picapica-50 hover:border-picapica-500 hover:-translate-y-1 transition-all duration-300 font-bold text-lg shadow-sm"
            >
              Take a Photo
            </button>

            <button
              onClick={() => navigate("/templates")}
              className="flex-1 bg-picapica-500 text-white px-8 py-4 rounded-xl border-2 border-transparent hover:bg-picapica-600 hover:-translate-y-1 transition-all duration-300 font-bold text-lg shadow-picapica-soft hover:shadow-picapica-medium"
            >
              Select a Frame
            </button>
          </div>
        </div>
      </div>

      {/* Survey Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-pink-600 mb-6">
            Help Us Improve PicaPica
          </h2>
          <p className="text-gray-700 mb-6">
            We'd love to hear your thoughts! Take a quick survey to help us make PicaPica even better.
          </p>
          <a
            href="https://tally.so/r/mB0Wl4"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-pink-500 text-white px-6 py-3 rounded-xl hover:bg-pink-600 transition"
          >
            Take the Survey
          </a>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white bg-opacity-60">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-pink-600 text-center mb-12">
            How PicaPica Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold mb-4">1</div>
              <h3 className="font-bold text-pink-500 text-xl mb-3">CAPTURE</h3>
              <p className="text-gray-700">3-second countdown for each shot. PicaPica captures 4 photos in sequence - no retakes!</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold mb-4">2</div>
              <h3 className="font-bold text-pink-500 text-xl mb-3">STYLE</h3>
              <p className="text-gray-700">Apply vintage film effects to your Pica Pica Photo Booth strip after the session.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold mb-4">3</div>
              <h3 className="font-bold text-pink-500 text-xl mb-3">SHARE</h3>
              <p className="text-gray-700">Download your digital photo strip from picapica.app and share the fun with friends!</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold mb-4">4</div>
              <h3 className="font-bold text-pink-500 text-xl mb-3">ENJOY</h3>
              <p className="text-gray-700">Experience the authentic feel of a vintage photo booth with Pica Pica's digital twist.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-pink-600 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white bg-opacity-90 rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="font-bold text-pink-500 text-xl mb-3">What is Pica Pica Photo Booth?</h3>
              <p className="text-gray-700">Pica Pica Photo Booth is a web-based application that simulates the experience of a vintage photo booth, allowing you to take photo strips with classic film effects directly from your browser.</p>
            </div>

            <div className="bg-white bg-opacity-90 rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="font-bold text-pink-500 text-xl mb-3">Do I need to install anything to use picapica.app?</h3>
              <p className="text-gray-700">No! PicaPica runs entirely in your web browser. Just allow camera access when prompted, and you're ready to start capturing memories.</p>
            </div>

            <div className="bg-white bg-opacity-90 rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="font-bold text-pink-500 text-xl mb-3">Can I use Pica Pica Photo Booth on my mobile device?</h3>
              <p className="text-gray-700">Yes! PicaPica is designed to work on both desktop and mobile devices with a camera. The experience is optimized for all screen sizes.</p>
            </div>

            <div className="bg-white bg-opacity-90 rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="font-bold text-pink-500 text-xl mb-3">Are my photos stored on picapica.app?</h3>
              <p className="text-gray-700">Your photos are processed locally in your browser. Pica Pica Photo Booth doesn't store your images on any server - your memories remain private until you choose to share them.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
