import { useNavigate, useParams } from "react-router-dom";
import GenericButton from "../../components/GenericButton";
import SectionHeader from "../../components/SectionHeader";
import { useUser } from "../../contexts/user";
import { useProfile } from "../../contexts/profile";
import { useEffect } from "react";
import Loader from "../../components/Loader";
import api from "../../api";

import "./styles.scss";
import KingIcon from "../../assets/king.svg";
import { useGuild } from "../../contexts/guild";

const ProfileSection = () => {
  const user = useUser();
  const navigate = useNavigate();
  const profile = useProfile();
  const params = useParams<{ id?: string }>();
  const guild = useGuild();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (params.id) {
      profile.loadProfile(Number(params.id));
    } else if (user.user?.id) {
      profile.loadProfile(user.user?.id);
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const logout = () => {
    user.logout();
    navigate("/");
  };

  if (!profile.profile || profile.loading) {
    return <Loader fill />;
  }

  const isMe = user.user?.id === profile.profile.id;

  return (
    <div className="profile-section">
      <SectionHeader
        title={profile.profile.username}
        underTitle={
          <div className="under-title">
            {profile.profile.membership.map((ent) => (
              <div
                className="tag"
                onClick={() => {
                  guild.forceLoading();
                  navigate(`/guilds/${ent.guildEnt.urlSlug}`);
                }}
              >
                <span>{ent.guildEnt.name}</span>
                {ent.guildEnt.ownerId === profile.profile?.id && (
                  <img alt="Owner" src={KingIcon} />
                )}
              </div>
            ))}
          </div>
        }
        subtitle={profile.profile.description || ""}
        thumbnail={
          api.members.getAvatar(profile.profile.id) +
          `?key=${user.userUpdateKey}`
        }
        rightSection={
          isMe && (
            <div className="header-right-section">
              <GenericButton
                label="Edit"
                withGlow
                onClick={() => navigate("/profile/edit")}
              />
              <GenericButton label="Log Out" withGlow onClick={logout} />
            </div>
          )
        }
      />
      <div className="section">
        <div className="row">
          <div className="label">Added Markers on Maps</div>
          <div className="value">{profile.profile.markerCount}</div>
        </div>
        <div className="row">
          <div className="label">Rating on Maps</div>
          <div className="value">#{profile.profile.markerRating}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
