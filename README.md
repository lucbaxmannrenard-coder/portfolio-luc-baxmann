# Portfolio Luc Baxmann — scroll cinématique

Landing page où le scroll pilote un vol de caméra continu à travers un « studio tech »
généré par IA (6 scènes, technique scroll-world / pages produit Apple).

- **Prod** : https://portfolio-luc-baxmann.vercel.app (projet Vercel `portfolio-luc-baxmann`, deploy via `cd site && npx vercel deploy --prod`)
- **Repo** : https://github.com/lucbaxmannrenard-coder/portfolio-luc-baxmann
- **Contact pipeline** : formulaire → table `contact_requests` (Supabase `portfolio-luc`, RLS insert-only)
  + notification email via FormSubmit vers luc.baxmannrenard@kedgebs.com
  (⚠️ activer FormSubmit : cliquer le lien de confirmation reçu sur la boîte KEDGE au 1er envoi).
  Lire les demandes : dashboard Supabase → Table Editor → contact_requests.

## Structure

- `site/` — le site final, 100 % statique (index.html + scrub-engine.js + assets).
  Déployable tel quel sur Vercel / Netlify / GitHub Pages.
- `generation/` — pipeline de génération (ne pas déployer) :
  - `pipeline.py` + `work/` : prompts et rendus bruts (Imagen 4 stills, Veo 3.0 legs,
    Vertex AI projet `tiktok-agent-495516`).
  - `encode.sh` : ré-encode les clips pour le scrub (crf 20, GOP 8, faststart).
  - `qa.mjs` : QA Playwright (seams + scrub, Chromium & WebKit).

## Lancer en local

```bash
cd site && python3 -m http.server 8123
# → http://localhost:8123  (il faut un serveur HTTP : les clips sont chargés en Blob)
```

## Journey (6 scènes, un seul vol de caméra)

lobby (hero) → studio web (service 1) → salle d'automatisation (service 2)
→ galerie de résultats (case study Provence E.P.I) → salle de stratégie (ACCEDE)
→ rooftop panoramique de nuit (CTA « free automation audit »).

## À compléter (TODO Luc)

- Liens réels dans `site/index.html` : LinkedIn, Upwork, Malt, GitHub
  (actuellement seuls les `mailto:` sont branchés).
- Quand tu as tes premiers avis clients : ajouter témoignages chiffrés
  (le fond du site de référence byraphaellevy.com — preuves sociales).
- Desktop only par choix : sur mobile les posters s'affichent mais le scrub vidéo
  n'a pas de variantes allégées (`clipMobile`). Générer des encodes 720p `-g 4`
  via `generation/encode.sh` (§ mobile du skill) si besoin plus tard.

## Regénérer une scène

```bash
cd generation
# éditer work/still_<name>.txt ou work/dive_<name>.txt puis :
./venv39/bin/python pipeline.py stills <name>
VID_MODEL=veo-3.0-generate-001 ./venv39/bin/python pipeline.py legs <name>
# ⚠️ architecture A : re-rendre un leg invalide la frame d'entrée des legs suivants —
# re-rendre aussi tous les legs d'après, puis bash encode.sh
```
