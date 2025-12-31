"""
Management system for tracking engineers and trainees in Japan.
Hệ thống quản lý để theo dõi kỹ sư và tu nghiệp sinh ở Nhật.
"""

import json
from datetime import datetime
from typing import List, Optional, Dict
from models import Company, Employee, Engineer, Trainee, ManagementType, EmployeeType


class ManagementSystem:
    """Main management system for companies and employees."""
    
    def __init__(self):
        self.companies: Dict[str, Company] = {}
        self.employees: Dict[str, Employee] = {}
    
    def add_company(self, name: str, location: str = "") -> Company:
        """Add a new company to the system."""
        if name in self.companies:
            print(f"Company '{name}' already exists.")
            return self.companies[name]
        
        company = Company(name=name, location=location)
        self.companies[name] = company
        print(f"Added company: {name}")
        return company
    
    def remove_company(self, name: str):
        """Remove a company from the system."""
        if name not in self.companies:
            print(f"Company '{name}' not found.")
            return
        
        # Remove all employees of this company
        company = self.companies[name]
        for employee in company.employees[:]:
            self.remove_employee(employee.employee_id)
        
        del self.companies[name]
        print(f"Removed company: {name}")
    
    def add_engineer(
        self,
        employee_id: str,
        name: str,
        company_name: str,
        start_date: datetime,
        management_type: ManagementType,
        monthly_cost: float,
        end_date: Optional[datetime] = None
    ) -> Engineer:
        """Add an engineer to the system."""
        if employee_id in self.employees:
            print(f"Employee ID '{employee_id}' already exists.")
            return self.employees[employee_id]
        
        if company_name not in self.companies:
            print(f"Company '{company_name}' not found. Adding it first.")
            self.add_company(company_name)
        
        engineer = Engineer(
            employee_id=employee_id,
            name=name,
            company_name=company_name,
            start_date=start_date,
            management_type=management_type,
            monthly_cost=monthly_cost,
            end_date=end_date
        )
        
        self.employees[employee_id] = engineer
        self.companies[company_name].add_employee(engineer)
        print(f"Added engineer: {name} (ID: {employee_id})")
        return engineer
    
    def add_trainee(
        self,
        employee_id: str,
        name: str,
        company_name: str,
        start_date: datetime,
        expected_end_date: datetime,
        management_type: ManagementType,
        monthly_cost: float
    ) -> Trainee:
        """Add a trainee to the system."""
        if employee_id in self.employees:
            print(f"Employee ID '{employee_id}' already exists.")
            return self.employees[employee_id]
        
        if company_name not in self.companies:
            print(f"Company '{company_name}' not found. Adding it first.")
            self.add_company(company_name)
        
        trainee = Trainee(
            employee_id=employee_id,
            name=name,
            company_name=company_name,
            start_date=start_date,
            expected_end_date=expected_end_date,
            management_type=management_type,
            monthly_cost=monthly_cost
        )
        
        self.employees[employee_id] = trainee
        self.companies[company_name].add_employee(trainee)
        print(f"Added trainee: {name} (ID: {employee_id})")
        return trainee
    
    def remove_employee(self, employee_id: str):
        """Remove an employee from the system."""
        if employee_id not in self.employees:
            print(f"Employee ID '{employee_id}' not found.")
            return
        
        employee = self.employees[employee_id]
        company_name = employee.company_name
        
        if company_name in self.companies:
            self.companies[company_name].remove_employee(employee_id)
        
        del self.employees[employee_id]
        print(f"Removed employee: {employee.name} (ID: {employee_id})")
    
    def get_company(self, name: str) -> Optional[Company]:
        """Get a company by name."""
        return self.companies.get(name)
    
    def get_employee(self, employee_id: str) -> Optional[Employee]:
        """Get an employee by ID."""
        return self.employees.get(employee_id)
    
    def get_employees_by_company(self, company_name: str) -> List[Employee]:
        """Get all employees working at a specific company."""
        company = self.get_company(company_name)
        if not company:
            return []
        return company.employees
    
    def list_all_companies(self) -> List[Company]:
        """List all companies in the system."""
        return list(self.companies.values())
    
    def list_all_employees(self) -> List[Employee]:
        """List all employees in the system."""
        return list(self.employees.values())
    
    def generate_company_report(self, company_name: str) -> str:
        """Generate a detailed report for a specific company."""
        company = self.get_company(company_name)
        if not company:
            return f"Company '{company_name}' not found."
        
        report = f"\n{'='*60}\n"
        report += f"COMPANY REPORT: {company.name}\n"
        report += f"{'='*60}\n"
        report += f"Location: {company.location}\n"
        report += f"Total Employees: {len(company.employees)}\n"
        report += f"  - Engineers: {company.get_engineer_count()}\n"
        report += f"  - Trainees: {company.get_trainee_count()}\n"
        report += f"Total Monthly Cost: ¥{company.get_total_monthly_cost():,.0f}\n"
        report += f"\nEmployees:\n"
        report += f"{'-'*60}\n"
        
        for employee in company.employees:
            report += f"\n{employee}\n"
        
        return report
    
    def generate_summary_report(self) -> str:
        """Generate a summary report of all companies and employees."""
        report = f"\n{'='*60}\n"
        report += f"SYSTEM SUMMARY REPORT\n"
        report += f"{'='*60}\n"
        report += f"Total Companies: {len(self.companies)}\n"
        report += f"Total Employees: {len(self.employees)}\n"
        
        total_engineers = sum(1 for e in self.employees.values() if e.employee_type == EmployeeType.ENGINEER)
        total_trainees = sum(1 for e in self.employees.values() if e.employee_type == EmployeeType.TRAINEE)
        total_cost = sum(e.monthly_cost for e in self.employees.values())
        
        report += f"  - Engineers: {total_engineers}\n"
        report += f"  - Trainees: {total_trainees}\n"
        report += f"Total Monthly Revenue: ¥{total_cost:,.0f}\n"
        report += f"\nCompanies:\n"
        report += f"{'-'*60}\n"
        
        for company in sorted(self.companies.values(), key=lambda c: c.name):
            report += f"\n{company}\n"
        
        return report
    
    def save_to_file(self, filename: str = "management_data.json"):
        """Save all data to a JSON file."""
        data = {
            'companies': {name: company.to_dict() for name, company in self.companies.items()},
            'saved_at': datetime.now().isoformat()
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"Data saved to {filename}")
    
    def load_from_file(self, filename: str = "management_data.json"):
        """Load data from a JSON file."""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            self.companies.clear()
            self.employees.clear()
            
            for name, company_data in data.get('companies', {}).items():
                company = Company.from_dict(company_data)
                self.companies[name] = company
                
                for employee in company.employees:
                    self.employees[employee.employee_id] = employee
            
            print(f"Data loaded from {filename}")
            print(f"Loaded {len(self.companies)} companies and {len(self.employees)} employees")
        
        except FileNotFoundError:
            print(f"File {filename} not found. Starting with empty system.")
        except Exception as e:
            print(f"Error loading data: {e}")
