import React from 'react';
import ReactImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css'; // Import default styles

function Gallery() {

  const styles = {
    galleryContainer: {
      maxWidth: '300px', // Adjust the width as needed
      height: '300px', // Adjust the height as needed
      margin: 'auto', // Center the gallery
    },
    galleryImage: {
      objectFit: 'cover', // Ensures images cover the container
      height: '100%',
      width: '100%',
    },
  };

  const images = [
    {
      original: "https://picsum.photos/id/1018/1000/600/",
      thumbnail: "https://picsum.photos/id/1018/250/150/",
      
    },
    {

        original: "https://picsum.photos/id/1018/1000/600/",
        thumbnail: "https://picsum.photos/id/1018/250/150/",
        
      }
  ];

  return (
    
      <ReactImageGallery items={images} showPlayButton={false} showThumbnails={false} showNav={false}  showFullscreenButton={false} showBullets={true} disableKeyDown={true}/>
  );
}

export default Gallery;
