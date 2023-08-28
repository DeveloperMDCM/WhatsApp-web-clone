
const NavigateUpDown = ({Navigate, clearIndices}) => {
    return (
      <div className="navigation-buttons flex">
      <button
        onClick={() => Navigate(-1)}
        className="p-2  text-white rounded-lg shadow hover:bg-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-chevron-up"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M6 15l6 -6l6 6"></path>
        </svg>
      </button>
      <button
        onClick={() => Navigate(1)}
        className="p-2 text-white rounded-lg shadow hover:bg-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-chevron-down"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M6 9l6 6l6 -6"></path>
        </svg>
      </button>
      <button
        onClick={() => clearIndices([])}
        className="p-2 text-white rounded-lg shadow hover:bg-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-zoom-cancel"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          stroke-inecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
          <path d="M8 8l4 4"></path>
          <path d="M12 8l-4 4"></path>
          <path d="M21 21l-6 -6"></path>
        </svg>
      </button>
    </div>
    )
  }
  
  export default NavigateUpDown