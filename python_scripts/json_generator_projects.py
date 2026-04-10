import requests
import json
import re
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv()

USERNAME = "PranavViswanathan"
BASE_API = "https://api.github.com"
TOKEN = os.getenv("GITHUB_TOKEN")

EXT_TO_TECH = {
    "py": "Python", "ipynb": "Jupyter Notebook",
    "js": "JavaScript", "ts": "TypeScript", "jsx": "React", "tsx": "React",
    "java": "Java", "kt": "Kotlin",
    "go": "Go", "rs": "Rust", "cpp": "C++", "c": "C", "cs": "C#",
    "rb": "Ruby", "php": "PHP", "swift": "Swift",
    "html": "HTML", "css": "CSS", "scss": "SCSS",
    "sh": "Bash", "yaml": "YAML", "yml": "YAML",
    "tf": "Terraform", "dockerfile": "Docker",
    "sql": "SQL", "r": "R", "m": "MATLAB",
    "md": "Markdown",
}

KEYWORD_TO_TECH = {
    "react": "React", "next": "Next.js", "vue": "Vue.js", "angular": "Angular",
    "fastapi": "FastAPI", "flask": "Flask", "django": "Django", "express": "Express",
    "pytorch": "PyTorch", "tensorflow": "TensorFlow", "sklearn": "scikit-learn",
    "docker": "Docker", "kubernetes": "Kubernetes", "terraform": "Terraform",
    "postgres": "PostgreSQL", "mysql": "MySQL", "mongo": "MongoDB", "redis": "Redis",
    "aws": "AWS", "gcp": "GCP", "azure": "Azure",
    "regex": "Regex", "opencv": "OpenCV", "cuda": "CUDA",
    "kafka": "Kafka", "airflow": "Airflow", "mlflow": "MLflow",
    "langchain": "LangChain", "llamaindex": "LlamaIndex",
    "raft": "Raft", "grpc": "gRPC", "graphql": "GraphQL",
}


def get_repos(username: str, token: Optional[str] = None) -> list:
    headers = {"Authorization": f"token {token}"} if token else {}
    repos, page = [], 1
    while True:
        r = requests.get(
            f"{BASE_API}/users/{username}/repos",
            params={"per_page": 100, "page": page, "type": "public"},
            headers=headers,
        )
        r.raise_for_status()
        batch = r.json()
        if not batch:
            break
        repos.extend(batch)
        page += 1
    return repos


def get_languages(repo_full_name: str, token: Optional[str] = None) -> list:
    headers = {"Authorization": f"token {token}"} if token else {}
    r = requests.get(f"{BASE_API}/repos/{repo_full_name}/languages", headers=headers)
    if r.status_code == 200:
        return list(r.json().keys())
    return []


def get_file_tree(repo_full_name: str, token: Optional[str] = None) -> list:
    headers = {"Authorization": f"token {token}"} if token else {}
    r = requests.get(
        f"{BASE_API}/repos/{repo_full_name}/git/trees/HEAD",
        params={"recursive": "1"},
        headers=headers,
    )
    if r.status_code != 200:
        return []
    return [item["path"] for item in r.json().get("tree", []) if item["type"] == "blob"]


def get_readme(repo_full_name: str, token: Optional[str] = None) -> str:
    headers = {"Authorization": f"token {token}"} if token else {}
    r = requests.get(f"{BASE_API}/repos/{repo_full_name}/readme", headers=headers)
    if r.status_code != 200:
        return ""
    import base64
    content = r.json().get("content", "")
    try:
        return base64.b64decode(content).decode("utf-8", errors="ignore")
    except Exception:
        return ""


def infer_tech(languages: list, file_paths: list, readme: str) -> list:
    tech = set(languages)
    for path in file_paths:
        name = path.lower().split("/")[-1]
        ext = name.rsplit(".", 1)[-1] if "." in name else ""
        if ext in EXT_TO_TECH:
            tech.add(EXT_TO_TECH[ext])
        if name in ("dockerfile", "docker-compose.yml", "docker-compose.yaml"):
            tech.add("Docker")
        if name.endswith(".tf"):
            tech.add("Terraform")

    readme_lower = readme.lower()
    for kw, label in KEYWORD_TO_TECH.items():
        if re.search(rf"\b{re.escape(kw)}\b", readme_lower):
            tech.add(label)

    if "Jupyter Notebook" in tech and "Python" not in tech:
        tech.add("Python")
    tech.discard("Markdown")

    return sorted(tech)


def get_description(repo: dict, readme: str) -> str:
    if repo.get("description"):
        return repo["description"]
    for line in readme.splitlines():
        line = line.strip()
        if line and not line.startswith("#") and len(line) > 20:
            return line[:200]
    return ""


def get_demo_url(readme: str, homepage: Optional[str]) -> str:
    if homepage:
        return homepage
    patterns = [
        r"(?:live demo|demo|deployed at|live at)[^\n]*?(https?://[^\s)>\]]+)",
        r"\[(?:live|demo|app)\]\((https?://[^\)]+)\)",
    ]
    for pat in patterns:
        m = re.search(pat, readme, re.IGNORECASE)
        if m:
            url = m.group(1)
            if "github.com" not in url:
                return url
    return ""


def build_project_json(
    username: str = USERNAME,
    token: Optional[str] = TOKEN,
    skip_forks: bool = True,
) -> list:
    repos = get_repos(username, token)
    projects = []

    for repo in repos:
        if skip_forks and repo.get("fork"):
            continue

        name = repo["name"]
        full_name = repo["full_name"]
        print(f"Processing: {name}")

        languages = get_languages(full_name, token)
        file_paths = get_file_tree(full_name, token)
        readme = get_readme(full_name, token)

        tech = infer_tech(languages, file_paths, readme)
        description = get_description(repo, readme)
        demo = get_demo_url(readme, repo.get("homepage"))

        projects.append({
            "display": False,
            "title": name,
            "description": description,
            "tech": tech,
            "github": f"https://github.com/{full_name}",
            "demo": demo,
        })

    return projects


if __name__ == "__main__":
    if not TOKEN:
        raise ValueError("GITHUB_TOKEN not found in .env")

    projects = build_project_json()

    output_path = "data/github_projects_raw.json"
    os.makedirs("data", exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(projects, f, indent=4)

    print(f"\nDone. {len(projects)} repos written to {output_path}")