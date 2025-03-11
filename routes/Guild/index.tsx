import SectionHeader from "../../components/SectionHeader";
import { useGuild } from "../../contexts/guild";
import api from "../../api";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import GenericButton from "../../components/GenericButton";

import ManageIcon from "../../assets/manage.svg";
import AddIcon from "../../assets/addGuild.svg";
import VoteIcon from "../../assets/voted.svg";
import DiscordIcon from "../../assets/discord.svg";

import "./styles.scss";
import RedBox from "../../components/RedBox";
import { numberToOrder } from "../../utils";
import MemberListEntry from "../../components/MemberListEntry";
import { useUser } from "../../contexts/user";
import { useGuilds } from "../../contexts/guilds";

const GuildSection = () => {
  const guild = useGuild();
  const guilds = useGuilds();
  const params = useParams<{ id: string }>();
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.id) {
      guild.loadGuild(params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const myApplication =
    user.user?.applications?.find((a) => a.guild === guild.guild?.id) || null;

  const memberRole =
    user.user?.membershipEnt?.find((ent) => ent.guild === guild.guild?.id)
      ?.role || null;

  const onApply = () => {
    if (!user.user) {
      navigate("/login");
      return;
    }
    navigate(`/guilds/${guild.guild?.urlSlug}/apply`);
  };

  if (guild.error) {
    navigate("/");
  }

  if (!guild.guild || guild.loading) {
    return <Loader fill />;
  }

  return (
    <div className="guild-section">
      <SectionHeader
        title={guild.guild.name}
        subtitle={guild.guild.description}
        underSubtitle={
          guild.guild?.discordLink ? (
            <div
              className="discord-link"
              onClick={() => (window.location.href = guild.guild?.discordLink!)}
            >
              <img src={DiscordIcon} alt="Discord server" />
            </div>
          ) : undefined
        }
        thumbnail={api.guilds.getIcon(guild.guild.id)}
        rightSection={
          <div className="guild-header-right">
            <GenericButton label="Back" onClick={() => window.history.back()} />
            {user.user?.admin ||
            ["OWNER", "ADMIN"].includes(memberRole || "") ? (
              <GenericButton
                label="Manage"
                icon={ManageIcon}
                onClick={() =>
                  navigate(`/guilds/${guild.guild?.urlSlug}/manage`)
                }
                withGlow
              />
            ) : null}
          </div>
        }
      />
      <RedBox
        title={
          <span>
            <strong>{numberToOrder(guild.guild.ranking || 0)}</strong> in
            Ranking
          </span>
        }
        subtitle={
          <span>
            <strong>{guild.guild.votes}</strong> Votes
          </span>
        }
        leftAction={
          (myApplication?.state === "AWAITING" || !memberRole) && (
            <GenericButton
              disabled={!!myApplication}
              label={myApplication?.state === "AWAITING" ? "Pending" : "Apply"}
              icon={myApplication?.state === "AWAITING" ? undefined : AddIcon}
              onClick={onApply}
            />
          )
        }
        rightAction={
          <GenericButton
            label={!user.user || guild.guild.canGuildVote ? "Vote" : "Voted"}
            icon={!user.user || guild.guild.canGuildVote ? undefined : VoteIcon}
            disabled={!!user.user && !guild.guild.canGuildVote}
            onClick={() => {
              if (user.user) {
                guild.vote().then(() => {
                  guilds.updateGuild(guild.guild!.id, {
                    ableToVoteAt: new Date(Date.now() + 86400000),
                    canGuildVote: false,
                  });
                });
              } else {
                navigate("/login");
              }
            }}
          />
        }
        headerStyle={{
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <div className="guild-content">
          <div className="guild-content-inner left">
            <div className="row">
              <div className="label">Owner</div>
              <div className="value">{guild.guild.ownerUsername || "?"}</div>
            </div>
            <div className="row">
              <div className="label">Members</div>
              <div className="value">{guild.guild.memberCount || "?"}</div>
            </div>
            <div className="row">
              <div className="label">Language</div>
              <div className="value">{guild.guild.language || "-"}</div>
            </div>
            <div className="row">
              <div className="label">Created</div>
              <div className="value">
                {new Date(guild.guild.createdAt || "").toLocaleDateString(
                  "en-US"
                ) || "-"}
              </div>
            </div>
          </div>
          <div className="separator" />
          <div className="guild-content-inner right">
            <div className="req-label">Requirements</div>
            <div className="req-value">{guild.guild.requirements || "-"}</div>
          </div>
        </div>
      </RedBox>
      <RedBox title="Guild Members" centered narrower>
        {guild.members.map((member) => (
          <MemberListEntry
            member={member}
            withOwnerActions={memberRole === "OWNER"}
            withAdminActions={memberRole === "ADMIN"}
          />
        ))}
      </RedBox>
    </div>
  );
};

export default GuildSection;
