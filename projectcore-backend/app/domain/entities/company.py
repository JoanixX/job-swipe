from datetime import datetime

class Company:
    def __init__(self, id: int, name: str, industry: str, company_culture: str,
                 created_at: datetime, updated_at: datetime, deleted_at: datetime = None,
                 contact_email: str = None, phone: str = None, website: str = None, location: str = None):
        self.id = id
        self.name = name
        self.industry = industry
        self.company_culture = company_culture
        self.contact_email = contact_email
        self.phone = phone
        self.website = website
        self.location = location
        self.created_at = created_at
        self.updated_at = updated_at
        self.deleted_at = deleted_at