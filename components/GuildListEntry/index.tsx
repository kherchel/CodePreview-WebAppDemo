import { useEffect, useState } from "react";
import { Guild } from "../../types";
import { dateToCountdown } from "../../utils";
import "./styles.scss";
import VoteButton from "../VoteButton";

import api from "../../api";
import { useNavigate } from "react-router-dom";
import { useGuild } from "../../contexts/guild";
import { usePlatforms } from "../../contexts/platforms";
import { useUser } from "../../contexts/user";
import { useGuilds } from "../../contexts/guilds";

interface GuildListEntryProps {
  guild: Guild;
}

const GuildListEntry = ({ guild }: GuildListEntryProps) => {
  const [startTime, setStartTime] = useState(new Date());
  const [timeElapsed, setTimeElapsed] = useState(0);

  const navigate = useNavigate();
  const guildContext = useGuild();
  const platforms = usePlatforms();
  const user = useUser();
  const guilds = useGuilds();

  useEffect(() => {
    setStartTime(new Date());
    if (guild.ableToVoteAt) {
      const interval = setInterval(() => {
        setTimeElapsed((timeElapsed) => timeElapsed + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [guild.ableToVoteAt]);

  const navigateToGuild = () => {
    guildContext.loadGuild(Number(guild.id));
    navigate(`/guilds/${guild.urlSlug}`);
  };

  const onVote = () => {
    guilds.vote(guild.id);
  };

  return (
    <div className="guild-list-entry">
      <div className="guild-list-entry-inner">
        <div className="mobile-wrapper">
          <div className="ranking">
            {guild.ranking
              ? guild.ranking < 10
                ? `0${guild.ranking}`
                : guild.ranking
              : "??"}
          </div>
          <img
            src={api.guilds.getIcon(guild.id)}
            alt={guild.name}
            className="guild-icon"
            onClick={navigateToGuild}
          />
          <div className="info-box">
            <h3 className="guild-name" onClick={navigateToGuild}>
              {guild.name}
            </h3>
            <div className="guild-info">
              <div className="tag">{guild.language}</div>
              <div className="tag">{guild.tag}</div>
              {guild.platforms?.map((platform) => (
                <img
                  src={
                    platforms.platforms.find((p) => p.id === platform.platform)
                      ?.icon
                  }
                  className="platform desktop-only"
                  key={platform.platform}
                  alt={platform.platform}
                />
              ))}
            </div>
            <div className="guild-description desktop-only">
              {guild.description}
            </div>
          </div>
        </div>
        <div className="mobile-only mobile-platforms">
          {guild.platforms?.map((platform) => (
            <img
              src={
                platforms.platforms.find((p) => p.id === platform.platform)
                  ?.icon
              }
              className="platform"
              key={platform.platform}
              alt={platform.platform}
            />
          ))}
        </div>
        <div className="guild-description mobile-only">{guild.description}</div>
        <div className="guild-vote-box desktop-only">
          <div className="separator desktop-only" />
          <div className="description">
            {guild.canGuildVote || !guild.ableToVoteAt || !user.user
              ? "Votes"
              : "Time to next vote"}
          </div>
          <div className="votes">
            {guild.canGuildVote || !guild.ableToVoteAt || !user.user
              ? guild.votes
              : dateToCountdown(guild.ableToVoteAt, startTime, timeElapsed)}
          </div>
          <div className="action">
            <VoteButton
              voted={!guild.canGuildVote && !!user.user}
              canVote={!!guild.canGuildVote && !!user.user}
              onClick={onVote}
            />
          </div>
        </div>
        <div className="guild-vote-box-mobile mobile-only">
          <div className="left">
            <div className="description">
              {guild.canGuildVote || !guild.ableToVoteAt || !user.user
                ? "Votes"
                : "Time to next vote"}
            </div>
            <div className="votes">
              {guild.canGuildVote || !guild.ableToVoteAt || !user.user
                ? guild.votes
                : dateToCountdown(guild.ableToVoteAt, startTime, timeElapsed)}
            </div>
          </div>
          <div className="action">
            <VoteButton
              voted={!guild.canGuildVote && !!user.user}
              canVote={!!guild.canGuildVote && !!user.user}
              onClick={onVote}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuildListEntry;
