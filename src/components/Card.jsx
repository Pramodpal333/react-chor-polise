import React from "react";
import { HelpCircle } from "lucide-react";
import styles from "./Card.module.css";

import KingImg from "../assets/king-icon.png";
import QueenImg from "../assets/queen-image.png";
import MinisterImg from "../assets/minister-image.png";
import SoldierImg from "../assets/soldiers-image.png";
import CitizenImg from "../assets/citizens-image.png";
import ThiefImg from "../assets/thief-image.png";

const RoleImages = {
  Raja: KingImg,
  Rani: QueenImg,
  Minister: MinisterImg,
  Sainik: SoldierImg,
  Naagarik: CitizenImg,
  Chorrr: ThiefImg,
};

const Card = ({ role, isFlipped, onClick }) => {
  return (
    <div
      className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}
      onClick={!isFlipped ? onClick : undefined}
    >
      {/* Front (Role Revealed) */}
      <div className={`${styles.cardFace} ${styles.cardFront}`}>
        <div className={styles.cardImageContainer}>
          {RoleImages[role] ? (
            <img src={RoleImages[role]} alt={role} className={styles.roleImage} />
          ) : (
            <HelpCircle size={48} />
          )}
        </div>
        <span className={styles.roleName}>{role}</span>
      </div>

      {/* Back (Hidden) */}
      <div className={`${styles.cardFace} ${styles.cardBack}`}>
        <HelpCircle size={32} />
        <span style={{ marginTop: "10px", fontSize: "0.8rem" }}>
          POLICE FILE
        </span>
      </div>
    </div>
  );
};

export default Card;
