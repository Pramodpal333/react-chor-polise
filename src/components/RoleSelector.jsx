import React from 'react';
import KingImg from '../assets/king-icon.png';
import QueenImg from '../assets/queen-image.png';
import MinisterImg from '../assets/minister-image.png';
import SoldierImg from '../assets/soldiers-image.png';
import CitizenImg from '../assets/citizens-image.png';
import ThiefImg from '../assets/thief-image.png';

const ROLES = [
  { name: 'Raja', img: KingImg, color: '#ffd700' },
  { name: 'Rani', img: QueenImg, color: '#e91e63' },
  { name: 'Minister', img: MinisterImg, color: '#4caf50' },
  { name: 'Sainik', img: SoldierImg, color: '#2196f3' },
  { name: 'Naagarik', img: CitizenImg, color: '#9e9e9e' },
  { name: 'Chorrr', img: ThiefImg, color: '#ff5722' },
];

const RoleSelector = ({ onSelect, onCancel }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      backdropFilter: 'blur(5px)'
    }} onClick={onCancel}>
      <div 
        className="glass-panel" 
        style={{ maxWidth: '90%', width: '400px', textAlign: 'center' }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{marginTop: 0}}>Identify Suspect</h2>
        <p style={{marginBottom: '2rem', color: 'var(--text-secondary)'}}>Who is hiding behind this card?</p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem'
        }}>
          {ROLES.map((role) => (
            <button
              key={role.name}
              onClick={() => onSelect(role.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1rem',
                border: `1px solid ${role.color}`,
                background: 'rgba(255,255,255,0.05)',
                color: 'white'
              }}
            >
              <img src={role.img} alt={role.name} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              {role.name}
            </button>
          ))}
        </div>
        <button 
          onClick={onCancel}
          style={{ marginTop: '2rem', width: '100%', border: '1px solid #444' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
