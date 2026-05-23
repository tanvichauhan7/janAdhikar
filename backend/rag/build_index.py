import os
import pickle

import numpy as np

from .schemes_data import SCHEME_CHUNKS

try:
    import faiss
except ImportError:  # pragma: no cover
    faiss = None

try:
    from sentence_transformers import SentenceTransformer
except ImportError:  # pragma: no cover
    SentenceTransformer = None


BASE_DIR = os.path.dirname(__file__)
INDEX_PATH = os.path.join(BASE_DIR, "faiss_index.bin")
NUMPY_INDEX_PATH = os.path.join(BASE_DIR, "embeddings.npy")
META_PATH = os.path.join(BASE_DIR, "chunks.pkl")
MODEL_NAME = "all-MiniLM-L6-v2"
MODEL_CACHE = None
NUMPY_MAGIC = b"\x93NUMPY"


def _hashed_embed(texts, dim=256):
    vectors = np.zeros((len(texts), dim), dtype="float32")
    for row_index, text in enumerate(texts):
        for token in str(text).lower().split():
            bucket = hash(token) % dim
            vectors[row_index, bucket] += 1.0

    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    norms[norms == 0.0] = 1.0
    return vectors / norms


def get_model():
    global MODEL_CACHE
    if MODEL_CACHE is not None:
        return MODEL_CACHE
    if SentenceTransformer is None:
        return None

    try:
        MODEL_CACHE = SentenceTransformer(MODEL_NAME)
    except Exception:
        MODEL_CACHE = None
    return MODEL_CACHE


def embed_texts(texts):
    model = get_model()
    if model is None:
        return _hashed_embed(texts)
    return np.asarray(model.encode(texts, show_progress_bar=False), dtype="float32")


def _cleanup_old_artifacts():
    for path in (INDEX_PATH, NUMPY_INDEX_PATH):
        if os.path.exists(path):
            os.remove(path)


def detect_index_format(path):
    if not os.path.exists(path):
        return "missing"

    with open(path, "rb") as index_file:
        prefix = index_file.read(len(NUMPY_MAGIC))

    if prefix == NUMPY_MAGIC:
        return "numpy"
    return "faiss"


def build_index(force_format=None):
    embeddings = embed_texts(SCHEME_CHUNKS)
    _cleanup_old_artifacts()

    use_faiss = force_format != "numpy" and faiss is not None

    if use_faiss:
        dim = embeddings.shape[1]
        index = faiss.IndexFlatL2(dim)
        index.add(embeddings)
        faiss.write_index(index, INDEX_PATH)
    else:
        with open(NUMPY_INDEX_PATH, "wb") as index_file:
            np.save(index_file, embeddings)

    with open(META_PATH, "wb") as meta_file:
        pickle.dump(SCHEME_CHUNKS, meta_file)

    return {
        "count": len(SCHEME_CHUNKS),
        "format": "faiss" if use_faiss else "numpy",
    }


if __name__ == "__main__":
    count = build_index()
    print(
        f"Index built successfully with {count['count']} chunks using {count['format']} storage."
    )
