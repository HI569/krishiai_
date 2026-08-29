# RAG / LangGraph integration

The demo uses a small local agricultural knowledge base so it works without external API keys. `graph.py` contains the LangGraph workflow and retrieval adapter.

For production:
1. Ingest trusted agricultural PDFs/guides into `data/`.
2. Chunk documents and create embeddings.
3. Store vectors in pgvector, Chroma or another vector store.
4. Replace `retrieve()` with the vector retriever.
5. Connect an LLM through environment variables only.
6. Add a quality/safety node that checks pesticide/fertilizer claims and uncertainty.
7. Add translation after answer generation.
