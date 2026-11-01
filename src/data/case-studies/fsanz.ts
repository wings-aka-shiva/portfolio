export interface CaseStudyDecision {
  title: string;
  body: string;
}

export interface DiagramBox {
  id: string;
  lines: string[];
}

export const fsanz = {
  slug: "fsanz-regulatory-assistant",
  title: "FSANZ Regulatory Assistant",
  subtitle:
    "An AI assistant that checks food labels against the Australia New Zealand Food Standards Code and returns cited, reason-coded results.",
  meta: ["Food Systems Collective", "RMIT industry project", "Team of 5", "13 weeks", "Jul - Nov 2026"],
  role: "Software Engineer. Product lead with the client, AI and frontend engineer.",
  privacy: "Private · Client project",

  problem:
    "Food businesses have to check labels against a long, dense legal code. Answers need to be correct, and they need to point to the exact clause, or nobody can trust them.",

  /** Query path, left to right (top to bottom on phones) */
  pipeline: [
    { id: "input", lines: ["Question or", "label image"] },
    { id: "expand", lines: ["Multi-query", "expansion", "(4 queries)"] },
    { id: "search", lines: ["Pinecone semantic", "search (Titan v2,", "jurisdiction filter)"] },
    { id: "fuse", lines: ["Reciprocal Rank", "Fusion +", "neighbouring chunks"] },
    { id: "generate", lines: ["Evidence-only", "generation on", "AWS Bedrock (Nova", "Lite, vision for", "labels)"] },
    { id: "result", lines: ["Result: 3 statuses,", "6 reason codes,", "citations"] },
  ] satisfies DiagramBox[],

  /** Ingestion branch that feeds the Pinecone index */
  ingestion: [
    { id: "code", lines: ["Food Standards", "Code"] },
    { id: "ingest", lines: ["Structure-aware", "ingestion", "(3,163 chunks)"] },
  ] satisfies DiagramBox[],

  stack: ["React 18", "TypeScript", "FastAPI", "PostgreSQL", "AWS (Bedrock, Cognito, ECS, CodeBuild)", "Pinecone", "GitHub Actions"],

  decisions: [
    {
      title: "Structure-aware chunking with deterministic IDs.",
      body: "Citations must survive re-indexing, so every chunk carries clause-level metadata and a stable ID, and upserts run in resumable batches.",
    },
    {
      title: "An extractor version guard.",
      body: "Two pdftotext builds produced 3,163 vs 2,873 chunks, silently misaligning citations. SHA-256 source manifests and splitting parsing from indexing fixed it.",
    },
    {
      title: "Reason codes instead of PASS/WARNING/FAIL.",
      body: "3 statuses and 6 reason codes tell users what to fix, and became the shared contract between AI, backend and frontend.",
    },
    {
      title: "A Protocol boundary around the AI.",
      body: "10 AI modules sit behind a 5-method boundary, so 112 tests run offline without API keys or cloud credentials.",
    },
  ] satisfies CaseStudyDecision[],

  evaluation:
    "We ran a 44-question evaluation set and hand-verified 22 answers. An earlier accuracy figure could not be reproduced, so the team stopped quoting it. I also measured a real limitation: 1,747 chunks (55% of the retrievable corpus) carry no clause number, so schedule citations can only point to a whole schedule. We told the client instead of hiding it.",

  delivery: [
    "Cognito sign-in with single-flight token refresh and request replay, so a burst of calls shares one refresh and nobody sees an expired-token error.",
    "An access-request and admin-approval workflow, so new users ask for access and an admin signs them off.",
    "Product lead with the client, Scrum in Jira, reviewing all FastAPI code, and shipping through GitHub Actions and CodeBuild to ECS.",
  ],

  next: "Resolve schedule citations below whole-schedule level, grow the hand-verified evaluation set, and track retrieval quality per jurisdiction.",
};
