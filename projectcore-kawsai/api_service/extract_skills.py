from fastapi import APIRouter, UploadFile, File
import PyPDF2
import io
import re

router = APIRouter()

PREDEFINED_SKILLS = [
    "sql", "python", "java", "c++", "c#", "javascript", "typescript", "react",
    "angular", "vue", "node.js", "django", "flask", "spring boot", "aws",
    "azure", "gcp", "docker", "kubernetes", "git", "linux", "machine learning",
    "data science", "excel", "power bi", "tableau", "figma", "ui/ux", "scrum",
    "agile", "html", "css", "mongodb", "postgresql", "mysql", "redis", "ruby",
    "php", "swift", "kotlin", "flutter", "react native", "graphql", "rest api"
]

@router.post("")
async def extract_skills(file: UploadFile = File(...)):
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "
                
        text_lower = text.lower()
        extracted = []
        
        for skill in PREDEFINED_SKILLS:
            # Match word boundaries to avoid partial matches
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                # Capitalize nicely for the frontend
                extracted.append(skill.title() if len(skill) > 3 else skill.upper())
                
        # Fix specific casings
        case_fixes = {
            "Sql": "SQL", "Aws": "AWS", "Gcp": "GCP", "Ui/Ux": "UI/UX", "Php": "PHP", 
            "Css": "CSS", "Html": "HTML", "C++": "C++", "C#": "C#", "Api": "API", 
            "Rest Api": "REST API", "Mysql": "MySQL", "Postgresql": "PostgreSQL",
            "Mongodb": "MongoDB"
        }
        extracted = [case_fixes.get(s, s) for s in extracted]

        return {"skills": extracted}
    except Exception as e:
        return {"skills": [], "error": str(e)}
