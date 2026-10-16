# EstateFlow AI — Vercel testing package

This package contains the static dashboard prototype. It is a visual/interaction demo only: it does not connect to Facebook, TikTok, Messenger, WhatsApp Business, Google Sheets, an AI model, or an Obsidian vault. The sample leads and posts are synthetic. Do not enter real client data or API keys.

## Files

- `index.html` — dashboard shell
- `assets/` — application JavaScript, styles, workflow interactions and brand asset
- `server.py` — optional local preview server; Vercel does not run it

## Test locally (optional)

Requires Python 3. Run from this folder:

```bash
python3 server.py
```

Then open <http://localhost:3000>. Stop the server with `Ctrl+C`.

## Put the files in GitHub using the website

1. Download and extract the ZIP. Open the extracted `estateflow-ai-vercel` folder.
2. In GitHub, create a **New repository** named `estateflow-ai-prototype`. For a private test, choose **Private**. Do not initialize it with a README, license, or `.gitignore` because this package already contains a README.
3. Open the new empty repository and choose **Add file → Upload files**.
4. Drag the *contents* of the extracted folder into the upload area: `index.html`, `README.md`, `server.py`, and the `assets` folder. Do not upload the ZIP itself or an extra enclosing folder.
5. Enter a commit message such as `Add EstateFlow prototype` and click **Commit changes**.
6. Check that `index.html` is at the repository root and `assets/` is alongside it.

## Import the repository into Vercel

1. Sign in to Vercel and select **Add New… → Project**.
2. Connect GitHub if prompted. Grant access to this repository, then choose **Import** beside `estateflow-ai-prototype`.
3. In project configuration, use these settings:
   - **Root Directory:** `./` (the repository root)
   - **Framework Preset:** `Other`
   - **Build Command:** turn on its override and leave the command empty; this site needs no build step
   - **Output Directory:** use the repository root (`.`). With the `Other` preset and no `public/` directory, Vercel serves the root files directly. If the form permits leaving this default, keep it unchanged.
   - **Install Command:** leave the default/empty; there are no dependencies to install
4. Click **Deploy**. When deployment completes, open the Vercel URL and check that the Overview, Research & topics, Content & approvals, Compliance, Settings and Lead CRM views load.
5. Keep the GitHub repository private if desired, and enable Vercel Deployment Protection if the demo URL should not be accessible to others. A private GitHub repository does not, by itself, make a deployed website private.

## Update the test site

After Vercel links the repository, each GitHub push triggers a deployment. Use a branch or pull request to review a Vercel Preview Deployment before merging to the configured production branch (commonly `main`). A push/merge to that production branch updates the production deployment/domain. You can also make later edits in GitHub with **Add file → Upload files** and commit them.

## Prototype limitations

- The dashboard uses synthetic sample records and browser-local demo state; it is not a live CRM and does not sync between devices.
- Social publishing, inbox replies, Google Sheets, AI model calls, live research feeds and Obsidian sync are not connected.
- Compliance checks are prototype decision support only, not a CEA compliance guarantee or legal advice.
- Do not put credentials, customer contact details, valuation requests or other confidential information into this test deployment.
