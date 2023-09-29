"use client";

import { useRef, useState } from 'react';
import styles from './PhotoCreator.module.scss';
import { Button } from '../ui/Button/Button';
import { ErrorMessage } from '../ui/ErrorMessage/ErrorMessage';

export const PhotoCreator: React.FC = () => {
  const [isPhotoCreating, setIsPhotoCreating] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [webcamError, setWebcamError] = useState(false);

  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setWebcamError(false);
    setIsPhotoCreating(true);

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            min: 320,
            ideal: 650,
            max: 1280
          },
          height: {
            min: 240,
            ideal: 480,
            max: 960
          },
          facingMode: "environment"
        },
        audio: false
      });

      setStream(userStream);

      if (video.current) {
        video.current.srcObject = userStream;
      }
    } catch (err) {
      if (err instanceof DOMException) {
        setWebcamError(true);
      } else {
        console.error(err);
      }
    }
  };

  const stopCamera = () => {
    setWebcamError(false);
    setIsPhotoCreating(false);
    if (video.current) {
      video.current.srcObject = null;
    }
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    setStream(null);
  };

  const takePhoto = () => {
    if (video.current && canvas.current) {
      canvas.current.width = video.current.videoWidth;
      canvas.current.height = video.current.videoHeight;
      canvas.current.getContext('2d')?.drawImage(video.current, 0, 0);
      setPhotoUrl(canvas.current.toDataURL('image/jpeg'));
    }
  };

  const downloadPhoto = () => {
    const link = document.createElement('a');
    link.download = 'photo.jpeg';
    link.href = photoUrl;
    link.click();
  };

  return (
    <div className={`relative inline-block`}>
      <div className="flex flex-center">
        {isPhotoCreating ?
          <Button onClick={() => stopCamera()}>
            Stop
          </Button> :
          <Button onClick={() => startCamera()}>
            Take a photo by the webcam
          </Button>
        }
      </div>

      <div className='flex gap my-4'>
        <div className='relative inline-flex'>
          <video ref={video} className={styles['photo-frame']} autoPlay>
            Video stream is not available.
          </video>
          {isPhotoCreating && !webcamError && <div className={styles['photo-frame__panel']}>
            <Button className='block m-auto' onClick={() => takePhoto()}>Take a photo</Button>
          </div>}
        </div>

        <div className='relative inline-flex'>
          <canvas ref={canvas} className={styles['photo-frame']}></canvas>
          {photoUrl && <div className={styles['photo-frame__panel']}>
            <Button className='block m-auto' onClick={() => downloadPhoto()}>Download</Button>
          </div>}
        </div>
      </div>

      {webcamError && <ErrorMessage>
        Something is wrong. Check if you allow to use the webcam.
      </ErrorMessage>}
    </div>
  );
};