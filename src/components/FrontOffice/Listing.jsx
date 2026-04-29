import React from 'react'
import Gallery from './Gallery'
import ReactImageGallery from 'react-image-gallery'

function Listing() {
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


<>



<div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <a href=''>
  <a href="#">
    <div className='pb-3'>
    <ReactImageGallery items={images} showPlayButton={false} showThumbnails={false} showNav={false}  showFullscreenButton={false} showBullets={true} disableKeyDown={true}/>
    </div>
  

  </a>
  <div className="px-5 pb-5">
    <a href="#">
    <div className="flex items-center justify-between">
        
      <h5 className="text-l font-semibold tracking-tight text-gray-900 dark:text-white">Athena, Greece</h5>
     
    </div>
    <h5 className="text-sm font-italic text-gray-500 tracking-tight  dark:text-white">Amazing house alongside the beach</h5>

    </a>
    <div className="flex items-center mt-2.5 mb-5">
      <div className="flex items-center space-x-1 rtl:space-x-reverse">
      <img width="20" height="20" src="https://img.icons8.com/fluency/48/popular-topic.png" alt="popular-topic"/>      
      </div>
      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">4.7</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-l font-semibold text-gray-900 dark:text-white">$159.9 <span className='text-l font-italic text-yellow-500 dark:text-white'>per night</span></span>
    </div>
  </div>
  </a>
</div>
</>
  )
}

export default Listing