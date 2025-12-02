import React, { useState } from 'react';
import { Share2, Twitter, Linkedin, MessageCircle, Facebook, Copy, Check } from 'lucide-react';

const SocialShare = ({ calculation }) => {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (!calculation) return null;

  const { results } = calculation;
  
  // Generate share content
  const shareText = `🌍 I just calculated my carbon footprint on EcoTrack!

📊 My Results:
- Monthly: ${results.total.toFixed(0)} kg CO₂
- Yearly: ${(results.perYear / 1000).toFixed(2)} tons CO₂

Taking action to reduce my environmental impact! 🌱

Calculate yours:`;

  const shareUrl = window.location.origin;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  // Social media share URLs
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Carbon Footprint - EcoTrack',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {/* Share Button */}
      <button
        onClick={handleNativeShare}
        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition shadow-lg hover:shadow-xl"
      >
        <Share2 className="w-5 h-5" />
        <span className="font-semibold">Share My Results</span>
      </button>

      {/* Share Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Share2 className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold text-gray-900">Share Your Results</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Stats Preview */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Monthly</p>
                  <p className="text-2xl font-bold text-primary">{results.total.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">kg CO₂</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Yearly</p>
                  <p className="text-2xl font-bold text-green-600">{(results.perYear / 1000).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">tons CO₂</p>
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition"
              >
                <Twitter className="w-5 h-5" />
                <span className="font-semibold">Twitter</span>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
              >
                <Linkedin className="w-5 h-5" />
                <span className="font-semibold">LinkedIn</span>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Facebook className="w-5 h-5" />
                <span className="font-semibold">Facebook</span>
              </button>

              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">WhatsApp</span>
              </button>
            </div>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span className="font-semibold">Copy Link</span>
                </>
              )}
            </button>

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Share your journey and inspire others to track their carbon footprint! 🌍
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialShare;