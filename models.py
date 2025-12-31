"""
Data models for managing engineers and trainees working in Japan.
Mô hình dữ liệu để quản lý kỹ sư và tu nghiệp sinh làm việc ở Nhật.
"""

from datetime import datetime
from typing import Optional, List
from enum import Enum


class ManagementType(Enum):
    """Different management types with different cost structures."""
    TYPE_A = "Type A - Full Management"  # Quản lý toàn diện
    TYPE_B = "Type B - Partial Management"  # Quản lý một phần
    TYPE_C = "Type C - Basic Support"  # Hỗ trợ cơ bản


class EmployeeType(Enum):
    """Types of employees."""
    ENGINEER = "Engineer"  # Kỹ sư
    TRAINEE = "Trainee"  # Tu nghiệp sinh


class Employee:
    """Base class for all employees."""
    
    def __init__(
        self,
        employee_id: str,
        name: str,
        employee_type: EmployeeType,
        company_name: str,
        start_date: datetime,
        management_type: ManagementType,
        monthly_cost: float,
        end_date: Optional[datetime] = None
    ):
        self.employee_id = employee_id
        self.name = name
        self.employee_type = employee_type
        self.company_name = company_name
        self.start_date = start_date
        self.end_date = end_date
        self.management_type = management_type
        self.monthly_cost = monthly_cost
    
    def to_dict(self):
        """Convert employee to dictionary for serialization."""
        return {
            'employee_id': self.employee_id,
            'name': self.name,
            'employee_type': self.employee_type.value,
            'company_name': self.company_name,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'management_type': self.management_type.value,
            'monthly_cost': self.monthly_cost
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create employee from dictionary."""
        employee_type = EmployeeType(data['employee_type'])
        
        # Create appropriate subclass based on employee type
        if employee_type == EmployeeType.ENGINEER:
            return Engineer(
                employee_id=data['employee_id'],
                name=data['name'],
                company_name=data['company_name'],
                start_date=datetime.fromisoformat(data['start_date']),
                end_date=datetime.fromisoformat(data['end_date']) if data['end_date'] else None,
                management_type=ManagementType(data['management_type']),
                monthly_cost=data['monthly_cost']
            )
        elif employee_type == EmployeeType.TRAINEE:
            return Trainee(
                employee_id=data['employee_id'],
                name=data['name'],
                company_name=data['company_name'],
                start_date=datetime.fromisoformat(data['start_date']),
                expected_end_date=datetime.fromisoformat(data['end_date']),
                management_type=ManagementType(data['management_type']),
                monthly_cost=data['monthly_cost']
            )
        else:
            # Fallback to base Employee class for unknown types
            return cls(
                employee_id=data['employee_id'],
                name=data['name'],
                employee_type=employee_type,
                company_name=data['company_name'],
                start_date=datetime.fromisoformat(data['start_date']),
                end_date=datetime.fromisoformat(data['end_date']) if data['end_date'] else None,
                management_type=ManagementType(data['management_type']),
                monthly_cost=data['monthly_cost']
            )
    
    def __str__(self):
        end_str = f" - End: {self.end_date.strftime('%Y-%m-%d')}" if self.end_date else " - Ongoing"
        return (f"{self.employee_type.value}: {self.name} (ID: {self.employee_id}) "
                f"at {self.company_name}\n"
                f"  Start: {self.start_date.strftime('%Y-%m-%d')}{end_str}\n"
                f"  Management: {self.management_type.value}\n"
                f"  Monthly Cost: ¥{self.monthly_cost:,.0f}")


class Engineer(Employee):
    """Engineer working in Japan (Kỹ sư)."""
    
    def __init__(
        self,
        employee_id: str,
        name: str,
        company_name: str,
        start_date: datetime,
        management_type: ManagementType,
        monthly_cost: float,
        end_date: Optional[datetime] = None
    ):
        super().__init__(
            employee_id=employee_id,
            name=name,
            employee_type=EmployeeType.ENGINEER,
            company_name=company_name,
            start_date=start_date,
            end_date=end_date,
            management_type=management_type,
            monthly_cost=monthly_cost
        )


class Trainee(Employee):
    """Trainee working in Japan (Tu nghiệp sinh) - limited work period."""
    
    def __init__(
        self,
        employee_id: str,
        name: str,
        company_name: str,
        start_date: datetime,
        expected_end_date: datetime,
        management_type: ManagementType,
        monthly_cost: float
    ):
        # Trainees must have an end date as they work for limited periods
        super().__init__(
            employee_id=employee_id,
            name=name,
            employee_type=EmployeeType.TRAINEE,
            company_name=company_name,
            start_date=start_date,
            end_date=expected_end_date,
            management_type=management_type,
            monthly_cost=monthly_cost
        )


class Company:
    """Represents a company in Japan."""
    
    def __init__(self, name: str, location: str = ""):
        self.name = name
        self.location = location
        self.employees: List[Employee] = []
    
    def add_employee(self, employee: Employee):
        """Add an employee to the company."""
        self.employees.append(employee)
    
    def remove_employee(self, employee_id: str):
        """Remove an employee from the company."""
        self.employees = [e for e in self.employees if e.employee_id != employee_id]
    
    def get_engineer_count(self) -> int:
        """Get number of engineers at this company."""
        return sum(1 for e in self.employees if e.employee_type == EmployeeType.ENGINEER)
    
    def get_trainee_count(self) -> int:
        """Get number of trainees at this company."""
        return sum(1 for e in self.employees if e.employee_type == EmployeeType.TRAINEE)
    
    def get_total_monthly_cost(self) -> float:
        """Calculate total monthly cost for all employees at this company."""
        return sum(e.monthly_cost for e in self.employees)
    
    def to_dict(self):
        """Convert company to dictionary for serialization."""
        return {
            'name': self.name,
            'location': self.location,
            'employees': [e.to_dict() for e in self.employees]
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create company from dictionary."""
        company = cls(name=data['name'], location=data.get('location', ''))
        for emp_data in data.get('employees', []):
            employee = Employee.from_dict(emp_data)
            company.add_employee(employee)
        return company
    
    def __str__(self):
        return (f"Company: {self.name} ({self.location})\n"
                f"  Engineers: {self.get_engineer_count()}\n"
                f"  Trainees: {self.get_trainee_count()}\n"
                f"  Total Monthly Cost: ¥{self.get_total_monthly_cost():,.0f}")
