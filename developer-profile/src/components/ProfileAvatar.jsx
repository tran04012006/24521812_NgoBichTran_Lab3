
import { useState } from "react";

import {
  getInitials,
  getSecureImageUrl,
} from "../utils/avatarUtils.js";

import styles from "./ProfileAvatar.module.css";

const AVATAR_SIZE = 96;

function AvatarContent({ name, secureSrc }) {
  const [hasError, setHasError] = useState(false);

  const initials = getInitials(name);

  if (!secureSrc || hasError) {
    return (
      <span
        className={styles.fallback}
        role="img"
        aria-label={`Avatar for ${name}`}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      className={styles.image}
      src={secureSrc}
      alt={`Profile photo of ${name}`}
      width={AVATAR_SIZE}
      height={AVATAR_SIZE}
      loading="eager"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

function ProfileAvatar({ name, src }) {
  const secureSrc = getSecureImageUrl(src);

  return (
    <span className={styles.avatar}>
      <AvatarContent
        key={secureSrc ?? "fallback"}
        name={name}
        secureSrc={secureSrc}
      />
    </span>
  );
}

export default ProfileAvatar;
