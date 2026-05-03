import os
import numpy as np
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Initialize the same client you use in app.py
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=GOOGLE_API_KEY)


class SimpleRAG:
    def __init__(self, knowledge_dir="knowledge"):
        self.knowledge_dir = knowledge_dir
        self.chunks = []
        self.embeddings = []

    def load_and_index(self):
        """Reads all .md files and generates embeddings for chunks."""
        self.chunks = []
        self.embeddings = []

        for filename in os.listdir(self.knowledge_dir):
            if filename.endswith(".md"):
                with open(os.path.join(self.knowledge_dir, filename), 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Split by double newline to get sections/paragraphs
                    sections = content.split('\n\n')
                    for section in sections:
                        if len(section.strip()) > 20:  # Skip tiny fragments
                            self.chunks.append({
                                "source": filename,
                                "text": section.strip()
                            })

        # Generate embeddings in bulk for all chunks
        for chunk in self.chunks:
            result = client.models.embed_content(
                model="text-embedding-004",  # Optimized for RAG
                contents=chunk["text"]
            )
            self.embeddings.append(result.embeddings[0].values)

        print(f"Indexed {len(self.chunks)} chunks from {self.knowledge_dir}")

    def retrieve(self, query, top_k=3):
        """Finds the most relevant chunks for a user query."""
        query_embedding = client.models.embed_content(
            model="text-embedding-004",
            contents=query
        ).embeddings[0].values

        # Calculate Cosine Similarity
        similarities = [np.dot(query_embedding, emb) for emb in self.embeddings]

        # Get top K indices
        top_indices = np.argsort(similarities)[-top_k:][::-1]

        context = ""
        for idx in top_indices:
            source = self.chunks[idx]['source']
            text = self.chunks[idx]['text']
            context += f"\n[From {source}]:\n{text}\n"

        return context


# Initialize the RAG
rag = SimpleRAG()
# Run this once when the server starts
rag.load_and_index()