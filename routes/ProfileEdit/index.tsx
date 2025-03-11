import { useNavigate } from "react-router-dom";
import GenericButton from "../../components/GenericButton";
import SectionHeader from "../../components/SectionHeader";
import { useUser } from "../../contexts/user";
import ImageUploadPreview from "../../components/ImageUploadPreview";
import LabeledInput from "../../components/LabeledInput";
import { useEffect, useState } from "react";

import "./styles.scss";
import { validateEmail } from "../../utils";
import { useToasts } from "../../contexts/toasts";

const ProfileEditSection = () => {
  const user = useUser();
  const navigate = useNavigate();
  const toasts = useToasts();

  const [nickname, setNickname] = useState("");
  const [icon, setIcon] = useState("");
  const [email, setEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [description, setDescription] = useState("");
  const [confirmAccountDeletion, setConfirmAccountDeletion] = useState(false);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!user.user) return;
    setNickname(user.user.username);
    setEmail(user.user.email);
    setDescription(user.user.description || "");
  }, [user.user]);

  const onDeleteAccount = () => {
    if (confirmAccountDeletion) {
      user.deleteAccount().then(() => {
        navigate("/");
      });
    } else {
      setConfirmAccountDeletion(true);
    }
  };

  const onSave = async () => {
    setLoading(true);
    console.log("Saving profile...");
    const result = await user.update({
      email,
      description,
      avatar: icon || (avatarRemoved ? null : undefined),
      password: resetPassword || undefined,
    });

    if (result) {
      setLoading(false);
      navigate("/profile");
    } else {
      setLoading(false);
    }
  };

  const onUpdateEmail = async (newEmail: string) => {
    setEmail(newEmail);
    // if (!validateEmail(newEmail)) {
    //   setEmailError(true);
    // } else {
    //   setEmailError(false);
    // }
  };

  const emailError = user.user?.email !== email && !validateEmail(email);

  return (
    <div className="profile-edit-section">
      <div className="row">
        <div className="column">
          <div className="left-info">
            <ImageUploadPreview
              image={
                avatarRemoved
                  ? ""
                  : icon ||
                    (user.user?.hasAvatar &&
                      (user.avatar
                        ? user.avatar + `?key=${user.userUpdateKey}`
                        : null)) ||
                    ""
              }
              onChange={(s, error) => {
                setIcon(s);
                if (error) {
                  setError(error);
                  toasts.add({
                    type: "error",
                    message: error,
                    sameId: "avatar-error",
                  });
                } else {
                  setAvatarRemoved(false);
                  setError("");
                }
              }}
              onRemove={() => {
                setIcon("");
                setAvatarRemoved(true);
                setError("");
              }}
            />
            <LabeledInput
              label="Nickname:"
              value={nickname}
              onChange={() => {}}
              disabled
              placeholder="Nickname"
            />
          </div>
          <LabeledInput
            label="Email:"
            value={email}
            onChange={onUpdateEmail}
            placeholder="Email"
            error={emailError}
          />
        </div>
        <div className="column end">
          <LabeledInput
            label="Change password:"
            value={resetPassword}
            onChange={setResetPassword}
            placeholder="New password"
          />
        </div>
      </div>
      <LabeledInput
        label="Description:"
        value={description}
        onChange={setDescription}
        placeholder="Write a few words about yourself"
        multiline
      />
      <div className="spaced">
        <GenericButton
          label={
            confirmAccountDeletion ? "Press again to confirm" : "Delete Account"
          }
          onClick={onDeleteAccount}
          style={{ backgroundColor: "transparent", color: "#ffffff66" }}
        />
        <GenericButton
          label="Save"
          onClick={onSave}
          withGlow
          style={{ width: "100px" }}
          loading={loading}
          visibleDisabled
          disabled={emailError || !!error}
        />
      </div>
    </div>
  );
};

export default ProfileEditSection;
