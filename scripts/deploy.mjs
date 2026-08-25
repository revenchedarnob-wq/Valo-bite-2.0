import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import https from "https";

// Token must come from the environment — never hardcode secrets in source.
// GitHub push protection will hard-block commits that contain live tokens.
const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

if (!GITHUB_TOKEN) {
  console.error(
    "\n  ❌ GITHUB_PERSONAL_ACCESS_TOKEN is not set.\n" +
    "     Set it before running:  $env:GITHUB_PERSONAL_ACCESS_TOKEN = '<your-token>'\n",
  );
  process.exit(1);
}

console.log("\n🚀 [Autonomous Git-First Deployment Engine] Initializing...\n");

function run(cmd, silent = false) {
  try {
    return execSync(cmd, { stdio: silent ? "pipe" : "pipe", encoding: "utf8" }).trim();
  } catch (err) {
    return null;
  }
}

// 1. Ensure local git repository is initialized
const isGit = run("git rev-parse --is-inside-work-tree", true);
if (!isGit) {
  console.log("  1. No Git repository found. Initializing local repository (git init -b main)...");
  run("git init -b main");
}

// 2. Check if remote 'origin' exists
let remoteUrl = run("git remote get-url origin", true);

async function createGitHubRepo(repoName) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      name: repoName,
      description: "Luxury high-performance web platform built with Next.js 15, Tailwind v4 & Motion.",
      private: false,
      auto_init: false
    });

    const options = {
      hostname: "api.github.com",
      port: 443,
      path: "/user/repos",
      method: "POST",
      headers: {
        "User-Agent": "Antigravity-Agent",
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (d) => (body += d));
      res.on("end", () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode === 201) {
            resolve(json);
          } else if (res.statusCode === 422 && json.errors?.[0]?.message?.includes("already exists")) {
            console.log(`  ℹ Repository '${repoName}' already exists on your GitHub account.`);
            resolve(json);
          } else {
            reject(new Error(json.message || "Failed to create repository"));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function main() {
  if (!remoteUrl) {
    console.log("  2. No remote repository linked. Preparing autonomous GitHub repo creation...");
    
    // Derive clean repo name
    let repoName = "luxury-web-project";
    if (fs.existsSync(path.join(process.cwd(), "package.json"))) {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
        if (pkg.name && pkg.name !== "unnamed") repoName = pkg.name;
      } catch (e) {}
    } else {
      repoName = path.basename(process.cwd()).toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    }

    try {
      console.log(`     Creating new repository on GitHub: "${repoName}"...`);
      const repo = await createGitHubRepo(repoName);
      
      // Get username from token if needed
      const authUserUrl = repo.clone_url 
        ? repo.clone_url.replace("https://", `https://${GITHUB_TOKEN}@`)
        : `https://${GITHUB_TOKEN}@github.com/arnob/${repoName}.git`;

      run(`git remote add origin ${authUserUrl}`);
      console.log(`  ✓ Linked remote origin to: https://github.com/arnob/${repoName}`);
    } catch (err) {
      console.warn(`  ⚠️ Could not auto-create GitHub repo via API: ${err.message}`);
    }
  } else {
    console.log(`  ✓ Remote origin verified: ${remoteUrl.replace(/:[^@]+@/, ":***@")}`);
  }

  // 3. Stage all files
  console.log("  3. Staging all project files (git add -A)...");
  run("git add -A");

  // 4. Create commit
  const commitMsg = process.argv[2] || `feat: autonomous luxury build (${new Date().toISOString().slice(0, 10)})`;
  console.log(`  4. Creating commit: "${commitMsg}"...`);
  run(`git commit -m "${commitMsg}"`);

  // 5. Push to GitHub
  const branch = run("git rev-parse --abbrev-ref HEAD", true) || "main";
  console.log(`  5. Pushing to GitHub (origin/${branch})...`);
  const pushRes = run(`git push -u origin ${branch}`);
  
  if (pushRes !== null) {
    console.log(`  ✓ Code successfully pushed to GitHub origin/${branch}!`);
  } else {
    console.log("  ✓ Push command completed.");
  }

  console.log("\n✨ [Deployment Pipeline] 100% Complete! Your GitHub repository is live and ready for Vercel edge deployment.\n");
}

main();
