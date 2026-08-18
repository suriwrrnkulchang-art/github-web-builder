const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  ".github",
  ".next",
  "dist",
  "build",
  "__pycache__"
]);

const DANGEROUS_FILES = [
  ".env",
  ".env.local",
  ".env.production",
  "id_rsa",
  "id_dsa",
  "credentials.json",
  "service-account.json"
];

const WEB_FILES = [
  "index.html",
  "index.htm"
];

export function scanRepository(tree) {
  const files = tree.filter(
    item =>
      item.type === "blob" &&
      !isIgnored(item.path)
  );

  const directories = tree.filter(
    item =>
      item.type === "tree" &&
      !isIgnored(item.path)
  );

  const result = {
    valid: true,
    files: files.length,
    directories: directories.length,
    warnings: [],
    errors: [],
    entrypoints: [],
    technologies: []
  };

  for (const file of files) {
    const lower = file.path.toLowerCase();

    if (DANGEROUS_FILES.some(
      danger =>
        lower === danger ||
        lower.endsWith(`/${danger}`)
    )) {
      result.errors.push({
        type: "sensitive-file",
        file: file.path
      });
    }

    if (
      lower.endsWith("/index.html") ||
      lower === "index.html"
    ) {
      result.entrypoints.push(file.path);
    }

    if (lower.endsWith(".html")) {
      result.technologies.push("HTML");
    }

    if (lower.endsWith(".css")) {
      result.technologies.push("CSS");
    }

    if (lower.endsWith(".js")) {
      result.technologies.push("JavaScript");
    }

    if (lower.endsWith(".ts")) {
      result.technologies.push("TypeScript");
    }

    if (lower.endsWith(".py")) {
      result.technologies.push("Python");
    }

    if (lower.endsWith(".php")) {
      result.technologies.push("PHP");
    }

    if (lower.endsWith(".go")) {
      result.technologies.push("Go");
    }

    if (lower.endsWith(".java")) {
      result.technologies.push("Java");
    }
  }

  result.technologies = [
    ...new Set(result.technologies)
  ];

  if (result.files === 0) {
    result.errors.push({
      type: "empty-project",
      message: "ไม่พบไฟล์"
    });
  }

  if (result.entrypoints.length === 0) {
    result.warnings.push({
      type: "no-index",
      message:
        "ไม่พบ index.html ระบบจะต้องกำหนด entrypoint เอง"
    });
  }

  if (result.errors.length > 0) {
    result.valid = false;
  }

  return result;
}

function isIgnored(filePath) {
  const parts = filePath.split("/");

  return parts.some(
    part => IGNORE_DIRS.has(part)
  );
}
