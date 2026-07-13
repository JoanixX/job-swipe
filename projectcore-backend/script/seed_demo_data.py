"""Seed de datos de demostración: empresas y ofertas laborales.

Uso (con el backend corriendo en localhost:8000):
    python script/seed_demo_data.py
"""
import json
import urllib.request
from datetime import date, timedelta

API = "http://localhost:8000/api"

COMPANIES = [
    {"name": "TechNova Perú", "industry": "Tecnología", "company_culture": "Innovación y aprendizaje continuo",
     "contact_email": "rrhh@technova.pe", "phone": "+51 999 111 222", "website": "https://technova.pe", "location": "Miraflores, Lima"},
    {"name": "Banco Andino", "industry": "Finanzas", "company_culture": "Excelencia y compromiso",
     "contact_email": "talento@bancoandino.pe", "phone": "+51 999 222 333", "website": "https://bancoandino.pe", "location": "San Isidro, Lima"},
    {"name": "Kallpa Digital", "industry": "Marketing Digital", "company_culture": "Creatividad sin límites",
     "contact_email": "hola@kallpa.digital", "phone": "+51 999 333 444", "website": "https://kallpa.digital", "location": "Barranco, Lima"},
    {"name": "AgroFuturo SAC", "industry": "Agroindustria", "company_culture": "Sostenibilidad e impacto",
     "contact_email": "rrhh@agrofuturo.pe", "phone": "+51 999 444 555", "website": "https://agrofuturo.pe", "location": "La Molina, Lima"},
    {"name": "Salud Total", "industry": "Salud", "company_culture": "Cuidado centrado en las personas",
     "contact_email": "seleccion@saludtotal.pe", "phone": "+51 999 555 666", "website": "https://saludtotal.pe", "location": "Jesús María, Lima"},
]

# (company_index, title, description, hours, salary, duration_meses, modality, location)
OFFERS = [
    (0, "Desarrollador Frontend Jr.", "Desarrolla interfaces con React y TypeScript para nuestros productos web. Trabajarás junto a un equipo senior.", 30, 1500, 6, 3, "Miraflores, Lima"),
    (0, "Practicante Backend Python", "Apoya en el desarrollo de APIs con FastAPI y PostgreSQL. Ideal para estudiantes de últimos ciclos.", 25, 1200, 6, 2, "Miraflores, Lima"),
    (0, "QA Tester Junior", "Ejecuta pruebas funcionales y automatizadas de nuestras aplicaciones móviles y web.", 30, 1300, 4, 3, "Miraflores, Lima"),
    (1, "Practicante de Análisis de Datos", "Analiza datos financieros con Excel avanzado, SQL y Power BI para el área de riesgos.", 30, 1400, 6, 1, "San Isidro, Lima"),
    (1, "Asistente de Operaciones Bancarias", "Apoya en la gestión de procesos operativos y atención de requerimientos internos.", 35, 1250, 6, 1, "San Isidro, Lima"),
    (1, "Practicante de Ciberseguridad", "Monitorea alertas de seguridad y apoya en auditorías internas de sistemas.", 30, 1600, 6, 3, "San Isidro, Lima"),
    (2, "Community Manager Trainee", "Gestiona redes sociales de marcas reconocidas y crea contenido creativo.", 25, 1100, 3, 2, "Barranco, Lima"),
    (2, "Diseñador UX/UI Junior", "Diseña experiencias digitales en Figma para clientes de diversas industrias.", 30, 1400, 6, 3, "Barranco, Lima"),
    (2, "Practicante SEO y Analítica", "Optimiza sitios web y elabora reportes con Google Analytics y Search Console.", 25, 1150, 4, 2, "Barranco, Lima"),
    (3, "Practicante de Ing. Ambiental", "Apoya en estudios de impacto ambiental y gestión de residuos en planta.", 35, 1300, 6, 1, "La Molina, Lima"),
    (3, "Asistente de Logística", "Coordina despachos y controla inventarios en nuestro centro de distribución.", 35, 1200, 6, 1, "La Molina, Lima"),
    (4, "Practicante de Administración", "Apoya en la gestión administrativa y documentaria de la red de clínicas.", 30, 1150, 6, 1, "Jesús María, Lima"),
    (4, "Asistente de Recursos Humanos", "Participa en procesos de selección, onboarding y clima laboral.", 30, 1250, 6, 3, "Jesús María, Lima"),
    (4, "Practicante de Contabilidad", "Registra operaciones contables y apoya en conciliaciones bancarias.", 30, 1200, 6, 1, "Jesús María, Lima"),
    (0, "Data Science Intern", "Entrena modelos de machine learning y construye dashboards con Python.", 25, 1700, 6, 2, "Miraflores, Lima"),
]


def post(path: str, payload: dict) -> dict:
    req = urllib.request.Request(
        f"{API}{path}",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read())


def main():
    start = (date.today() + timedelta(days=30)).isoformat()
    company_ids = []

    for company in COMPANIES:
        result = post("/register/company", company)
        company_id = result.get("company_id") or result.get("id")
        company_ids.append(company_id)
        print(f"Empresa creada: {company['name']} (id={company_id})")

    created = 0
    for idx, title, desc, hours, salary, duration, modality, location in OFFERS:
        payload = {
            "company_id": company_ids[idx],
            "title": title,
            "description": desc,
            "required_hours": hours,
            "approximated_salary": salary,
            "duration": duration,
            "start_date": start,
            "modality": modality,
            "location": location,
        }
        result = post("/register/job_offer", payload)
        created += 1
        print(f"Oferta creada: {title}")

    print(f"\nListo: {len(company_ids)} empresas y {created} ofertas.")


if __name__ == "__main__":
    main()
