# JobSwipe — Student/offer matching platform with an embedding-based recommender

A four-service platform that matches university students to company job offers. Profiles
and offers are turned into field-weighted text, embedded with a multilingual
sentence-transformer, indexed in Qdrant, and ranked by cosine k-NN; a swipe layer on top
records intent from both sides and promotes a pair to a match only when both swipe right.
The relational side is 20 tables under an async SQLAlchemy/PostgreSQL backend organized
as ports and adapters.

![JobSwipe](JobSwipe.svg)

**License:** MIT (per-service `LICENSE` files) · **Local startup:** [comandos.md](comandos.md)

## Results

The recommender is unevaluated. There is no held-out split, no labelled relevance
judgements, and therefore no Recall@k or MRR to report — the repository ships a timing
harness, not an accuracy benchmark, and the table below only contains what that harness
actually measures.

| Measured quantity | What the harness reports | Source |
|---|---|---|
| Model load time | wall-clock seconds to load the sentence-transformer | `projectcore-kawsai/analyze_metrics.py` |
| Encode throughput | seconds per student and per offer over a 5×5 mock set | `projectcore-kawsai/analyze_metrics.py` |
| Similarity computation | wall-clock seconds for the full cosine matrix | `projectcore-kawsai/analyze_metrics.py` |
| Ranking depth | top-5 offers per student, top-10 students per offer | `projectcore-kawsai/models/KawsAIModel.py` |

Reproduce: `cd projectcore-kawsai && python analyze_metrics.py`

Numbers are hardware-dependent and are deliberately not transcribed here — running the
command prints them for the machine that will serve the model. Closing the accuracy gap
is the first item under Limitations.

## How it works

- **Profile fields are weighted by repeating them in the text, not by weighting vectors.**
  `preprocessing/preprocesador.py` builds a student profile as `career`×1, `skills`×3,
  `interests`×3, `description`×3, `experience`×5, and an offer as `title`×1,
  `description`×3, `area`×8, `required_skills`×10. The sentence encoder has no per-field
  input, so term repetition is the available lever to make required skills dominate the
  embedding instead of prose length.
- **Text is lemmatized and stop-word-filtered with spaCy (`es_core_news_sm`) before
  encoding**, so morphological variants of the same Spanish skill term collapse to one
  token rather than spreading the signal.
- **Matching is cosine k-NN over embeddings, not a trained ranker**
  (`models/KawsAIModel.py`). With no interaction history at launch there is nothing to
  train a supervised ranker on; k-NN gives a usable cold-start ordering and returns
  `1 - distance` as the score so the API surfaces a similarity, not a distance.
- **The AI service holds no database.** `projectcore-kawsai` receives already-fetched
  records over HTTP and returns embeddings or rankings; the backend owns Postgres and
  Qdrant. This keeps the model service stateless and independently deployable, at the
  cost of shipping profile payloads over the wire on every call.
- **A swipe only becomes a match on mutual right-swipe.** `routes/swipe/router.py` finds
  or creates the `match_job_student` row and requires both sides; the AI score
  pre-populates the row but does not by itself constitute a match.
- **Deletes are soft across the schema.** Every lookup filters `deleted_at IS NULL`, so
  a removed student or offer disappears from matching without breaking the foreign keys
  of agreements and matches that already reference it.

## Quick start

```bash
docker-compose up --build          # Postgres 15, Qdrant, kawsai (:8001), backend (:8000)
cd projectcore-frontend && npm install && npm run dev   # :5173
```

The AI service needs the spaCy Spanish model on first run:
`python -m spacy download es_core_news_sm`.

| Service | Path | Stack |
|---|---|---|
| Backend API | `projectcore-backend/` | FastAPI, async SQLAlchemy + asyncpg, hexagonal layering, JWT |
| AI matching | `projectcore-kawsai/` | sentence-transformers, spaCy, scikit-learn k-NN, Qdrant |
| Assistant | `projectcore-assistant/` | FastAPI chatbot over OpenRouter, PDF ingestion, n8n/Evolution webhooks |
| Frontend | `projectcore-frontend/` | React + Vite + TypeScript + Tailwind |

Full local startup, service by service: [comandos.md](comandos.md). Backend architecture:
[projectcore-backend/README.md](projectcore-backend/README.md). Endpoint reference:
[projectcore-kawsai/docs/API_MODULES.md](projectcore-kawsai/docs/API_MODULES.md).

## Data & provenance

The modelling corpus is synthetic: 5,000 companies and 20,000 student profiles generated
with an LLM and stored as `estudiantes.csv` / `mypes.csv`, documented in
[projectcore-kawsai/docs/pipeline.md](projectcore-kawsai/docs/pipeline.md). No real
student or employer records are in this repository. Runtime data is whatever the
deployed backend persists to PostgreSQL; embeddings are derived, stored in Qdrant, and
fully rebuildable from the source rows.

## Limitations

- **No retrieval quality is measured.** Every claim about match quality currently rests
  on inspecting a 5×5 similarity matrix by eye. Without a held-out split and relevance
  labels there is no evidence the weighted-repetition scheme beats plain concatenation,
  and the weights (×3/×5/×8/×10) were chosen by judgement, not by tuning.
- **The corpus is LLM-generated.** Synthetic profiles are cleaner and more uniformly
  phrased than real CVs, so encoder performance here is an optimistic bound; skill
  abbreviations, typos, and mixed Spanish/English are underrepresented.
- **Two different encoders appear in the codebase.** `preprocesador.py` uses
  `paraphrase-multilingual-MiniLM-L12-v2` while `analyze_metrics.py` benchmarks
  `all-MiniLM-L6-v2`, so the timing harness does not measure the model actually serving
  matches, and its numbers understate load and encode cost.
- **k-NN depth is hardcoded** at 5 offers and 10 students, with no pagination, no
  diversity constraint, and no filter for offers a student has already swiped — the
  ranking is recomputed and re-served identically until the underlying profile changes.
- **The matching service trusts its caller.** It has no authentication of its own and
  assumes the backend has already authorized the request and resolved the records it is
  handed.

## License

MIT — see the `LICENSE` file in each service directory.
