
export function getSecureImageUrl(src) {
  if (typeof src !== "string" || !src.trim()) {
    return null;
  }

  try {
    const url = new URL(src.trim());

    if (url.protocol !== "https:") {
      return null;
    }

    if (!url.hostname) {
      return null;
    }

    if (url.username || url.password) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

export function getInitials(name) {
  if (typeof name !== "string") {
    return "?";
  }

  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  if (words.length === 1) {
    return Array.from(words[0])[0].toUpperCase();
  }

  const firstInitial = Array.from(words[0])[0];
  const lastInitial = Array.from(words.at(-1))[0];

  return `${firstInitial}${lastInitial}`.toUpperCase();
}
