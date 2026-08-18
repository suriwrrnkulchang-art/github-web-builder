const SECRET_PATTERNS = [
  {
    name: "GitHub Token",
    pattern: /gh[pousr]_[A-Za-z0-9_]{20,}/
  },
  {
    name: "Private Key",
    pattern: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/
  },
  {
    name: "AWS Access Key",
    pattern: /AKIA[0-9A-Z]{16}/
  },
  {
    name: "Generic Secret",
    pattern: /(api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']{8,}["']/i
  }
];

export function scanText(text, filename) {
  const findings = [];

  for (const item of SECRET_PATTERNS) {
    if (item.pattern.test(text)) {
      findings.push({
        type: "secret",
        name: item.name,
        file: filename
      });
    }
  }

  return findings;
}

export function validatePath(input) {
  if (!input) {
    return false;
  }

  if (
    input.includes("..") ||
    input.includes("\\") ||
    input.startsWith("/")
  ) {
    return false;
  }

  return /^[a-zA-Z0-9._/-]+$/.test(input);
}
