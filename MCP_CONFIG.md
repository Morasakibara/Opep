# 🛠️ CONFIGURATION MCP - PROJET OPEP

Pour assurer une cohérence entre tous les membres de l'équipe (humains et agents), voici la configuration MCP recommandée.

## 1. Serveurs MCP Requis

| Serveur | Usage | Configuration |
| :--- | :--- | :--- |
| **Filesystem** | Lecture/Écriture du code | Accès aux dossiers `Opep` et `Minimarket` |
| **Postgres** | Gestion de la base de données | Accès à la DB `opep_db` |
| **Shell** | Exécution de commandes | PowerShell / Bash |
| **Web Search** | Documentation technique | Recherche Google / Web Fetch |

## 2. Fichier de Configuration (JSON)

Copiez ce bloc dans votre fichier de configuration MCP (Gemini/Claude/Codebuff) :

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:/MAMP/htdocs/Projet/Opep", "C:/MAMP/htdocs/Projet/Minimarket"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://postgres:password@localhost:5432/opep_db"]
    },
    "shell": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-shell"]
    },
    "stitch": {
      "command": "npx",
      "args": ["-y", "@_davideast/stitch-mcp", "proxy"],
      "env": {
        "STITCH_API_KEY": "REPLACE_WITH_YOUR_OWN_KEY",
        "STITCH_HOST": "stitch.googleapis.com"
      }
    }
  }
}
```

## 3. Installation
1. Assurez-vous d'avoir **Node.js** installé.
2. Les serveurs seront installés automatiquement via `npx` lors du premier lancement.
3. Redémarrez votre client MCP après avoir modifié la configuration.

## 4. MCP Stitch — Google Stitch AI Design

| Serveur | Usage | Configuration |
| :--- | :--- | :--- |
| **Stitch** | Design-to-code Google Stitch | Clé API (fournie) |

**MCP Stitch** (package `@_davideast/stitch-mcp`) permet aux agents IA de se connecter à **Google Stitch** — un outil de design AI qui génère des UI/UX à partir de descriptions en langage naturel.

### Fonctionnalités disponibles :
- **Lister les projets et écrans** Stitch
- **Récupérer le HTML/CSS** d'un écran spécifique
- **Obtenir des screenshots base64** des designs
- **Assembler un site multi-pages** via l'outil `build_site`
- **Extraire les tokens de design** (couleurs, espacements, typographie)

### Où placer la configuration :

| Client | Emplacement du fichier |
| :--- | :--- |
| **VS Code / Cursor** | `.vscode/mcp.json` ou `claude_desktop_config.json` |
| **Gemini CLI** | Fichier de configuration Gemini |
| **Claude Desktop** | `claude_desktop_config.json` |
| **OpenCode** | `config.json` dans le dossier OpenCode |

> ⚠️ **Important** : Le `STITCH_HOST` est fixé à `https://stitch.googleapis.com/mcp` car le domaine par défaut `stitch.mystitch.ai` n'existe pas dans le DNS.
> La clé API est intégrée dans la configuration ci-dessus.
> 🔑 **Avant de pouvoir utiliser Stitch**, vous devez :
> 1. Aller sur https://stitch.withgoogle.com et créer un compte/projet
> 2. Activer l'API Stitch sur Google Cloud Console
> 3. Activer la facturation sur le projet GCP
> 4. Exécuter `stitch-mcp init` pour finaliser l'authentification OAuth
> Documentation officielle : https://github.com/davideast/stitch-mcp
