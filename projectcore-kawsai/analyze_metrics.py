import time
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import sys

def main():
    print("Loading model 'all-MiniLM-L6-v2'...")
    start_load = time.time()
    try:
        model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    except Exception as e:
        print(f"Error loading model: {e}")
        sys.exit(1)
    
    load_time = time.time() - start_load
    print(f"Model loaded in {load_time:.2f} seconds.\n")

    # Mock Data
    students = [
        "career: Ingeniería de Sistemas skills: Python, React, SQL interests: Inteligencia Artificial description: Desarrollador full stack apasionado por la IA experience: 1 año en startups",
        "career: Administración skills: Excel, PowerBI, Gestión interests: Finanzas description: Organizado, líder experience: Prácticas en banco",
        "career: Diseño Gráfico skills: Figma, Photoshop, Illustrator interests: UI/UX description: Creativo y detallista experience: Freelance",
        "career: Ingeniería de Software skills: Java, Spring Boot, AWS interests: Backend description: Desarrollador backend con experiencia en microservicios experience: 2 años en consultora",
        "career: Marketing skills: SEO, SEM, Google Analytics interests: Marketing Digital description: Especialista en marketing digital experience: 1 año en agencia"
    ]

    jobs = [
        "title: Desarrollador Backend Python description: Buscamos dev con exp en Python y APIs area: Tecnología required_skills: Python, SQL, FastAPI",
        "title: Analista Financiero description: Análisis de datos y proyecciones area: Finanzas required_skills: Excel, PowerBI, Finanzas",
        "title: Diseñador UI/UX description: Diseño de interfaces web y móvil area: Diseño required_skills: Figma, Prototipado",
        "title: Desarrollador Full Stack description: Mantenimiento y creación de nuevas features area: Tecnología required_skills: React, Node.js",
        "title: Especialista en Marketing description: Campañas digitales y análisis area: Marketing required_skills: SEO, SEM, Analytics"
    ]

    print("Encoding students...")
    start_encode = time.time()
    student_embeddings = model.encode(students)
    student_encode_time = time.time() - start_encode
    print(f"Encoded {len(students)} students in {student_encode_time:.4f} seconds ({student_encode_time/len(students):.4f} s/student).\n")

    print("Encoding jobs...")
    start_encode = time.time()
    job_embeddings = model.encode(jobs)
    job_encode_time = time.time() - start_encode
    print(f"Encoded {len(jobs)} jobs in {job_encode_time:.4f} seconds ({job_encode_time/len(jobs):.4f} s/job).\n")

    print("Calculating cosine similarities...")
    start_sim = time.time()
    similarities = cosine_similarity(student_embeddings, job_embeddings)
    sim_time = time.time() - start_sim
    print(f"Calculated similarities matrix in {sim_time:.6f} seconds.\n")

    print("Similarity Matrix (Rows: Students, Cols: Jobs):")
    for i, s in enumerate(students):
        print(f"Student {i+1} ({s[:30]}...):")
        for j, jb in enumerate(jobs):
            print(f"  -> Job {j+1}: {similarities[i][j]:.4f}")
        print()

if __name__ == '__main__':
    main()
