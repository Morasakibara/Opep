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

Copiez ce bloc dans votre fichier de configuration Gemini/Claude :

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
    }
  }
}
```

## 3. Installation
1. Assurez-vous d'avoir **Node.js** installé.
2. Les serveurs seront installés automatiquement via `npx` lors du premier lancement.
3. Redémarrez votre client Gemini après avoir modifié la configuration.
