import { GuildMember } from "../../types";
import "./styles.scss";

import api from "../../api";
import { usePlatforms } from "../../contexts/platforms";
import GenericButton from "../GenericButton";
import { useGuild } from "../../contexts/guild";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../contexts/profile";

interface MemberListEntryProps {
  member: GuildMember;
  withOwnerActions?: boolean;
  withAdminActions?: boolean;
}

const MemberListEntry = ({
  member,
  withOwnerActions,
  withAdminActions,
}: MemberListEntryProps) => {
  const platforms = usePlatforms();
  const guild = useGuild();
  const profile = useProfile();
  const navigate = useNavigate();

  const onMakeAdmin = () => {
    guild.makeAdmin(member.userId);
  };

  const onRemoveAdmin = () => {
    guild.removeAdmin(member.userId);
  };

  const onRemoveMember = () => {
    guild.removeMember(member.userId);
  };

  const onVisitProfile = () => {
    profile.loadProfile(member.userId);
    navigate(`/profile/${member.userId}`);
  };

  return (
    <div className="member-list-entry">
      <div className="member-list-entry-inner">
        <img
          src={api.members.getAvatar(member.userId)}
          alt={member.username}
          className="member-icon"
          onClick={onVisitProfile}
        />
        <div className="info-box">
          <div className="member-name" onClick={onVisitProfile}>
            {member.username}
          </div>
          <div className="member-info">
            {member.role === "OWNER" && <div className="tag">Owner</div>}
            {member.role === "ADMIN" && (
              <div className="tag">
                Admin
                <div className="remove-tag" onClick={onRemoveAdmin}>
                  -
                </div>
              </div>
            )}
            {member.platforms?.map((platform) => (
              <img
                src={
                  platforms.platforms.find((p) => p.id === platform.name)?.icon
                }
                className="platform"
                key={platform.name}
                alt={platform.name}
              />
            ))}
          </div>
        </div>
        {(withOwnerActions || withAdminActions) && (
          <div className="actions">
            {withOwnerActions && !["OWNER", "ADMIN"].includes(member.role) && (
              <GenericButton
                label="Make Admin"
                style={{ marginRight: "20px" }}
                rounder
                withGlow
                onClick={onMakeAdmin}
              />
            )}
            {withAdminActions && !["OWNER", "ADMIN"].includes(member.role) && (
              <GenericButton
                label="Remove"
                style={{ backgroundColor: "#E7231366" }}
                rounder
                onClick={onRemoveMember}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberListEntry;
