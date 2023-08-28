const Header = ({ username, UsersOnline }) => {
  return (
   
      <div className="flex items-center sm:mx-4 mx-0">
        <img className="w-6 h-6 sm:w-12 sm:h-12 rounded-full " src="/chat1.png" />
        <div >
        <h1 className=" text-left mx-0.5 sm:mx-4 text-white text-xs whitespace-nowrap sm:text-lg font-bold"> {username}
        </h1>
        <div className=" font-bold  text-xs whitespace-nowrap">
        <span className="text-green-500 font-bold mx-1">Online:  <span className="text-white">{UsersOnline}</span></span>
       
        </div>
        </div>
       
      <div className="sm:h-3.5 sm:w-3.5 w-3 h-3 absolute sm:block hidden  left-[60px] bottom-[10px] rounded-full bg-green-500 mr-2"></div>
      </div>

  );
};

export default Header;
// https://github.com/DeveloperMDCM