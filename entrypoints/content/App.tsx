import { FaSolidComment } from "solid-icons/fa";

function App() {
  return (
    <>
      <div class='absolute bottom-5 w-full justify-center flex'>
        <button class='cursor-pointer bg-blue-400 w-16 h-16 rounded-full flex justify-center items-center' onClick={() => console.log('HI')}>
          <FaSolidComment size={32} color='#ffffff' />
        </button>
      </div>
    </>
  );
}

export default App;
