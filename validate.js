/**
 * Usage:
 *
 * const err = validate(spec, url)
 * if (err) {
 *   console.log('Invalid pet:', err)
 * }
 *
 * If you are loading a document that is hosted online, provide the full url in the second argument.
 * This will rewrite all relative asset urls such as "wolf.glb" to absolute urls for you.
 *
 */
export function validatePet(spec, url) {
  if (!spec) return `invalid`;
  if (!spec.type) return `missing 'type' attribute`;
  if (spec.type !== "M3_pet") return `invalid 'type' attribute`;
  if (!spec.version) return `missing 'version' attribute`;
  if (!isSemver(spec.version)) return `invalid 'version' attribute`;
  const version = semver(spec.version);
  if (version.isGreaterThan(supported)) return `unsupported version`;
  if (!spec.name) return `missing 'name' attribute`;
  if (!spec.description) return `missing 'description' attribute`;
  if (!spec.model) return `missing 'model' attribute`;
  const modelUrl = resolveUrl(spec.model, url);
  if (!modelUrl) return `invalid 'model' url`;
  if (!modelUrl.endsWith(".glb")) return `invalid 'model' url`;
  spec.model = modelUrl;
  if (!isNumber(spec.speed)) return `invalid 'speed' attribute`;
  if (!isNumber(spec.near)) return `invalid 'near' attribute`;
  if (!isNumber(spec.far)) return `invalid 'far' attribute`;
  if (!spec.emotes) spec.emotes = [];
  for (const emote of spec.emotes) {
    if (!emote.name) return `missing emote 'name' attribute`;
    if (!emote.animation) return `missing emote 'animation' attribute`;
    if (emote.audio) {
      if (!emote.audio.startsWith("http")) {
        return `invalid emote 'audio' attribute`;
      }
    }
  }
}

const supported = semver("0.1.0");

function resolveUrl(path, url) {
  if (!path) return null;
  if (path.startsWith("http")) {
    return path;
  }
  if (!url) return null;
  const parts = url.split("/");
  parts.pop();
  url = parts.join("/");
  if (path.startsWith("/")) {
    return url + path;
  }
  return url + "/" + path;
}

function isNumber(n) {
  return !isNaN(n);
}

function isString(str) {
  return typeof str === "string";
}

function isSemver(str) {
  if (!str) return false;
  if (!isString(str)) return false;
  const [major, minor, patch] = str.split(".").map((n) => parseInt(n));
  return isNumber(major) && isNumber(minor) && isNumber(patch);
}

function semver(str) {
  const [major, minor, patch] = str.split(".").map((n) => parseInt(n));
  const isEqual = (other) => {
    return (
      major === other.major && minor === other.minor && patch === other.patch
    );
  };
  const isGreaterThan = (other) => {
    if (major > other.major) return true;
    if (major < other.major) return false;
    if (minor > other.minor) return true;
    if (minor < other.minor) return false;
    return patch > other.patch;
  };
  const isLessThan = (other) => {
    if (major < other.major) return true;
    if (major > other.major) return false;
    if (minor < other.minor) return true;
    if (minor > other.minor) return false;
    return patch < other.patch;
  };
  return {
    major,
    minor,
    patch,
    isEqual,
    isGreaterThan,
    isLessThan,
  };
}
