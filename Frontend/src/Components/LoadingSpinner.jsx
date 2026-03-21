const LoadingSpinner = () => {
   return (
      <div className='flex items-center justify-center min-h-screen bg-gray-900'>
         <div className='relative'>
            <div className='w-20 h-20 border-emerald-200 border-2 rounded-full'/>
            <div className='w-20 h-20 border-emerald-500 border-t-2 animate-spin rounded-full absolute left-0 top-0'/> {/*border-t-2 means that border => 2 px thick */}
            <div className= 'sr-only'>Loading </div> {/*sr-only means that screen readers will not read this */}
         </div>
      </div>
   )
}

export default LoadingSpinner;