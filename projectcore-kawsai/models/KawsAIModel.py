from sklearn.cluster import KMeans
from sklearn.neighbors import NearestNeighbors

class KawsAIModel:
    def __init__(self):
        self.knn_job_offer = NearestNeighbors(n_neighbors=3, metric='cosine')
        self.knn_student = NearestNeighbors(n_neighbors=3, metric='cosine')

    def get_best_job_offers(self, job_offer_embeddings, student_embedding):
        self.knn_student.fit(job_offer_embeddings)
        distances, indexes = self.knn_student.kneighbors(student_embedding)
        return 1 - distances[0], indexes[0]

    def get_best_students(self, student_embeddings, job_offer_embedding):
        self.knn_job_offer.fit(student_embeddings)
        distances, indexes = self.knn_job_offer.kneighbors(job_offer_embedding)
        return 1 - distances[0], indexes[0]