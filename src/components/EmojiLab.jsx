import { useState, useRef, useEffect } from "react";

export default function ChemistryLabGame() {
  // Base elements
  const baseElements = [
    { id: "mariia", emoji: "👸🏼", name: "Mariia" },
    { id: "diego", emoji: "👨🏾‍🚀", name: "Diego" },
    { id: "music", emoji: "🎶", name: "Music" },
  ];

  // Combinations and their results
  const combinations = {
    "diego+mariia": {
      id: "together",
      emoji: "❤️",
      name: "Together",
      message: "Diego + Mariia = laugh and love!",
    },
    "mariia+diego": {
      id: "together",
      emoji: "❤️",
      name: "Together",
      message: "Mariia + Diego = laugh and love!",
    },
    "mariia+music": {
      id: "dancing",
      emoji: "💃",
      name: "Dancing",
      message: "Mariia + Music = Dancing!",
    },
    "music+mariia": {
      id: "dancing",
      emoji: "💃",
      name: "Dancing",
      message: "Music + Mariia = Dancing!",
    },
    "diego+music": {
      id: "dancing",
      emoji: "🕺",
      name: "Dancing",
      message: "Diego + Music = Dancing!",
    },
    "music+diego": {
      id: "dancing",
      emoji: "🕺",
      name: "Dancing",
      message: "Diego + Music = Dancing!",
    },
    "dancing+together": {
      id: "mariadiego",
      emoji: "💑",
      name: "Maria & Diego",
      message: "Dancing + Together = Maria & Diego!",
    },
    "together+dancing": {
      id: "mariadiego",
      emoji: "💑",
      name: "Maria & Diego",
      message: "Together + Dancing = Maria & Diego!",
    },
    "mariadiego+together": {
      id: "magic",
      emoji: "🪄",
      name: "Magic",
      message: "Maria & Diego + Together = Magic!",
    },
    "together+mariadiego": {
      id: "magic",
      emoji: "🪄",
      name: "Magic",
      message: "Together + Maria & Diego = Magic!",
    },
    "mariadiego+hugs": {
      id: "love",
      emoji: "💞",
      name: "Stars in Love",
      message: "Maria & Diego + Hugs = Stars in Love!",
    },
    "hugs+mariadiego": {
      id: "love",
      emoji: "💞",
      name: "Stars in Love",
      message: "Hugs + Maria & Diego = Stars in Love!",
    },
    "magic+diego": {
      id: "math",
      emoji: "🧮",
      name: "Math",
      message: "Magic + Diego = Math!",
    },
    "diego+magic": {
      id: "math",
      emoji: "🧮",
      name: "Math",
      message: "Diego + Magic = Math!",
    },
    "magic+mariia": {
      id: "biology",
      emoji: "🧬",
      name: "Biology",
      message: "Magic + Mariia = Biology!",
    },
    "mariia+magic": {
      id: "biology",
      emoji: "🧬",
      name: "Biology",
      message: "Mariia + Magic = Biology!",
    },
    "math+biology": {
      id: "physics",
      emoji: "⚛️",
      name: "Physics",
      message: "Math + Biology = Physics!",
    },
    "biology+math": {
      id: "physics",
      emoji: "⚛️",
      name: "Physics",
      message: "Biology + Math = Physics!",
    },
    "physics+diego": {
      id: "hugs",
      emoji: "🤗",
      name: "Hugs",
      message: "Physics + Diego = Hugs!",
    },
    "diego+physics": {
      id: "hugs",
      emoji: "🤗",
      name: "Hugs",
      message: "Diego + Physics = Hugs!",
    },
    "biology+mariia": {
      id: "greeneyes",
      emoji: "💚",
      name: "Green Eyes",
      message: "Biology + Mariia = Green Eyes!",
    },
    "mariia+biology": {
      id: "greeneyes",
      emoji: "💚",
      name: "Green Eyes",
      message: "Mariia + Biology = Green Eyes!",
    },
    "biology+diego": {
      id: "browneyes",
      emoji: "🟤",
      name: "Brown Eyes",
      message: "Biology + Diego = Brown Eyes!",
    },
    "diego+biology": {
      id: "browneyes",
      emoji: "🟤",
      name: "Brown Eyes",
      message: "Diego + Biology = Brown Eyes!",
    },
    "greeneyes+diego": {
      id: "diegolost",
      emoji: "😍",
      name: "Diego lost in Mariia's Eyes",
      message: "Green Eyes + Diego = Diego lost in Mariia's Eyes!",
    },
    "diego+greeneyes": {
      id: "diegolost",
      emoji: "😍",
      name: "Diego lost in Mariia's Eyes",
      message: "Diego + Green Eyes = Diego lost in Mariia's Eyes!",
    },
  };

  // State for discovered elements, dragging, etc.
  const [discoveredElements, setDiscoveredElements] = useState([
    ...baseElements,
  ]);
  const [draggingElement, setDraggingElement] = useState(null);
  const [labElements, setLabElements] = useState([]);
  const [resultMessage, setResultMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [newElement, setNewElement] = useState(null);

  const labRef = useRef(null);
  const timeoutRef = useRef(null);

  // Calculate total unique elements (base + results)
  const totalElements = new Set([
    ...baseElements.map((el) => el.id),
    ...Object.values(combinations).map((c) => c.id),
  ]).size;
  const elementsLeft = totalElements - discoveredElements.length;

  // Function to handle when an element starts being dragged
  const handleDragStart = (element) => {
    setDraggingElement(element);
  };

  // Add element to the lab
  const addToLab = (element, position) => {
    if (labElements.length >= 2) {
      // If there are already 2 elements, remove the oldest one
      setLabElements((prevElements) => [
        ...prevElements.slice(1),
        { ...element, position },
      ]);
    } else {
      setLabElements((prevElements) => [
        ...prevElements,
        { ...element, position },
      ]);
    }
  };

  // Check for combinations
  useEffect(() => {
    if (labElements.length === 2) {
      const [element1, element2] = labElements;
      const combinationKey = `${element1.id}+${element2.id}`;

      if (combinations[combinationKey]) {
        const result = combinations[combinationKey];
        setResultMessage(result.message);
        setShowPopup(true);
        setNewElement(result);

        // Add to discovered elements if not already discovered
        if (!discoveredElements.some((el) => el.id === result.id)) {
          setDiscoveredElements((prev) => [...prev, result]);
        }

        // Clear the lab after a delay
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setLabElements([]);
          setShowPopup(false);
          setResultMessage("");
        }, 2000);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [labElements]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-blue-50 p-4">
      <h1 className="text-3xl font-bold mb-6 text-indigo-800">
        Mariia & Diego's Lab
      </h1>

      {/* Lab area */}
      <div
        ref={labRef}
        className="w-full max-w-md h-64 bg-gray-100 rounded-lg border-4 border-indigo-400 border-dashed mb-8 flex items-center justify-center relative"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (draggingElement) {
            const rect = labRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            addToLab(draggingElement, { x, y });
            setDraggingElement(null);
          }
        }}
      >
        {labElements.map((element, index) => (
          <div
            key={`lab-${element.id}-${index}`}
            className="absolute text-4xl transition-all duration-300"
            style={{
              left: `${element.position.x - 20}px`,
              top: `${element.position.y - 20}px`,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            {element.emoji}
          </div>
        ))}

        {labElements.length === 0 && (
          <p className="text-gray-500">Drag elements here to combine them</p>
        )}

        {/* Result Popup */}
        {showPopup && newElement && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70 rounded-lg z-20">
            <div className="text-6xl mb-2">{newElement.emoji}</div>
            <div className="text-xl font-bold text-indigo-800">
              {resultMessage}
            </div>
          </div>
        )}
      </div>

      {/* Element palette */}
      <div className="w-full max-w-md">
        <p className="text-indigo-700 font-medium mb-2">
          Elements left to discover: {elementsLeft}
        </p>
        <h2 className="text-xl font-semibold mb-2 text-indigo-700">
          Discovered Elements:
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
          {discoveredElements.map((element) => (
            <div
              key={element.id}
              className="bg-white p-3 rounded-lg shadow-md flex flex-col items-center cursor-grab hover:bg-indigo-50 transition-colors"
              draggable
              onDragStart={() => handleDragStart(element)}
            >
              <div className="text-4xl mb-1">{element.emoji}</div>
              <div className="text-sm font-medium text-center">
                {element.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold text-indigo-700 mb-2">
          How to Play:
        </h2>
        <p className="text-gray-700 mb-2">1. Drag elements to the lab area</p>
        <p className="text-gray-700 mb-2">
          2. Combine two elements to discover new ones
        </p>
        <p className="text-gray-700">3. Collect all possible combinations!</p>
      </div>
    </div>
  );
}
