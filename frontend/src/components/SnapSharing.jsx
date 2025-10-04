// SnapSharing.jsx
import React, { useState, useRef, useEffect } from 'react';
import './SnapSharing.css';

const SnapSharing = ({ coupleId, token, partnerName }) => {
  const [snaps, setSnaps] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchTodaysSnaps();
  }, [coupleId, token]);

  useEffect(() => {
    if (useCamera) {
      setVideoLoaded(false);
      setError('');

      let mediaStream;
      const enableCamera = async () => {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
          });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play();
              setVideoLoaded(true);
            };
          }
        } catch (err) {
          setError(
            "Camera access denied. Please enable camera permissions to use this feature."
          );
          console.error("Error accessing camera:", err);
          setUseCamera(false);
        }
      };

      enableCamera();

      return () => {
        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop());
        }
      };
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  }, [useCamera]);

  const fetchTodaysSnaps = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/snaps/today/couple/${coupleId}`, {
        headers: {
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch snaps');
      }

      const data = await response.json();
      setSnaps(data.data);
    } catch (error) {
      console.error('Error fetching snaps:', error);
      setError(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's an image
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = () => {
    setError('');
    setVideoLoaded(false);
    setUseCamera(true);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setImagePreview(imageDataUrl);
        setUseCamera(false);
      } else {
        setError("Video not loaded yet. Please wait for the video to load before capturing.");
      }
    } else {
      console.error('Video or canvas element not found');
    }
  };

  const stopCamera = () => {
    setUseCamera(false);
  };

  const handleUpload = async () => {
    if (!imagePreview) {
      setError('Please select an image first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // Update progress during upload
      setUploadProgress(30);
      
      const response = await fetch('http://localhost:5001/api/snaps/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          coupleId,
          uploadedBy: partnerName,
          imageUrl: imagePreview, // This is a data URL that the backend will process
          caption: 'Shared photo'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload snap');
      }

      setUploadProgress(100);

      const data = await response.json();
      setSnaps(prev => [data.data, ...prev]);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      alert('Snap uploaded successfully!');
    } catch (error) {
      console.error('Error uploading snap:', error);
      setError(error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteSnap = async (snapId) => {
    if (!window.confirm('Are you sure you want to delete this snap?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/snaps/${snapId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ partnerName })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete snap');
      }

      setSnaps(prev => prev.filter(snap => snap._id !== snapId));
      alert('Snap deleted successfully');
    } catch (error) {
      console.error('Error deleting snap:', error);
      alert(error.message);
    }
  };

  return (
    <div className="snap-sharing-container">
      <h3>Share Daily Snaps</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="upload-section">
        {!useCamera ? (
          <>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <button onClick={startCamera} className="camera-btn">
              Use Camera
            </button>
          </>
        ) : (
          // Camera view - use a modal instead of full-screen to avoid complications
          <div className="camera-modal">
            <div className="camera-modal-content">
              <div className="camera-header">
                <span>Camera</span>
                <button onClick={stopCamera} className="close-btn">✕</button>
              </div>
              <div className="camera-container">
                <video ref={videoRef} className="camera-video" playsInline />
                {!videoLoaded && (
                  <div className="video-loading-overlay">
                    <p>Loading camera...</p>
                  </div>
                )}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
              <div className="camera-controls">
                <button 
                  onClick={captureImage} 
                  className="capture-btn"
                >
                  Capture
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Show image preview when available and not using camera */}
        {!useCamera && imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
        
        {uploading ? (
          <div className="upload-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p>Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <button 
            onClick={handleUpload} 
            disabled={!imagePreview}
            className="upload-btn"
          >
            Upload Snap
          </button>
        )}
      </div>
      
      <div className="snaps-grid">
        {snaps.length === 0 ? (
          <p>No snaps shared today yet.</p>
        ) : (
          snaps.map(snap => (
            <div key={snap._id} className="snap-item">
              <div className="snap-header">
                <span className="uploaded-by">{snap.uploadedBy}</span>
                <span className="upload-time">
                  {new Date(snap.uploadDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <img src={snap.imageUrl} alt="Shared" />
              {snap.caption && <p className="snap-caption">{snap.caption}</p>}
              {snap.uploadedBy === partnerName && (
                <button 
                  onClick={() => handleDeleteSnap(snap._id)}
                  className="delete-snap-btn"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SnapSharing;