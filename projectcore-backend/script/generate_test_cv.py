"""Genera un CV de prueba en PDF cuyo contenido dispara la extracción de
habilidades del servicio IA (React, TypeScript, Python, SQL, etc.).

Uso: python script/generate_test_cv.py [ruta_salida]
"""
import sys
from fpdf import FPDF

OUTPUT = sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\practicante.coe03\Desktop\CV_Prueba_JobSwipe.pdf"

NAVY = (30, 58, 138)
INDIGO = (99, 102, 241)
GRAY = (90, 90, 90)


def main():
    pdf = FPDF()
    pdf.add_page()

    # Encabezado
    pdf.set_fill_color(*NAVY)
    pdf.rect(0, 0, 210, 34, "F")
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_xy(12, 8)
    pdf.cell(0, 10, "Joan Alvarado Osorio")
    pdf.set_font("Helvetica", "", 11)
    pdf.set_xy(12, 19)
    pdf.cell(0, 8, "Estudiante de Ingenieria de Sistemas - UNMSM | Lima, Peru")

    pdf.set_text_color(*GRAY)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_xy(12, 38)
    pdf.cell(0, 6, "alvaradocjosorio@gmail.com  |  +51 999 888 777  |  linkedin.com/in/joan-alvarado")

    def section(title, y=None):
        if y:
            pdf.set_y(y)
        pdf.ln(6)
        pdf.set_text_color(*NAVY)
        pdf.set_font("Helvetica", "B", 13)
        pdf.cell(0, 8, title)
        pdf.ln(8)
        pdf.set_draw_color(*INDIGO)
        pdf.line(12, pdf.get_y(), 198, pdf.get_y())
        pdf.ln(3)
        pdf.set_text_color(60, 60, 60)
        pdf.set_font("Helvetica", "", 10)

    pdf.set_left_margin(12)
    pdf.set_right_margin(12)
    pdf.set_y(46)

    section("Perfil Profesional")
    pdf.multi_cell(0, 5.5,
        "Estudiante de octavo ciclo de Ingenieria de Sistemas con experiencia en desarrollo "
        "web frontend con React y TypeScript, y backend con Python. Apasionado por el analisis "
        "de datos con SQL, Excel y Power BI. Busco practicas profesionales para aplicar mis "
        "conocimientos en proyectos reales con metodologias Scrum y Agile.")

    section("Habilidades Tecnicas")
    pdf.multi_cell(0, 5.5,
        "- Frontend: React, TypeScript, JavaScript, HTML, CSS\n"
        "- Backend: Python, Django, Flask, REST API, Node.js\n"
        "- Bases de datos: SQL, PostgreSQL, MySQL, MongoDB\n"
        "- Datos: Excel, Power BI, Machine Learning (basico)\n"
        "- Diseno: Figma, UI/UX\n"
        "- Herramientas: Git, Docker, Linux, Scrum, Agile")

    section("Experiencia")
    pdf.set_font("Helvetica", "B", 10.5)
    pdf.cell(0, 6, "Practicante de Desarrollo Web - StartUp Universitaria (2025)")
    pdf.ln(6)
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 5.5,
        "Desarrolle interfaces con React y TypeScript, consumi REST API con Python/Django "
        "y elabore dashboards en Power BI para el seguimiento de metricas del producto.")
    pdf.ln(2)
    pdf.set_font("Helvetica", "B", 10.5)
    pdf.cell(0, 6, "Proyecto Academico - Sistema de Gestion (2024)")
    pdf.ln(6)
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 5.5,
        "Modele la base de datos en PostgreSQL, escribi consultas SQL complejas y "
        "prototipe la interfaz en Figma aplicando principios de UI/UX.")

    section("Educacion")
    pdf.multi_cell(0, 5.5,
        "Universidad Nacional Mayor de San Marcos (UNMSM)\n"
        "Ingenieria de Sistemas - 8vo ciclo | 2021 - actualidad")

    pdf.output(OUTPUT)
    print(f"CV generado: {OUTPUT}")


if __name__ == "__main__":
    main()
