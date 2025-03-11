import { useState } from "react";
import VotedIcon from "./assets/voted.svg";
import "./styles.scss";
import { useUser } from "../../contexts/user";
import { useNavigate } from "react-router-dom";

interface VoteButtonProps {
  voted: boolean;
  canVote: boolean;
  onClick?: () => void;
}

const VoteButton = ({ voted, canVote, onClick }: VoteButtonProps) => {
  const [justVoted, setJustVoted] = useState(false); // Used to prevent flicker when voting
  const user = useUser();
  const navigate = useNavigate();

  const onVote = () => {
    if (!user.user) {
      navigate("/login");
      return;
    }
    if (!canVote || justVoted) return;
    setJustVoted(true);
    onClick?.();
  };

  const finalVoted = voted || justVoted;

  return (
    <div className={`vote-button ${finalVoted && "voted"}`} onClick={onVote}>
      {finalVoted && <img src={VotedIcon} alt="Voted" className="icon" />}
      <div className="label">{finalVoted ? "Voted" : "Vote"}</div>
    </div>
  );
};

export default VoteButton;
