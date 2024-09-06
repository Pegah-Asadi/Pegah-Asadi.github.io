const letters = ['F', 'E', 'D', 'E', 'X'];

const getRandomPosition = () => ({
  left: ${Math.random() * 80}%,
  top: ${Math.random() * 80}%,
});

const Letter = ({ letter, index, position, onDragStart, onDragEnd }) => {
  const styles = {
    F: "font-bold text-4xl bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text",
    E: index === 1 
      ? "italic text-4xl text-gray-300 [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]" 
      : "text-4xl text-blue-500 animate-pulse",
    😧 "text-4xl text-yellow-500 font-rounded drop-shadow-lg",
    X: "text-5xl text-green-500 font-mono [background-image:_linear-gradient(45deg,_#000000,_#000000_3px,_#ffffff_3px,_#ffffff_6px)]"
  };

  return (
    <div
      className={`absolute cursor-move ${styles[letter]}`}
      style={{ ...position }}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnd={onDragEnd}
    >
      {letter}
    </div>
  );
};

const Celebration = () => (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-yellow-500 rounded-full animate-float"
        style={{
          left: ${Math.random() * 100}%,
          top: ${Math.random() * 100}%,
          animationDelay: ${Math.random() * 2}s,
        }}
      />
    ))}
  </div>
);

const FedExPuzzleGame = () => {
  const [letterPositions, setLetterPositions] = React.useState([]);
  const [draggedIndex, setDraggedIndex] = React.useState(null);
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    setLetterPositions(letters.map(() => getRandomPosition()));
  }, []);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropX = e.clientX;
    const dropY = e.clientY;
    
    setLetterPositions((prev) => {
      const newPositions = [...prev];
      newPositions[draggedIndex] = {
        left: ${(dropX / window.innerWidth) * 100}%,
        top: ${(dropY / window.innerHeight) * 100}%,
      };
      return newPositions;
    });

    checkCompletion();
  };

  const checkCompletion = () => {
    const orderedPositions = letterPositions
      .map((pos, index) => ({ ...pos, letter: letters[index] }))
      .sort((a, b) => parseFloat(a.left) - parseFloat(b.left));

    const word = orderedPositions.map((item) => item.letter).join('');
    
    if (word === 'FEDEX') {
      setIsComplete(true);
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-gray-100" 
      onDragOver={handleDragOver} 
      onDrop={handleDrop}
    >
      {letters.map((letter, index) => (
        <Letter
          key={index}
          letter={letter}
          index={index}
          position={letterPositions[index]}
          onDragStart={handleDragStart}
          onDragEnd={checkCompletion}
        />
      ))}
      {isComplete && <Celebration />}
      {isComplete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p>You did it! You've successfully arranged the letters to spell "FedEx"!</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setIsComplete(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<FedExPuzzleGame />, document.getElementById('root'));
