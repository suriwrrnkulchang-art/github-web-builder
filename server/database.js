import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.resolve("data");
const FILE = path.join(DATA_DIR, "projects.json");

async function ensureDatabase() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(
      FILE,
      JSON.stringify([], null, 2),
      "utf8"
    );
  }
}

export async function getProjects() {
  await ensureDatabase();

  const raw = await fs.readFile(FILE, "utf8");

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveProjects(projects) {
  await ensureDatabase();

  const temporary = `${FILE}.tmp`;

  await fs.writeFile(
    temporary,
    JSON.stringify(projects, null, 2),
    "utf8"
  );

  await fs.rename(temporary, FILE);
}

export async function addProject(project) {
  const projects = await getProjects();

  projects.push(project);

  await saveProjects(projects);

  return project;
}

export async function findProject(id) {
  const projects = await getProjects();

  return projects.find(
    project => project.id === id
  );
}

export async function findBySlug(slug) {
  const projects = await getProjects();

  return projects.find(
    project => project.slug === slug
  );
}
