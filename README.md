# Quản Lý Hóa Đơn Japan (Japan Invoice Management)

Hệ thống quản lý kỹ sư và tu nghiệp sinh đang làm việc ở Nhật Bản.  
System for managing engineers and trainees working in Japan.

## Tính Năng (Features)

### Tiếng Việt
- **Quản lý công ty**: Thêm, xóa và theo dõi các công ty Nhật Bản
- **Quản lý nhân viên**: 
  - Kỹ sư (Engineers): Nhân viên làm việc dài hạn
  - Tu nghiệp sinh (Trainees): Nhân viên có thời gian làm việc có hạn
- **Theo dõi thời gian**: Ngày bắt đầu và ngày dự định kết thúc cho mỗi nhân viên
- **Phân loại quản lý**: 3 loại hình quản lý với chi phí khác nhau
  - Type A: Quản lý toàn diện (Full Management)
  - Type B: Quản lý một phần (Partial Management)  
  - Type C: Hỗ trợ cơ bản (Basic Support)
- **Báo cáo**: Tạo báo cáo chi tiết theo công ty và tổng quan hệ thống
- **Lưu trữ dữ liệu**: Lưu và tải dữ liệu từ file JSON

### English
- **Company Management**: Add, remove, and track Japanese companies
- **Employee Management**:
  - Engineers: Long-term employees
  - Trainees: Employees with limited work periods
- **Time Tracking**: Start date and expected end date for each employee
- **Management Classification**: 3 management types with different costs
  - Type A: Full Management
  - Type B: Partial Management
  - Type C: Basic Support
- **Reports**: Generate detailed reports by company and system overview
- **Data Persistence**: Save and load data from JSON files

## Cài Đặt (Installation)

### Yêu cầu (Requirements)
- Python 3.7 hoặc cao hơn (Python 3.7 or higher)

### Cài đặt (Setup)
```bash
# Clone repository
git clone https://github.com/nthminh/Qu-n-l-h-a-n-Japan.git
cd Qu-n-l-h-a-n-Japan

# Không cần cài đặt thêm thư viện (No additional libraries needed)
```

## Sử Dụng (Usage)

### Chạy giao diện dòng lệnh (Run CLI)
```bash
python cli.py
```

Giao diện tương tác cho phép bạn:
- Thêm công ty và nhân viên
- Xem báo cáo
- Quản lý dữ liệu

Interactive interface allows you to:
- Add companies and employees
- View reports
- Manage data

### Chạy ví dụ (Run Example)
```bash
python example.py
```

### Sử dụng trong code (Use in Code)

```python
from datetime import datetime
from management_system import ManagementSystem
from models import ManagementType

# Tạo hệ thống quản lý (Create management system)
system = ManagementSystem()

# Thêm công ty (Add company)
system.add_company("Toyota Motor Corporation", "Tokyo")

# Thêm kỹ sư (Add engineer)
system.add_engineer(
    employee_id="ENG001",
    name="Nguyen Van A",
    company_name="Toyota Motor Corporation",
    start_date=datetime(2023, 1, 15),
    management_type=ManagementType.TYPE_A,
    monthly_cost=300000  # ¥300,000/month
)

# Thêm tu nghiệp sinh (Add trainee)
system.add_trainee(
    employee_id="TRA001",
    name="Pham Van B",
    company_name="Toyota Motor Corporation",
    start_date=datetime(2024, 1, 1),
    expected_end_date=datetime(2026, 12, 31),  # 3-year program
    management_type=ManagementType.TYPE_C,
    monthly_cost=150000  # ¥150,000/month
)

# Tạo báo cáo (Generate report)
print(system.generate_company_report("Toyota Motor Corporation"))

# Lưu dữ liệu (Save data)
system.save_to_file("management_data.json")

# Tải dữ liệu (Load data)
system.load_from_file("management_data.json")
```

## Cấu Trúc Dữ Liệu (Data Structure)

### Công Ty (Company)
- `name`: Tên công ty (Company name)
- `location`: Địa điểm (Location)
- `employees`: Danh sách nhân viên (List of employees)

### Nhân Viên (Employee)
- `employee_id`: Mã nhân viên (Employee ID)
- `name`: Tên nhân viên (Employee name)
- `employee_type`: Loại nhân viên - Engineer/Trainee (Employee type)
- `company_name`: Tên công ty (Company name)
- `start_date`: Ngày bắt đầu (Start date)
- `end_date`: Ngày kết thúc (End date - required for trainees)
- `management_type`: Loại hình quản lý (Management type)
- `monthly_cost`: Chi phí hàng tháng tính bằng Yen (Monthly cost in Yen)

## Các File (Files)

- `models.py`: Định nghĩa các lớp dữ liệu (Data model classes)
- `management_system.py`: Logic hệ thống quản lý (Management system logic)
- `example.py`: Ví dụ sử dụng (Usage examples)
- `cli.py`: Giao diện dòng lệnh tương tác (Interactive CLI)
- `management_data.json`: File lưu trữ dữ liệu (Data storage file - auto-generated)
- `.gitignore`: Các file bị bỏ qua bởi Git (Files ignored by Git)

## Tác Giả (Author)

Phát triển bởi nthminh (Developed by nthminh)

## Giấy Phép (License)

MIT License
