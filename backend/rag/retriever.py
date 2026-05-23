import os
import pickle

import numpy as np

from .build_index import (
    INDEX_PATH,
    META_PATH,
    NUMPY_INDEX_PATH,
    build_index,
    detect_index_format,
    embed_texts,
)

try:
    import faiss
except ImportError:  # pragma: no cover
    faiss = None


def _ensure_assets():
    has_metadata = os.path.exists(META_PATH)
    has_any_index = os.path.exists(INDEX_PATH) or os.path.exists(NUMPY_INDEX_PATH)
    if not has_metadata or not has_any_index:
        build_index()
        return

    if faiss is None:
        numpy_format = detect_index_format(NUMPY_INDEX_PATH)
        legacy_format = detect_index_format(INDEX_PATH)
        if numpy_format == "missing" and legacy_format == "faiss":
            build_index(force_format="numpy")


def _load_chunks():
    with open(META_PATH, "rb") as meta_file:
        return pickle.load(meta_file)


def _rank_with_matrix(query_vector, matrix, chunks, top_k):
    distances = np.linalg.norm(matrix - query_vector[0], axis=1)
    indices = np.argsort(distances)[:top_k]
    return [
        {"text": chunks[idx], "score": round(1.0 / (1.0 + float(distances[idx])), 4)}
        for idx in indices
    ]


def _load_numpy_matrix():
    if os.path.exists(NUMPY_INDEX_PATH):
        candidate_path = NUMPY_INDEX_PATH
    else:
        legacy_format = detect_index_format(INDEX_PATH)
        if legacy_format != "numpy":
            build_index(force_format="numpy")
            candidate_path = NUMPY_INDEX_PATH
        else:
            candidate_path = INDEX_PATH

    with open(candidate_path, "rb") as index_file:
        return np.load(index_file)


def _search_with_faiss(query_vector, chunks, top_k):
    index_format = detect_index_format(INDEX_PATH)

    if index_format == "missing":
        build_index(force_format="faiss")
    elif index_format == "numpy":
        # A stale fallback artifact was saved under the FAISS filename.
        build_index(force_format="faiss")

    index = faiss.read_index(INDEX_PATH)
    distances, indices = index.search(query_vector, top_k)
    ranked = []
    for distance, idx in zip(distances[0], indices[0]):
        if idx < 0 or idx >= len(chunks):
            continue
        ranked.append(
            {
                "text": chunks[idx],
                "score": round(1.0 / (1.0 + float(distance)), 4),
            }
        )
    return ranked


def retrieve_relevant(query, top_k=3):
    _ensure_assets()
    chunks = _load_chunks()

    query_vector = embed_texts([query]).astype("float32")

    if faiss is not None:
        try:
            return _search_with_faiss(query_vector, chunks, top_k)
        except Exception:
            build_index(force_format="numpy")

    matrix = _load_numpy_matrix()
    return _rank_with_matrix(query_vector, matrix, chunks, top_k)
