import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion'; // Importing motion for subtle animations

const PageNotFound = () => {
  // Canvas and game state references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Game configuration
  const GAME_WIDTH = 600;
  const GAME_HEIGHT = 200;
  const CHARACTER_SIZE = 20;
  const OBSTACLE_WIDTH = 20;
  const OBSTACLE_HEIGHT = 30;
  const GROUND_Y = GAME_HEIGHT - CHARACTER_SIZE - 10; // Y position for character to stand on
  const JUMP_FORCE = -8; // How high the character jumps
  const GRAVITY = 0.4; // How fast the character falls
  const OBSTACLE_SPEED = 3; // How fast obstacles move
  const OBSTACLE_SPAWN_INTERVAL = 1500; // milliseconds between new obstacles

  // Game state management using React hooks
  const [characterY, setCharacterY] = useState(GROUND_Y);
  const [velocityY, setVelocityY] = useState(0);
  const [obstacles, setObstacles] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // To start game on first interaction/jump

  // Game loop function - handles all game logic updates per frame
  const gameLoop = useCallback(() => {
    // Stop game loop if game is over
    if (gameOver) {
      // Ensure the character is on the ground when game is over
      setCharacterY(GROUND_Y);
      setVelocityY(0);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return; // Exit if canvas is not available
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Exit if context is not available

    // Clear canvas for drawing new frame
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = '#1a202c'; // Dark background for the game area
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Update character's vertical position based on velocity and gravity
    setCharacterY(prevY => {
      let newY = prevY + velocityY;
      setVelocityY(prevVelY => prevVelY + GRAVITY); // Apply gravity

      // Prevent character from falling through the ground
      if (newY >= GROUND_Y) {
        newY = GROUND_Y;
        setVelocityY(0); // Stop vertical movement when on ground
      }
      return newY;
    });

    // Update obstacles' horizontal positions
    setObstacles(prevObstacles => {
      const newObstacles = prevObstacles
        .map(obs => ({ ...obs, x: obs.x - OBSTACLE_SPEED })) // Move obstacle left
        .filter(obs => obs.x + OBSTACLE_WIDTH > 0); // Remove obstacles that are off-screen
      return newObstacles;
    });

    // Collision detection logic
    const characterX = 50; // Fixed X position for the character
    const characterRight = characterX + CHARACTER_SIZE;
    const characterBottom = characterY + CHARACTER_SIZE; // Use current characterY from state

    let collisionOccurred = false;
    obstacles.forEach(obs => {
      const obsRight = obs.x + OBSTACLE_WIDTH;
      const obsBottom = obs.y + OBSTACLE_HEIGHT;

      // Check for overlap on all sides
      if (
        characterRight > obs.x &&
        characterX < obsRight &&
        characterBottom > obs.y &&
        characterY < obsBottom
      ) {
        collisionOccurred = true;
      }
    });

    // If collision detected, set game over
    if (collisionOccurred) {
      setGameOver(true);
      return; // Stop processing further game logic for this frame
    }

    // Draw game elements onto the canvas
    // Draw ground line
    ctx.fillStyle = '#4a5568'; // Gray color for the ground
    ctx.fillRect(0, GROUND_Y + CHARACTER_SIZE + 5, GAME_WIDTH, 5);

    // Draw character (blue square)
    ctx.fillStyle = '#63b3ed'; // Blue color for the character
    ctx.fillRect(characterX, characterY, CHARACTER_SIZE, CHARACTER_SIZE);

    // Draw obstacles (yellow rectangles) and update score
    obstacles.forEach(obs => {
      ctx.fillStyle = '#ecc94b'; // Yellow color for obstacles
      ctx.fillRect(obs.x, obs.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);

      // Increment score if character has passed the obstacle and it hasn't been scored yet
      if (characterX > obs.x + OBSTACLE_WIDTH && !obs.scored) {
        setScore(prevScore => prevScore + 1);
        obs.scored = true; // Mark obstacle as scored
      }
    });

    // Draw current score
    ctx.fillStyle = '#cbd5e0'; // Light gray text for score
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Request the next animation frame to continue the loop
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [characterY, velocityY, obstacles, score, gameOver]); // Dependencies for useCallback

  // Handle jump action - called on spacebar or canvas click
  const handleJump = useCallback(() => {
    // If game is over, this acts as a restart trigger
    if (gameOver) {
      setGameStarted(true); // Ensure game is marked as started
      setScore(0); // Reset score for new game
      setObstacles([]); // Clear all obstacles
      setGameOver(false); // Reset game over state
      setCharacterY(GROUND_Y); // Place character back on ground
      setVelocityY(JUMP_FORCE); // Initiate the first jump for the new game

      // Ensure the game loop starts after reset
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current); // Cancel any lingering frame
      }
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
    // If game hasn't started yet, this is the initial start
    else if (!gameStarted) {
      setGameStarted(true);
      setVelocityY(JUMP_FORCE); // Initial jump to start the game
      if (!animationFrameId.current) { // Only request if not already running
         animationFrameId.current = requestAnimationFrame(gameLoop);
      }
    }
    // Regular jump during active game, only if character is on the ground
    else if (characterY === GROUND_Y) {
      setVelocityY(JUMP_FORCE);
    }
  }, [characterY, gameOver, gameStarted, gameLoop]); // Dependencies for useCallback

  // Effect to listen for spacebar key presses
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault(); // Prevent default spacebar action (e.g., scrolling)
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // Cleanup event listener on component unmount
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump]); // Dependency on handleJump to re-bind if it changes

  // Effect for spawning obstacles at intervals
  useEffect(() => {
    let obstacleTimer: NodeJS.Timeout;
    if (gameStarted && !gameOver) { // Only spawn if game is active
      obstacleTimer = setInterval(() => {
        setObstacles(prevObstacles => [
          ...prevObstacles,
          {
            x: GAME_WIDTH, // Obstacle starts from the right edge of the canvas
            y: GROUND_Y + CHARACTER_SIZE - OBSTACLE_HEIGHT, // Obstacle height aligned with ground
            width: OBSTACLE_WIDTH,
            height: OBSTACLE_HEIGHT,
            scored: false, // Flag to track if this obstacle has already added to score
          },
        ]);
      }, OBSTACLE_SPAWN_INTERVAL);
    }

    // Cleanup interval timer on game end or component unmount
    return () => clearInterval(obstacleTimer);
  }, [gameStarted, gameOver]); // Dependencies for useEffect

  // Effect to manage the game loop's start/stop state
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Start the game loop if game is active
      animationFrameId.current = requestAnimationFrame(gameLoop);
    } else if (animationFrameId.current) {
      // Cancel the current animation frame if game is over or not started
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    // Cleanup on component unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameStarted, gameOver, gameLoop]); // Dependencies for useEffect

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 overflow-hidden">
      {/* Background gradient overlay with subtle animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-purple-900 opacity-70 blur-3xl z-0"
      />

      {/* Main content container with a subtle background and border */}
      <div className="relative z-10 p-8 rounded-xl shadow-2xl backdrop-blur-md bg-white/10 border border-blue-500/30 flex flex-col items-center gap-8 max-w-4xl w-full">
        {/* Large 404 Title */}
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.5 }}
          className="text-8xl md:text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg"
          style={{
            WebkitTextStroke: '2px #63b3ed', // Blue stroke for modern look
            fontFamily: 'Inter, sans-serif', // Use Inter font
          }}
        >
          404
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.7 }}
          className="text-3xl md:text-4xl text-blue-100 font-semibold text-center"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-lg md:text-xl text-blue-200 max-w-2xl text-center leading-relaxed"
        >
          Oops! It seems you've stumbled upon a digital void. While we search for the page,
          why not enjoy a quick game to pass the time?
        </motion.p>

        {/* Game instructions/status messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-center font-bold"
        >
          {!gameStarted && !gameOver && (
            <p className="text-xl text-gray-300">
              Press <span className="text-blue-400 px-2 py-1 rounded-md bg-white/20">Spacebar</span> to Start!
            </p>
          )}
          {gameOver && (
            <p className="text-2xl text-red-400">
              GAME OVER! Score: <span className="text-purple-300">{score}</span>. Press <span className="text-blue-400 px-2 py-1 rounded-md bg-white/20">Spacebar</span> to Restart.
            </p>
          )}
        </motion.div>

        {/* Game Canvas */}
        <motion.canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="mt-4 border-4 border-blue-500 rounded-lg shadow-xl cursor-pointer bg-gray-900 transition-all duration-300 hover:border-blue-300"
          onClick={handleJump} // Allows clicking to jump on mobile/tablets
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10, delay: 1.0 }}
        ></motion.canvas>

        {/* Button to Redirect to Home */}
        <motion.a
          href="/"
          className="mt-6 px-10 py-4 text-xl bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 font-bold tracking-wide border-2 border-blue-700"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10, delay: 1.4 }}
        >
          Go Back Home
        </motion.a>
      </div>
    </div>
  );
};

export default PageNotFound;
