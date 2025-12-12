import React, { useState, useEffect } from 'react';
import Card from './components/Card';
import useSecurity from './hooks/useSecurity';
import RoleSelector from './components/RoleSelector';
import { Trophy, RefreshCw, Siren } from 'lucide-react';
import confetti from 'canvas-confetti';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const POINTS = {
  Raja: 60,
  Rani: 50,
  Minister: 40,
  Sainik: 30,
  Naagarik: 20,
  Chorrr: 70,
};

const INITIAL_ROLES = ['Raja', 'Rani', 'Minister', 'Sainik', 'Naagarik', 'Chorrr'];

function App() {
  useSecurity();
  const [appState, setAppState] = useState('landing'); // landing, game
  const [gameMode, setGameMode] = useState('medium'); // easy, medium
  const [gameState, setGameState] = useState('initial'); // initial, shuffling, playing, gameOver
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [revealedCards, setRevealedCards] = useState(new Set()); 
  const [message, setMessage] = useState("Find the Chorrr!");
  const [messageType, setMessageType] = useState('info'); 
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && gameState === 'playing') {
       setMessage("Time's Up!");
       setMessageType('error');
       endGame();
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, timer, score]);

  const startGame = (mode) => {
    setGameMode(mode);
    setAppState('game');
    initializeCards(mode);
  };

  const initializeCards = (mode) => {
    let roles = [];
    if (mode === 'easy') {
      roles = ['Raja', 'Rani', 'Minister', 'Chorrr'];
    } else {
      // both medium and hard use all 6 roles
      roles = INITIAL_ROLES;
    }
    
    // Create cards
    const newCards = roles.map((role, index) => ({
      id: `card-${index}`,
      role,
    }));
    
    setCards(newCards);
    setGameState('initial');
    setScore(0);
    setTimer(30);
    setRevealedCards(new Set());
    setMessage("Find the Chorrr!");
    setMessageType('info');
  };

  const startShuffle = () => {
    setGameState('shuffling');
    setMessage("Shuffling...");
    
    let shuffleCount = 0;
    // Hard mode: faster and more shuffles
    const maxShuffles = gameMode === 'hard' ? 12 : (gameMode === 'medium' ? 8 : 6);
    const intervalTime = gameMode === 'hard' ? 150 : (gameMode === 'medium' ? 250 : 500);

    const intervalId = setInterval(() => {
        setCards(prev => {
            const shuffled = [...prev].sort(() => Math.random() - 0.5);
            return shuffled;
        });
        shuffleCount++;
        
        if (shuffleCount >= maxShuffles) {
            clearInterval(intervalId);
            setGameState('playing');
            setMessage("Identify the suspects!");
            setMessageType('info');
        }
    }, intervalTime);
  };

  const handleCardClick = (card) => {
    if (gameState !== 'playing') return;
    if (revealedCards.has(card.id)) return;
    
    setSelectedCardId(card.id);
  };

  const handleGuess = (guessedRole) => {
    if (selectedCardId === null) return;

    const card = cards.find(c => c.id === selectedCardId);
    // let pointsAdded = 0;

    setRevealedCards(prev => {
      const newSet = new Set(prev);
      newSet.add(selectedCardId);
      return newSet;
    });

    if (card.role === guessedRole) {
      const points = POINTS[guessedRole];
      setScore(prev => prev + points);
      // pointsAdded = points;
      setMessage(`Correct! It was the ${guessedRole}. +${points} pts`);
      setMessageType('success');
    } else {
      setMessage(`Wrong! It was the ${card.role}. 0 pts`);
      setMessageType('error');
    }
    
    if (revealedCards.size + 1 === cards.length) {
      endGame();
    }
    
    setSelectedCardId(null);
  };

  const endGame = () => {
    setGameState('gameOver');
    if (timer > 0) {
        setMessage("All suspects identified!");
    }
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const goHome = () => {
    setAppState('landing');
    setGameState('initial');
  };

  if (appState === 'landing') {
    return (
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '2rem' }}>
        <h1 style={{ fontSize: '4rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Siren size={64} />
          CHOR POLICE
        </h1>
        
        <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '600px' }}>
          <h2 style={{ marginBottom: '2rem' }}>Select Difficulty</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => startGame('easy')}
              style={{ flex: 1, padding: '1.5rem', fontSize: '1.2rem', background: '#4caf50', color: 'white', minWidth: '140px' }}
            >
              Easy
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>4 Cards</div>
            </button>
            <button 
              onClick={() => startGame('medium')}
              style={{ flex: 1, padding: '1.5rem', fontSize: '1.2rem', background: '#ff9800', color: 'white', minWidth: '140px' }}
            >
              Medium
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>6 Cards</div>
            </button>
            <button 
              onClick={() => startGame('hard')}
              style={{ flex: 1, padding: '1.5rem', fontSize: '1.2rem', background: '#f44336', color: 'white', minWidth: '140px' }}
            >
              Hard
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>Fast Shuffle</div>
            </button>
          </div>
          
          <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Trophy size={18} color="gold" /> Game Rules
            </h3>
            <ul style={{ paddingLeft: '1.2rem', lineHeight: '1.6', color: '#ccc', marginBottom: '1.5rem' }}>
              <li><strong>Find the Chorrr and Raja</strong> to get the highest points!</li>
              <li>Wait for the cards to <strong>Shuffle</strong>.</li>
              <li><strong>Identify</strong> each hidden card correctly to score.</li>
              <li><strong>One Chance</strong> per card!</li>
              <li><strong>30 Seconds</strong> to finish the mission!</li>
            </ul>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div style={{ color: '#aaa' }}>Raja: <span style={{ color: 'white' }}>60 pts</span></div>
                <div style={{ color: '#aaa' }}>Rani: <span style={{ color: 'white' }}>50 pts</span></div>
                <div style={{ color: '#aaa' }}>Minister: <span style={{ color: 'white' }}>40 pts</span></div>
                <div style={{ color: '#aaa' }}>Sainik: <span style={{ color: 'white' }}>30 pts</span></div>
                <div style={{ color: '#aaa' }}>Naagarik: <span style={{ color: 'white' }}>20 pts</span></div>
                <div style={{ color: '#aaa' }}>Chorrr: <span style={{ color: 'white' }}>70 pts</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Siren size={48} />
          CHOR POLICE
        </h1>
        
        <div className="glass-panel" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '1rem 2rem'
        }}>
          <div style={{textAlign: 'left'}}>
            <div style={{fontSize: '0.8em', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px'}}>{gameMode} MODE</div>
            <div style={{fontWeight: 'bold', color: messageType === 'error' ? '#ff5252' : messageType === 'success' ? '#4caf50' : 'white'}}>
              {message}
            </div>
          </div>
          <div style={{textAlign: 'center', color: timer < 10 ? '#ff5252' : 'white'}}>
             <div style={{fontSize: '0.9em', color: '#aaa'}}>TIME</div>
             <div style={{fontSize: '1.5em', fontWeight: 'bold'}}>{timer}s</div>
          </div>
          <div style={{textAlign: 'right'}}>
             <div style={{fontSize: '0.9em', color: '#aaa'}}>SCORE</div>
             <div style={{fontSize: '1.5em', fontWeight: 'bold'}}>{score}</div>
          </div>
        </div>
      </header>

      <main>
        <div className="card-container" style={{ 
            gridTemplateColumns: gameMode === 'easy' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            maxWidth: gameMode === 'easy' ? '400px' : '800px'
        }}>
          {cards.map((card) => (
            <motion.div 
               layout 
               transition={{ type: "spring", stiffness: 300, damping: 25 }}
               key={card.id}
            >
                <Card 
                  role={card.role}
                  isFlipped={gameState === 'initial' || gameState === 'gameOver' || revealedCards.has(card.id)}
                  onClick={() => handleCardClick(card)}
                />
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: '3rem' }}>
          {gameState === 'initial' && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  onClick={goHome}
                  style={{ padding: '1rem 2rem', fontSize: '1rem', background: 'transparent', border: '1px solid #444', color: '#aaa' }}
                >
                  Back
                </button>
                <button 
                  onClick={startShuffle}
                  style={{ padding: '1rem 3rem', fontSize: '1.2rem', background: 'var(--primary-color)', color: 'white' }}
                >
                  Start Mission
                </button>
            </div>
          )}
          
          {(gameState === 'gameOver' || gameState === 'playing' || gameState === 'shuffling') && (
            <button onClick={() => initializeCards(gameMode)} disabled={gameState === 'shuffling'} style={{ display: 'flex', alignItems: 'center', margin: '0 auto', gap: '8px', opacity: gameState === 'shuffling' ? 0.5 : 1 }}>
              <RefreshCw size={18} /> Restart Level
            </button>
          )}
        </div>
      </main>

      {selectedCardId !== null && (
        <RoleSelector 
          onSelect={handleGuess} 
          onCancel={() => setSelectedCardId(null)} 
        />
      )}
      
      {gameState === 'gameOver' && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          backdropFilter: 'blur(8px)'
        }}>
           <div className="glass-panel" style={{textAlign: 'center', padding: '3rem'}}>
              <Trophy size={64} color="gold" style={{marginBottom: '1rem'}} />
              <div style={{ fontSize: '1.2rem', color: '#aaa', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '2px' }}>
                {gameMode} MODE COMPLETE
              </div>
              <h2>{timer === 0 ? "Game Over!" : "Mission Accomplished!"}</h2>
              <p style={{fontSize: '1.5rem', margin: '1rem 0'}}>Final Score: {score}</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                <button onClick={goHome} style={{ background: 'transparent', border: '1px solid #444', color: 'white' }}>
                    Main Menu
                </button>
                <button onClick={() => initializeCards(gameMode)} style={{ background: 'var(--primary-color)', color: 'white' }}>
                    Play Again
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;
