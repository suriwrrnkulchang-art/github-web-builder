import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

import {
  getProjects,
  addProject,
  findProject,
  findBySlug
} from "./database.js";

import {
  createSlug,
  createUrl
} from "./url-generator.js";

import {
  scanRepository
} from "./scanner.js";

import {
  scanText,
  validatePath
} from "./security.js";

import {
  getRepositoryTree,
  getFile
} from "./github.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : false,
    credentials: true
  })
);

app.use(express.json({
  limit: "100kb"
}));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api/", limiter);

app.use(
  express.static(
    path.join(__dirname, "../public")
  )
);

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "github-web-builder"
  });
});

/*
 * ตรวจ repository
 */
app.post("/api/scan", async (req, res) => {
  try {
    const {
      installationId,
      owner,
      repo,
      branch = "main"
    } = req.body;

    if (
      !installationId ||
      !owner ||
      !repo
    ) {
      return res.status(400).json({
        error: "ข้อมูล repository ไม่ครบ"
      });
    }

    const tree =
      await getRepositoryTree(
        installationId,
        owner,
        repo,
        branch
      );

    const result =
      scanRepository(tree);

    return res.json(result);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "ไม่สามารถตรวจ repository ได้"
    });
  }
});

/*
 * ตรวจไฟล์ก่อน Deploy
 */
app.post("/api/security/scan-file", async (req, res) => {
  try {
    const {
      installationId,
      owner,
      repo,
      path: filePath,
      ref = "main"
    } = req.body;

    if (!validatePath(filePath)) {
      return res.status(400).json({
        error: "path ไม่ถูกต้อง"
      });
    }

    const content =
      await getFile(
        installationId,
        owner,
        repo,
        filePath,
        ref
      );

    const findings =
      scanText(content, filePath);

    return res.json({
      safe: findings.length === 0,
      findings
    });

  } catch {
    return res.status(500).json({
      error: "ไม่สามารถตรวจไฟล์ได้"
    });
  }
});

/*
 * สร้าง Project
 */
app.post("/api/projects", async (req, res) => {
  try {
    const {
      owner,
      repo,
      branch = "main",
      root = "",
      name,
      installationId,
      entrypoint = "index.html"
    } = req.body;

    if (
      !owner ||
      !repo ||
      !name ||
      !installationId
    ) {
      return res.status(400).json({
        error: "ข้อมูลไม่ครบ"
      });
    }

    if (
      root &&
      !validatePath(root)
    ) {
      return res.status(400).json({
        error: "root path ไม่ถูกต้อง"
      });
    }

    const projects =
      await getProjects();

    let slug;

    do {
      slug = createSlug(name);
    } while (
      projects.some(
        project => project.slug === slug
      )
    );

    const project = {
      id: crypto.randomUUID(),

      owner,
      repo,
      branch,

      root,

      entrypoint,

      name,

      slug,

      url: createUrl(
        process.env.BASE_URL,
        slug
      ),

      installationId,

      status: "created",

      createdAt:
        new Date().toISOString()
    };

    await addProject(project);

    return res.status(201).json(project);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "สร้าง project ไม่สำเร็จ"
    });
  }
});

/*
 * ดู Project
 */
app.get("/api/projects/:id", async (req, res) => {
  const project =
    await findProject(req.params.id);

  if (!project) {
    return res.status(404).json({
      error: "ไม่พบ project"
    });
  }

  res.json(project);
});

/*
 * ดู Project จาก URL
 */
app.get("/api/public/:slug", async (req, res) => {
  const project =
    await findBySlug(req.params.slug);

  if (!project) {
    return res.status(404).json({
      error: "ไม่พบเว็บไซต์"
    });
  }

  res.json({
    name: project.name,
    url: project.url,
    status: project.status
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal Server Error"
  });
});

const PORT =
  Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(
    `GitHub Web Builder running on port ${PORT}`
  );
});
