#!/usr/bin/env python3
"""
Interactive CLI for the Japan Engineer and Trainee Management System.
Giao diện dòng lệnh tương tác cho hệ thống quản lý.
"""

from datetime import datetime
from management_system import ManagementSystem
from models import ManagementType, EmployeeType
import sys


class CLI:
    """Interactive command-line interface."""
    
    def __init__(self):
        self.system = ManagementSystem()
        self.running = True
        
        # Try to load existing data
        try:
            self.system.load_from_file()
        except FileNotFoundError:
            print("No existing data file found. Starting with empty system.")
        except Exception as e:
            print(f"Error loading data: {e}. Starting with empty system.")
    
    def display_menu(self):
        """Display the main menu."""
        print("\n" + "=" * 60)
        print("JAPAN ENGINEER & TRAINEE MANAGEMENT SYSTEM")
        print("HỆ THỐNG QUẢN LÝ KỸ SƯ VÀ TU NGHIỆP SINH Ở NHẬT")
        print("=" * 60)
        print("1. Add Company (Thêm công ty)")
        print("2. Add Engineer (Thêm kỹ sư)")
        print("3. Add Trainee (Thêm tu nghiệp sinh)")
        print("4. View All Companies (Xem tất cả công ty)")
        print("5. View Company Details (Xem chi tiết công ty)")
        print("6. View Employee Details (Xem chi tiết nhân viên)")
        print("7. System Summary Report (Báo cáo tổng quan)")
        print("8. Remove Employee (Xóa nhân viên)")
        print("9. Save Data (Lưu dữ liệu)")
        print("0. Exit (Thoát)")
        print("=" * 60)
    
    def get_input(self, prompt, input_type=str):
        """Get user input with type conversion."""
        while True:
            try:
                value = input(prompt)
                if input_type == str:
                    return value
                elif input_type == int:
                    return int(value)
                elif input_type == float:
                    return float(value)
                elif input_type == datetime:
                    return datetime.strptime(value, "%Y-%m-%d")
            except ValueError:
                print(f"Invalid input. Please try again.")
            except (EOFError, KeyboardInterrupt):
                # Allow user to exit gracefully with Ctrl+C or Ctrl+D
                raise
    
    def add_company(self):
        """Add a new company."""
        print("\n--- Add Company ---")
        name = self.get_input("Company name (Tên công ty): ")
        location = self.get_input("Location (Địa điểm): ")
        self.system.add_company(name, location)
    
    def add_engineer(self):
        """Add a new engineer."""
        print("\n--- Add Engineer ---")
        employee_id = self.get_input("Employee ID (Mã nhân viên): ")
        name = self.get_input("Name (Tên): ")
        company_name = self.get_input("Company name (Tên công ty): ")
        
        print("Start date (Ngày bắt đầu) [YYYY-MM-DD]: ")
        start_date = self.get_input("  ", datetime)
        
        print("\nManagement Type (Loại hình quản lý):")
        print("1. Type A - Full Management")
        print("2. Type B - Partial Management")
        print("3. Type C - Basic Support")
        mgmt_choice = self.get_input("Select (1-3): ", int)
        
        management_types = [ManagementType.TYPE_A, ManagementType.TYPE_B, ManagementType.TYPE_C]
        management_type = management_types[mgmt_choice - 1] if 1 <= mgmt_choice <= 3 else ManagementType.TYPE_B
        
        monthly_cost = self.get_input("Monthly cost in Yen (Chi phí hàng tháng): ", float)
        
        self.system.add_engineer(
            employee_id=employee_id,
            name=name,
            company_name=company_name,
            start_date=start_date,
            management_type=management_type,
            monthly_cost=monthly_cost
        )
    
    def add_trainee(self):
        """Add a new trainee."""
        print("\n--- Add Trainee ---")
        employee_id = self.get_input("Employee ID (Mã nhân viên): ")
        name = self.get_input("Name (Tên): ")
        company_name = self.get_input("Company name (Tên công ty): ")
        
        print("Start date (Ngày bắt đầu) [YYYY-MM-DD]: ")
        start_date = self.get_input("  ", datetime)
        
        print("Expected end date (Ngày dự kiến kết thúc) [YYYY-MM-DD]: ")
        end_date = self.get_input("  ", datetime)
        
        print("\nManagement Type (Loại hình quản lý):")
        print("1. Type A - Full Management")
        print("2. Type B - Partial Management")
        print("3. Type C - Basic Support")
        mgmt_choice = self.get_input("Select (1-3): ", int)
        
        management_types = [ManagementType.TYPE_A, ManagementType.TYPE_B, ManagementType.TYPE_C]
        management_type = management_types[mgmt_choice - 1] if 1 <= mgmt_choice <= 3 else ManagementType.TYPE_C
        
        monthly_cost = self.get_input("Monthly cost in Yen (Chi phí hàng tháng): ", float)
        
        self.system.add_trainee(
            employee_id=employee_id,
            name=name,
            company_name=company_name,
            start_date=start_date,
            expected_end_date=end_date,
            management_type=management_type,
            monthly_cost=monthly_cost
        )
    
    def view_all_companies(self):
        """View all companies."""
        print("\n--- All Companies ---")
        companies = self.system.list_all_companies()
        if not companies:
            print("No companies found.")
            return
        
        for company in companies:
            print(f"\n{company}")
    
    def view_company_details(self):
        """View details of a specific company."""
        company_name = self.get_input("\nCompany name (Tên công ty): ")
        print(self.system.generate_company_report(company_name))
    
    def view_employee_details(self):
        """View details of a specific employee."""
        employee_id = self.get_input("\nEmployee ID (Mã nhân viên): ")
        employee = self.system.get_employee(employee_id)
        if employee:
            print(f"\n{employee}")
        else:
            print(f"Employee with ID '{employee_id}' not found.")
    
    def view_summary(self):
        """View system summary."""
        print(self.system.generate_summary_report())
    
    def remove_employee(self):
        """Remove an employee."""
        employee_id = self.get_input("\nEmployee ID to remove (Mã nhân viên cần xóa): ")
        self.system.remove_employee(employee_id)
    
    def save_data(self):
        """Save data to file."""
        self.system.save_to_file()
    
    def run(self):
        """Run the CLI."""
        print("\nWelcome to Japan Management System!")
        print("Chào mừng đến với Hệ thống Quản lý Nhật Bản!")
        
        while self.running:
            try:
                self.display_menu()
                choice = self.get_input("\nSelect an option (Chọn): ")
                
                if choice == "1":
                    self.add_company()
                elif choice == "2":
                    self.add_engineer()
                elif choice == "3":
                    self.add_trainee()
                elif choice == "4":
                    self.view_all_companies()
                elif choice == "5":
                    self.view_company_details()
                elif choice == "6":
                    self.view_employee_details()
                elif choice == "7":
                    self.view_summary()
                elif choice == "8":
                    self.remove_employee()
                elif choice == "9":
                    self.save_data()
                elif choice == "0":
                    print("\nSaving data before exit...")
                    self.save_data()
                    print("Goodbye! (Tạm biệt!)")
                    self.running = False
                else:
                    print("Invalid option. Please try again.")
                
            except KeyboardInterrupt:
                print("\n\nSaving data before exit...")
                self.save_data()
                print("Goodbye! (Tạm biệt!)")
                break
            except Exception as e:
                print(f"Error: {e}")


if __name__ == "__main__":
    cli = CLI()
    cli.run()
