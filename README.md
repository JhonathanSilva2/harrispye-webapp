## Getting Started
**Deploy Teste - [23/10/2025 - 09:39]**
### Docs

-   [MySQL](https://dev.mysql.com/doc/refman/8.4/en/introduction.html)
-   [Prisma](https://www.prisma.io/docs/orm/overview)
-   [Next.js](https://nextjs.org/docs)
-   [Next Auth](https://next-auth.js.org/getting-started/introduction)
-   [Shadcn - UI](https://ui.shadcn.com/docs)
-   [Sonner - Toaster](https://sonner.emilkowal.ski/)
-   [Tanstack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
-   [Tanstack Table](https://tanstack.com/table/latest/docs/introduction)

### Prerequisites

Before you begin, ensure you have the following installed:

-   **MySQL 8.0 InnoDB**: [Download MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
-   **Node.js v20**: [Download Node.js v20.18.2](https://nodejs.org/dist/v20.18.2/node-v20.18.2-x64.msi)

### Installation

Follow these steps to set up the project:

1. Install the necessary npm packages:

    ```bash
    npm install
    ```

2. Initialize Prisma:
    ```bash
    npm run prisma-init
    ```

You're all set! If you encounter any issues, please refer to the project's documentation or reach out to the team for assistance.

### Quality of Life

This is a git command to delete all your branches that don't exist on remote git. Saves you from search in lots of old branches in your local.

```bash
git fetch -p && for branch in $(git for-each-ref --format '%(refname) %(upstream:track)' refs/heads | awk '$2 == "[gone]" {sub("refs/heads/", "", $1); print $1}'); do git branch -D $branch; done
```
