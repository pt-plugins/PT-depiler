# PT-depiler Wiki Documentation

This directory contains auto-generated user documentation for PT-depiler.

## 📖 About

The wiki documentation is automatically generated from the codebase using the `scripts/generate-wiki.ts` script.

## 🔄 How It Works

1. The script scans the codebase for site definitions, downloader entities, and backup services
2. It extracts metadata and generates comprehensive markdown documentation
3. A GitHub Actions workflow automatically updates the wiki when code changes are pushed to master
4. The documentation stays in sync with the codebase

## 📚 Generated Pages

- **Home.md** - Main wiki homepage with navigation
- **Supported-Sites.md** - Complete list of all 248+ supported PT sites
- **config-site.md** - Site configuration guide
- **config-download-client.md** - Download client setup guide  
- **config-backup-server.md** - Backup server configuration guide
- **Installation.md** - Installation instructions for all platforms
- **Basic-Configuration.md** - Basic configuration guide
- **FAQ.md** - Frequently asked questions

## 🛠️ Manual Generation

To generate or update the wiki manually:

```bash
pnpm wiki:generate
```

## 📖 Publishing to GitHub Wiki

These markdown files can be synced to the GitHub Wiki. The GitHub Wiki is a separate git repository:

```bash
# Clone the wiki repository
git clone https://github.com/pt-plugins/PT-depiler.wiki.git

# Copy the generated docs
cp wiki/*.md PT-depiler.wiki/

# Commit and push
cd PT-depiler.wiki
git add .
git commit -m "Update wiki documentation"
git push
```

## ⚠️ Important

- **Do not manually edit** the markdown files in this directory - they will be overwritten
- To change documentation, edit `scripts/generate-wiki.ts`
- The wiki auto-updates when site definitions or other relevant files change

## 🔗 Links

- [Main Repository](https://github.com/pt-plugins/PT-depiler)
- [GitHub Wiki](https://github.com/pt-plugins/PT-depiler/wiki)
- [Generation Script](../scripts/generate-wiki.ts)
