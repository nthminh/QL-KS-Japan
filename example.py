"""
Example usage of the Japan Engineer and Trainee Management System.
Ví dụ sử dụng hệ thống quản lý kỹ sư và tu nghiệp sinh ở Nhật.
"""

from datetime import datetime, timedelta
from management_system import ManagementSystem
from models import ManagementType


def main():
    """Demonstrate the management system functionality."""
    
    print("=" * 60)
    print("JAPAN ENGINEER & TRAINEE MANAGEMENT SYSTEM")
    print("HỆ THỐNG QUẢN LÝ KỸ SƯ VÀ TU NGHIỆP SINH Ở NHẬT")
    print("=" * 60)
    
    # Create management system
    system = ManagementSystem()
    
    # Add companies
    print("\n1. Adding companies (Thêm công ty)...")
    system.add_company("Toyota Motor Corporation", "Tokyo")
    system.add_company("Sony Corporation", "Tokyo")
    system.add_company("Panasonic Corporation", "Osaka")
    
    # Add engineers
    print("\n2. Adding engineers (Thêm kỹ sư)...")
    system.add_engineer(
        employee_id="ENG001",
        name="Nguyen Van A",
        company_name="Toyota Motor Corporation",
        start_date=datetime(2023, 1, 15),
        management_type=ManagementType.TYPE_A,
        monthly_cost=300000
    )
    
    system.add_engineer(
        employee_id="ENG002",
        name="Tran Thi B",
        company_name="Sony Corporation",
        start_date=datetime(2023, 3, 1),
        management_type=ManagementType.TYPE_B,
        monthly_cost=250000
    )
    
    system.add_engineer(
        employee_id="ENG003",
        name="Le Van C",
        company_name="Toyota Motor Corporation",
        start_date=datetime(2023, 6, 1),
        management_type=ManagementType.TYPE_A,
        monthly_cost=300000
    )
    
    # Add trainees (Tu nghiệp sinh)
    print("\n3. Adding trainees (Thêm tu nghiệp sinh)...")
    system.add_trainee(
        employee_id="TRA001",
        name="Pham Van D",
        company_name="Sony Corporation",
        start_date=datetime(2024, 1, 1),
        expected_end_date=datetime(2026, 12, 31),  # 3-year program
        management_type=ManagementType.TYPE_C,
        monthly_cost=150000
    )
    
    system.add_trainee(
        employee_id="TRA002",
        name="Hoang Thi E",
        company_name="Panasonic Corporation",
        start_date=datetime(2024, 4, 1),
        expected_end_date=datetime(2027, 3, 31),  # 3-year program
        management_type=ManagementType.TYPE_C,
        monthly_cost=150000
    )
    
    system.add_trainee(
        employee_id="TRA003",
        name="Vu Van F",
        company_name="Toyota Motor Corporation",
        start_date=datetime(2024, 6, 1),
        expected_end_date=datetime(2025, 5, 31),  # 1-year program
        management_type=ManagementType.TYPE_B,
        monthly_cost=180000
    )
    
    # Generate summary report
    print("\n4. System Summary (Tổng quan hệ thống)...")
    print(system.generate_summary_report())
    
    # Generate company-specific reports
    print("\n5. Company Reports (Báo cáo theo công ty)...")
    
    for company_name in ["Toyota Motor Corporation", "Sony Corporation", "Panasonic Corporation"]:
        print(system.generate_company_report(company_name))
    
    # Query specific information
    print("\n6. Querying Information (Truy vấn thông tin)...")
    print("\nEmployees at Toyota Motor Corporation:")
    toyota_employees = system.get_employees_by_company("Toyota Motor Corporation")
    print(f"Total: {len(toyota_employees)} employees")
    for emp in toyota_employees:
        print(f"  - {emp.name} ({emp.employee_type.value})")
    
    print("\nEmployee Details (Chi tiết nhân viên):")
    employee = system.get_employee("ENG001")
    if employee:
        print(employee)
    
    # Save data
    print("\n7. Saving data (Lưu dữ liệu)...")
    system.save_to_file("management_data.json")
    
    # Demonstrate loading data
    print("\n8. Demonstrating data loading (Thử nghiệm tải dữ liệu)...")
    new_system = ManagementSystem()
    new_system.load_from_file("management_data.json")
    
    print("\nVerification - System summary after loading:")
    print(new_system.generate_summary_report())
    
    print("\n" + "=" * 60)
    print("DEMO COMPLETED SUCCESSFULLY!")
    print("DEMO HOÀN THÀNH THÀNH CÔNG!")
    print("=" * 60)


if __name__ == "__main__":
    main()
