import './SpinnerLoading.css'
const SpinnerLoading = () => {
  return (
    <div className='flex justify-center items-center h-screen w-full'>
      
    <div className="sk-chase">
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
    </div>
    </div>
  );
};

export default SpinnerLoading;
