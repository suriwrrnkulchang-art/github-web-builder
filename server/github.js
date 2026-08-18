import { App } from "octokit";

let githubApp;

function getApp() {
  if (!githubApp) {
    const privateKey =
      process.env.GITHUB_PRIVATE_KEY?.replace(/\\n/g, "\n");

    githubApp = new App({
      appId: process.env.GITHUB_APP_ID,
      privateKey
    });
  }

  return githubApp;
}

export async function getInstallationOctokit(
  installationId
) {
  const app = getApp();

  return await app.getInstallationOctokit(
    installationId
  );
}

export async function getRepositoryTree(
  installationId,
  owner,
  repo,
  branch
) {
  const octokit =
    await getInstallationOctokit(installationId);

  const response =
    await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: "true"
    });

  return response.data.tree;
}

export async function getFile(
  installationId,
  owner,
  repo,
  path,
  ref
) {
  const octokit =
    await getInstallationOctokit(installationId);

  const response =
    await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref
    });

  if (Array.isArray(response.data)) {
    throw new Error("Path is a directory");
  }

  if (!response.data.content) {
    return "";
  }

  return Buffer.from(
    response.data.content,
    "base64"
  ).toString("utf8");
}
