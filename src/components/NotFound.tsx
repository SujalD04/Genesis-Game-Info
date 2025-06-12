import React, { useRef, useEffect, useState, useCallback } from 'react';

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
  const GROUND_Y = GAME_HEIGHT - CHARACTER_SIZE - 10;
  const JUMP_FORCE = -8;
  const GRAVITY = 0.4;
  const OBSTACLE_SPEED = 3;
  const OBSTACLE_SPAWN_INTERVAL = 1500; // milliseconds

  // Game state
  const [characterY, setCharacterY] = useState(GROUND_Y);
  const [velocityY, setVelocityY] = useState(0);
  const [obstacles, setObstacles] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // To start game on first interaction

  // Game loop function
  const gameLoop = useCallback(() => {
    if (gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = '#1a202c'; // Dark background
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Update character position (gravity)
    setCharacterY(prevY => {
      let newY = prevY + velocityY;
      setVelocityY(prevVelY => prevVelY + GRAVITY);

      // Prevent falling below ground
      if (newY >= GROUND_Y) {
        newY = GROUND_Y;
        setVelocityY(0);
      }
      return newY;
    });

    // Update obstacles
    setObstacles(prevObstacles => {
      const newObstacles = prevObstacles
        .map(obs => ({ ...obs, x: obs.x - OBSTACLE_SPEED }))
        .filter(obs => obs.x + OBSTACLE_WIDTH > 0); // Remove off-screen obstacles
      return newObstacles;
    });

    // Collision detection
    // Get current character position (adjusting for state update lag in loop)
    const currentCharacterY = characterY + velocityY; // Estimate next frame's Y
    const characterX = 50; // Fixed X position for character

    let collision = false;
    obstacles.forEach(obs => {
      if (
        characterX < obs.x + OBSTACLE_WIDTH &&
        characterX + CHARACTER_SIZE > obs.x &&
        currentCharacterY < obs.y + OBSTACLE_HEIGHT &&
        currentCharacterY + CHARACTER_SIZE > obs.y
      ) {
        collision = true;
      }
    });

    if (collision) {
      setGameOver(true); // Game Over!
      return;
    }

    // Draw elements
    // Draw ground
    ctx.fillStyle = '#4a5568'; // Gray ground
    ctx.fillRect(0, GROUND_Y + CHARACTER_SIZE + 5, GAME_WIDTH, 5);

    // Draw character
    ctx.fillStyle = '#63b3ed'; // Blue character
    ctx.fillRect(characterX, characterY, CHARACTER_SIZE, CHARACTER_SIZE);

    // Draw obstacles and update score
    obstacles.forEach(obs => {
      ctx.fillStyle = '#ecc94b'; // Yellow obstacles
      ctx.fillRect(obs.x, obs.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);

      // Increment score if obstacle passed
      if (characterX > obs.x + OBSTACLE_WIDTH && !obs.scored) {
        setScore(prevScore => prevScore + 1);
        obs.scored = true; // Mark as scored
      }
    });

    // Draw score
    ctx.fillStyle = '#cbd5e0'; // Light gray text
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Request next frame
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [characterY, velocityY, obstacles, score, gameOver, gameStarted]);

  // Handle jump
  const handleJump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true); // Start the game on first jump
      setScore(0); // Reset score
      setObstacles([]); // Clear existing obstacles
      setGameOver(false); // Reset game over
      setCharacterY(GROUND_Y); // Reset character position
      setVelocityY(0); // Reset velocity
      // Ensure game loop starts immediately if not running
      if (!animationFrameId.current) {
         animationFrameId.current = requestAnimationFrame(gameLoop);
      }
    }
    if (!gameOver && characterY === GROUND_Y) { // Only jump if on ground and not game over
      setVelocityY(JUMP_FORCE);
    }
  }, [characterY, gameOver, gameStarted, gameLoop]);

  // Event listener for spacebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump]);

  // Obstacle spawning logic
  useEffect(() => {
    let obstacleTimer: NodeJS.Timeout;
    if (gameStarted && !gameOver) {
      obstacleTimer = setInterval(() => {
        setObstacles(prevObstacles => [
          ...prevObstacles,
          {
            x: GAME_WIDTH,
            y: GROUND_Y + CHARACTER_SIZE - OBSTACLE_HEIGHT,
            width: OBSTACLE_WIDTH,
            height: OBSTACLE_HEIGHT,
            scored: false, // Track if obstacle has contributed to score
          },
        ]);
      }, OBSTACLE_SPAWN_INTERVAL);
    }

    return () => clearInterval(obstacleTimer);
  }, [gameStarted, gameOver]);

  // Start/stop game loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    } else if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    // Cleanup on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameStarted, gameOver, gameLoop]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white p-4">
      {/* Animated Title */}
      <h1 className="text-6xl font-extrabold text-blue-300">
        404
      </h1>

      {/* Subtitle */}
      <h2 className="text-3xl text-blue-100 mt-4">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-lg text-blue-200 mt-6 max-w-xl text-center">
        Sorry, the page you're looking for doesn't exist. But don't worry, you can play a game!
      </p>

      {/* Game instructions */}
      {!gameStarted && !gameOver && (
        <p className="text-md text-gray-400 mt-2">
          Press <span className="font-bold text-blue-300">Spacebar</span> to start and jump!
        </p>
      )}
       {gameOver && (
        <p className="text-xl font-bold text-red-500 mt-4">
          GAME OVER! Final Score: {score}. Press Spacebar to restart.
        </p>
      )}

      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="mt-8 border-2 border-blue-500 rounded-lg shadow-lg bg-gray-900 cursor-pointer"
        onClick={handleJump} // Allow clicking to jump on mobile/tablets
      ></canvas>

      {/* Button to Redirect to Home */}
      <a
        href="/"
        className="mt-6 px-6 py-3 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md transform hover:scale-105 transition-all duration-300"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default PageNotFound;
