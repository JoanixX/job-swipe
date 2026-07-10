from sklearn.cluster import KMeans
from sklearn.neighbors import NearestNeighbors

class KawsAIModel:
    def __init__(self):
        pass

    def get_best_job_offers(self, job_offer_embeddings, student_embedding):
        n_neighbors = min(5, len(job_offer_embeddings))
        if n_neighbors == 0:
            return [], []
            
        knn_job_offer = NearestNeighbors(n_neighbors=n_neighbors, metric='cosine')
        knn_job_offer.fit(job_offer_embeddings)
        distances, indexes = knn_job_offer.kneighbors(student_embedding)
        return 1 - distances[0], indexes[0]

    def get_best_students(self, student_embeddings, job_offer_embedding):
        n_neighbors = min(10, len(student_embeddings))
        if n_neighbors == 0:
            return [], []
            
        knn_student = NearestNeighbors(n_neighbors=n_neighbors, metric='cosine')
        knn_student.fit(student_embeddings)
        distances, indexes = knn_student.kneighbors(job_offer_embedding)
        return 1 - distances[0], indexes[0]