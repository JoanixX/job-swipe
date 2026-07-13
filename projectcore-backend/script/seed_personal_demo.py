"""Seed personal de demostración:
- Garantiza al menos 7 ofertas SIN swipear por cada estudiante activo
  (crea ofertas nuevas alineadas al CV de prueba si hacen falta).
- Crea 2 matches mutuos por estudiante (postulación aceptada por la empresa).

Uso (backend corriendo en localhost:8000):
    python script/seed_personal_demo.py
"""
import json
import urllib.request
from datetime import date, timedelta

API = "http://localhost:8000/api"

# Ofertas alineadas a las skills del CV de prueba (React, TypeScript, Python, SQL, Power BI, Figma...)
EXTRA_OFFERS = [
    ("Desarrollador React Trainee", "Construye componentes con React, TypeScript y CSS junto a un mentor senior. Usamos Git y metodologia Scrum.", 25, 1500, 6, 3),
    ("Practicante Python + SQL", "Automatiza procesos con Python y consultas SQL sobre PostgreSQL. Ideal para perfil de datos.", 30, 1400, 6, 2),
    ("Analista de Datos Jr. (Power BI)", "Elabora dashboards en Power BI y reportes en Excel con datos de ventas. SQL intermedio requerido.", 30, 1350, 6, 1),
    ("Practicante UI/UX con Figma", "Diseña prototipos en Figma y colabora con el equipo frontend React aplicando principios UI/UX.", 25, 1250, 4, 2),
    ("Fullstack Junior (React + Django)", "Desarrolla features end-to-end con React en el frontend y Django + REST API en el backend.", 30, 1700, 6, 3),
    ("Practicante DevOps", "Apoya despliegues con Docker y Linux, versionado con Git y pipelines de integracion continua.", 25, 1600, 6, 2),
    ("Practicante Machine Learning", "Entrena modelos de Machine Learning con Python y bases de datos MongoDB/PostgreSQL.", 25, 1800, 6, 2),
]


def get(path):
    with urllib.request.urlopen(f"{API}{path}") as res:
        return json.loads(res.read())


def post(path, payload):
    req = urllib.request.Request(f"{API}{path}", data=json.dumps(payload).encode(),
                                 headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read())


def main():
    students = get("/student/all")
    offers = get("/job_offer/all")
    companies = {c["id"]: c for c in get("/company/all")}
    offer_company = {o["id"]: o["company_id"] for o in offers}
    all_offer_ids = [o["id"] for o in offers]
    start = (date.today() + timedelta(days=30)).isoformat()

    default_company = offers[0]["company_id"] if offers else 1

    for student in students:
        sid = student["id"]
        swiped = {a["job_offer_id"] for a in get(f"/swipes/student/{sid}")}
        unswiped = [oid for oid in all_offer_ids if oid not in swiped]

        # 1. Garantizar 7+ ofertas por swipear (crear alineadas al CV si faltan)
        missing = 7 - len(unswiped)
        created = 0
        while created < missing and created < len(EXTRA_OFFERS):
            title, desc, hours, salary, duration, modality = EXTRA_OFFERS[created]
            result = post("/register/job_offer", {
                "company_id": default_company, "title": title, "description": desc,
                "required_hours": hours, "approximated_salary": salary, "duration": duration,
                "start_date": start, "modality": modality, "location": "Miraflores, Lima",
            })
            new_id = result.get("job_offer_id") or result.get("id")
            if new_id:
                all_offer_ids.append(new_id)
                offer_company[new_id] = default_company
                unswiped.append(new_id)
            created += 1
            print(f"  Oferta extra creada: {title}")

        # 2. Crear 2 matches mutuos (swipe estudiante + swipe empresa)
        existing_matches = get(f"/matches/student/{sid}")
        needed = 2 - len(existing_matches)
        made = 0
        for oid in list(unswiped):
            if made >= needed:
                break
            try:
                post("/swipe/student", {"student_id": sid, "job_offer_id": oid, "liked": True})
                post("/swipe/company", {"company_id": offer_company[oid], "student_id": sid,
                                        "job_offer_id": oid, "liked": True})
                unswiped.remove(oid)
                made += 1
                print(f"  Match mutuo creado: estudiante {sid} <-> oferta {oid}")
            except Exception as e:
                print(f"  (aviso) no se pudo crear match con oferta {oid}: {e}")

        print(f"Estudiante {sid}: {len(unswiped)} ofertas por swipear, "
              f"{len(get(f'/matches/student/{sid}'))} matches mutuos.\n")


if __name__ == "__main__":
    main()
