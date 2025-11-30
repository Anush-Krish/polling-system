// SnapSharing.jsx
import React, { useState, useRef, useEffect } from 'react';
import './SnapSharing.css';
import { apiRequest } from '../services/api';

const SnapSharing = ({ coupleId, partnerName }) => {
  const [snaps, setSnaps] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  const [source, setSource] = useState('gallery'); // 'camera' or 'gallery'
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [lastUploadedSnap, setLastUploadedSnap] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchTodaysSnaps();
  }, [coupleId]); // Removed token from dependency array

  useEffect(() => {
    if (useCamera) {
      setVideoLoaded(false);
      setError('');

      let mediaStream;
      const enableCamera = async () => {
        try {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }

          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode },
            audio: true, // Enable audio for video recording
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
  }, [useCamera, facingMode]);

  const fetchTodaysSnaps = async () => {
    try {
      const data = await apiRequest(`/snaps/today/couple/${coupleId}`);
      setSnaps(data.data);
    } catch (error) {
      console.error('Error fetching snaps:', error);
      setError(error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 50MB for video, 5MB for image)
      const isVideo = file.type.match('video.*');
      const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;

      if (file.size > maxSize) {
        setError(`File size exceeds limit (${isVideo ? '50MB' : '5MB'})`);
        return;
      }

      setMediaType(isVideo ? 'video' : 'image');
      setSource('gallery');

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
        setLastUploadedSnap(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = () => {
    setError('');
    setVideoLoaded(false);
    setUseCamera(true);
    setSource('camera');
  };

  const flipCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Flip horizontally if using user camera for mirror effect
        if (facingMode === 'user') {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setMediaPreview(imageDataUrl);
        setMediaType('image');
        setUseCamera(false);
      } else {
        setError("Video not loaded yet. Please wait for the video to load before capturing.");
      }
    } else {
      console.error('Video or canvas element not found');
    }
  };

  const startRecording = () => {
    if (stream) {
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setRecordedChunks([]);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks(prev => [...prev, e.data]);
        }
      };

      recorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/mp4' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreview(reader.result);
          setMediaType('video');
          setUseCamera(false);
        };
        reader.readAsDataURL(blob);
      };
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const stopCamera = () => {
    setUseCamera(false);
    setIsRecording(false);
  };

  const handleUpload = async () => {
    if (!mediaPreview) {
      setError('Please select media first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      setUploadProgress(30);

      const data = await apiRequest('/snaps/upload', {
        method: 'POST',
        body: JSON.stringify({
          coupleId,
          uploadedBy: partnerName,
          imageUrl: mediaPreview,
          caption: 'Shared snap',
          mediaType,
          source
        })
      });

      setUploadProgress(100);

      setSnaps(prev => [data.data, ...prev]);
      setLastUploadedSnap(data.data);
      setMediaPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
      await apiRequest(`/snaps/${snapId}`, {
        method: 'DELETE',
        body: JSON.stringify({ partnerName })
      });

      setSnaps(prev => prev.filter(snap => snap._id !== snapId));
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
            <div className="upload-controls">
              <label className="file-label">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <span>🖼️ Gallery</span>
              </label>
              <button onClick={startCamera} className="camera-btn">
                <span>📸 Camera</span>
              </button>
            </div>
          </>
        ) : (
          <div className="camera-modal">
            <button onClick={stopCamera} className="close-camera-btn">✕</button>
            <div className="camera-container">
              <video
                ref={videoRef}
                className="camera-video"
                playsInline
                muted // Mute preview to avoid feedback
                style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
              />
              {!videoLoaded && (
                <div className="video-loading-overlay">
                  <p>Loading camera...</p>
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              <div className="camera-controls">
                <button
                  onClick={flipCamera}
                  className="control-btn flip-btn"
                  title="Flip Camera"
                >
                  🔄
                </button>

                {isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="capture-btn recording"
                    title="Stop Recording"
                  />
                ) : (
                  <div className="capture-actions">
                    <button
                      onClick={captureImage}
                      className="capture-btn"
                      title="Take Photo"
                    />
                    <button
                      onClick={startRecording}
                      className="capture-btn video-btn"
                      title="Record Video"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        {!useCamera && mediaPreview && !lastUploadedSnap && (
          <div className="image-preview">
            {mediaType === 'video' ? (
              <video src={mediaPreview} controls className="preview-media" />
            ) : (
              <img src={mediaPreview} alt="Preview" className="preview-media" />
            )}
            <div className="preview-badge">
              {source === 'camera' ? '📸 Camera' : '🖼️ Gallery'} • {mediaType === 'video' ? '🎥 Video' : '📷 Image'}
            </div>
          </div>
        )}

        {/* Last Uploaded */}
        {lastUploadedSnap && (
          <div className="image-preview">
            <p>Last uploaded snap:</p>
            {lastUploadedSnap.mediaType === 'video' ? (
              <video src={lastUploadedSnap.imageUrl} controls className="preview-media" />
            ) : (
              <img src={lastUploadedSnap.imageUrl} alt="Last uploaded" className="preview-media" />
            )}
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
          !useCamera && (
            <button
              onClick={handleUpload}
              disabled={!mediaPreview}
              className="upload-btn"
            >
              Share Snap
            </button>
          )
        )}
      </div>

      <div className="snaps-grid">
        {snaps.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1/-1' }}>
            No snaps shared today yet. Be the first!
          </p>
        ) : (
          snaps.map(snap => (
            <div key={snap._id} className="snap-item">
              {snap.mediaType === 'video' ? (
                <video src={snap.imageUrl} controls className="snap-media" />
              ) : (
                <img src={snap.imageUrl} alt="Shared" className="snap-media" />
              )}

              <div className="snap-info">
                <div className="snap-header">
                  <span className="uploaded-by">{snap.uploadedBy}</span>
                  <span className="upload-time">
                    {new Date(snap.uploadDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="snap-meta">
                  <span className="source-badge">
                    {snap.source === 'camera' ? '📸' : '🖼️'} {snap.mediaType === 'video' ? '🎥' : '📷'}
                  </span>
                </div>
                {snap.caption && <p className="snap-caption">{snap.caption}</p>}
              </div>

              {snap.uploadedBy === partnerName && (
                <button
                  onClick={() => handleDeleteSnap(snap._id)}
                  className="delete-snap-btn"
                  title="Delete snap"
                >
                  ✕
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