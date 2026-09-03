import React from 'react'

function DocPreview({label,url}:any) {
    const isImage=url?.match(/\.(jpg|jpeg|png|webp)$/i)
    const isPdf=url?.endsWith(".pdf")
  return (
    <div className='bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm text-gray-900'>
      <div className='px-4 py-2 border-b border-gray-200 text-sm font-semibold text-gray-900 bg-gray-100/80'>
        {label}
      </div>
      <div className='h-52 flex items-center justify-center bg-white'>
{!url && <span className='text-xs text-gray-500 font-medium'>Document Not Uploaded</span>}

{isImage && <img src={url} className='w-full h-full object-cover'/>}

{isPdf && <iframe src={url} className='w-full h-full'/>}

      </div>
      {url && (
    <a
    href={url}
    target="_blank"
    className="block text-center text-xs py-2 font-bold text-purple-700 hover:bg-purple-50 transition border-t border-gray-100"
    >Open Full Document</a>
)}
      
    </div>
  )
}

export default DocPreview
