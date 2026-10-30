
import { useState } from "react";

import {
  getInitials,
  getSecureImageUrl,
} from "../utils/avatarUtils.js";

function AvatarContent({
  name,
  secureSrc,
  size,
}) {
  const [hasError, setHasError] = useState(false);

  const initials = getInitials(name);

  if (!secureSrc || hasError) {
    return (
      <span
        className="avatar-fallback"
        role="img"
        aria-label={`Avatar for ${name}`}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      className="avatar-image"
      src={secureSrc}
      alt={`Profile photo of ${name}`}
      width={size}
      height={size}
      loading="eager"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

function ProfileAvatar({
  name,
  src,
  size = 96,
}) {
  const secureSrc = getSecureImageUrl(src);

  const safeSize =
    Number.isInteger(size) && size > 0
      ? size
      : 96;

  return (
    <span
      className="profile-avatar"
      style={{
        display: "inline-flex",
        width: safeSize,
        height: safeSize,
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: "#dbeafe",
        color: "#1e40af",
        fontWeight: 700,
        fontSize: safeSize * 0.3,
      }}
    >
      <AvatarContent
        key={secureSrc ?? "fallback"}
        name={name}
        secureSrc={secureSrc}
        size={safeSize}
      />
    </span>
  );
}

export default ProfileAvatar;
