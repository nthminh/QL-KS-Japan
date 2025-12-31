# QL-E-Japan

Ứng dụng quản lý hóa đơn và danh sách kỹ sư, tu nghiệp sinh đang làm việc tại các công ty Nhật Bản. Ứng dụng được xây dựng với React và Firebase, cho phép nhiều người dùng cùng truy cập và cập nhật dữ liệu trên cloud.

## Tính năng

- ✅ Xác thực người dùng với Firebase Authentication
- ✅ Quản lý danh sách kỹ sư và tu nghiệp sinh
- ✅ Tự động tạo tên thư mục Google Drive theo tên và ngày sinh
- ✅ Chuyển đổi ứng viên giữa các công ty
- ✅ Theo dõi lịch sử chuyển công ty (có thể chỉnh sửa)
- ✅ **Quản lý công ty với hỗ trợ tìm kiếm thông tin AI**
- ✅ Quản lý hóa đơn theo công ty
- ✅ Lưu trữ dữ liệu trên Firebase Firestore (real-time cloud database)
- ✅ Hỗ trợ nhiều người dùng cùng lúc
- ✅ Giao diện tiếng Việt thân thiện

## Công nghệ sử dụng

- **Frontend**: React 19
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Hosting**: Firebase Hosting
- **UI**: Custom CSS

## Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/nthminh/QL-KS-Japan.git
cd QL-KS-Japan
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình Firebase

#### a. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc sử dụng project có sẵn
3. Thêm web app vào project

#### b. Bật Authentication

1. Vào Firebase Console > Authentication > Sign-in method
2. Bật "Email/Password" authentication

#### c. Tạo Firestore Database

1. Vào Firebase Console > Firestore Database
2. Tạo database mới (chọn chế độ production)
3. Chọn vị trí server (khuyến nghị: asia-northeast1 cho Nhật Bản)

#### d. Cấu hình Firebase trong ứng dụng

1. Copy file `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```

2. Lấy Firebase config từ Firebase Console:
   - Vào Project Settings > General
   - Scroll xuống "Your apps" > chọn Web app
   - Copy các giá trị config

3. Cập nhật file `.env` với thông tin của bạn:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. Hoặc cập nhật trực tiếp file `src/config/firebase.config.js`

#### e. Deploy Firestore Rules

```bash
firebase login
firebase init firestore  # Chọn existing project của bạn
firebase deploy --only firestore:rules
```

### 4. Chạy ứng dụng

#### Development mode

```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

#### Production build

```bash
npm run build
```

### 5. Deploy lên Firebase Hosting

#### a. Cài đặt Firebase CLI (nếu chưa có)

```bash
npm install -g firebase-tools
```

#### b. Login Firebase

```bash
firebase login
```

#### c. Khởi tạo Firebase Hosting

```bash
firebase init hosting
```

Chọn:
- Use existing project
- Public directory: `build`
- Configure as single-page app: `Yes`
- Set up automatic builds with GitHub: `No` (hoặc Yes nếu muốn)

#### d. Deploy

```bash
npm run build
firebase deploy --only hosting
```

Ứng dụng sẽ được deploy và bạn sẽ nhận được URL public.

## Sử dụng

### Đăng ký/Đăng nhập

1. Mở ứng dụng
2. Tạo tài khoản mới bằng email và mật khẩu (tối thiểu 6 ký tự)
3. Hoặc đăng nhập nếu đã có tài khoản

### Quản lý Kỹ sư & Tu nghiệp sinh

1. Click tab "Kỹ sư & Tu nghiệp sinh"
2. Click "Thêm mới" để thêm người mới
3. Điền thông tin: Họ tên, Ngày sinh, Loại (Kỹ sư/Tu nghiệp sinh), Công ty, Vị trí, Ngày bắt đầu, Email, SĐT
4. Hệ thống sẽ tự động tạo tên thư mục Google Drive dựa trên tên và ngày sinh (định dạng: Tên_YYYYMMDD)
5. Click "Sửa" để cập nhật thông tin
6. Click "Chuyển CT" để chuyển ứng viên sang công ty khác và lưu lịch sử
7. Click "Lịch sử" để xem lịch sử chuyển công ty của ứng viên
8. Click "Xóa" để xóa (có xác nhận)

### Quản lý Công ty (MỚI - Có hỗ trợ AI)

1. Click tab "Công ty"
2. Click "Thêm mới" để thêm công ty mới
3. Điền thông tin: Tên công ty, Mã số thuế, Địa chỉ, Điện thoại, Website, Email, Người liên hệ, Ghi chú
4. **Click vào tên công ty** để xem thông tin chi tiết với hỗ trợ AI:
   - Hệ thống hiển thị thông tin có sẵn trong database
   - Cung cấp link Google Search để tìm thêm thông tin (địa chỉ, số điện thoại, mã số thuế...)
   - Gợi ý cập nhật thông tin mới tìm được vào hệ thống
5. Click "Sửa" để cập nhật thông tin công ty
6. Click "Xóa" để xóa công ty (có xác nhận)

### Quản lý Hóa đơn

1. Click tab "Hóa đơn"
2. Click "Thêm hóa đơn" để tạo hóa đơn mới
3. Điền thông tin: Số hóa đơn, Công ty, Ngày xuất, Ngày đến hạn, Số tiền, Trạng thái
4. Click "Sửa" để cập nhật hóa đơn
5. Click "Xóa" để xóa hóa đơn (có xác nhận)

## Cấu trúc Project

```
QL-KS-Japan/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth.js              # Component đăng nhập/đăng ký
│   │   ├── Auth.css
│   │   ├── EngineerList.js      # Component quản lý kỹ sư
│   │   ├── EngineerList.css
│   │   ├── CompanyList.js       # Component quản lý công ty (MỚI)
│   │   ├── CompanyList.css
│   │   ├── InvoiceList.js       # Component quản lý hóa đơn
│   │   └── InvoiceList.css
│   ├── config/
│   │   └── firebase.config.js   # Cấu hình Firebase
│   ├── services/
│   │   ├── firebase.js          # Khởi tạo Firebase
│   │   ├── authService.js       # Service xác thực
│   │   ├── dataService.js       # Service CRUD dữ liệu (engineers, companies, invoices, transfers)
│   │   ├── driveService.js      # Service Google Drive helper
│   │   └── aiSearchService.js   # Service AI search helper (MỚI)
│   ├── App.js                   # Component chính
│   ├── App.css
│   ├── index.js                 # Entry point
│   └── index.css
├── firebase.json                # Cấu hình Firebase
├── firestore.rules              # Rules bảo mật Firestore
├── firestore.indexes.json       # Indexes Firestore
├── .env.example                 # Template biến môi trường
├── .gitignore
└── package.json
```

## Firestore Collections

### engineers
```javascript
{
  name: string,           // Họ và tên
  dateOfBirth: string,    // Ngày sinh (YYYY-MM-DD)
  type: string,           // 'engineer' hoặc 'intern'
  company: string,        // Tên công ty
  position: string,       // Vị trí công việc
  startDate: string,      // Ngày bắt đầu (YYYY-MM-DD)
  email: string,          // Email (optional)
  phone: string,          // Số điện thoại (optional)
  driveFolderName: string,// Tên thư mục Google Drive (tự động tạo)
  createdAt: timestamp,   // Thời gian tạo
  updatedAt: timestamp    // Thời gian cập nhật
}
```

### transferHistory
```javascript
{
  engineerId: string,     // ID của kỹ sư/tu nghiệp sinh
  engineerName: string,   // Tên kỹ sư/tu nghiệp sinh
  fromCompany: string,    // Công ty cũ
  toCompany: string,      // Công ty mới
  transferDate: string,   // Ngày chuyển (YYYY-MM-DD)
  reason: string,         // Lý do chuyển (optional)
  createdAt: timestamp,   // Thời gian tạo
  updatedAt: timestamp    // Thời gian cập nhật
}
```

### companies (MỚI)
```javascript
{
  name: string,           // Tên công ty (required)
  taxId: string,          // Mã số thuế (optional)
  address: string,        // Địa chỉ (optional)
  phone: string,          // Số điện thoại (optional)
  email: string,          // Email (optional)
  website: string,        // Website (optional)
  contactPerson: string,  // Người liên hệ (optional)
  notes: string,          // Ghi chú (optional)
  createdAt: timestamp,   // Thời gian tạo
  updatedAt: timestamp    // Thời gian cập nhật
}
```

### invoices
```javascript
{
  invoiceNumber: string,  // Số hóa đơn
  company: string,        // Công ty
  issueDate: string,      // Ngày xuất (YYYY-MM-DD)
  dueDate: string,        // Ngày đến hạn (YYYY-MM-DD)
  amount: number,         // Số tiền
  status: string,         // 'pending', 'paid', 'overdue'
  description: string,    // Ghi chú (optional)
  createdAt: timestamp,   // Thời gian tạo
  updatedAt: timestamp    // Thời gian cập nhật
}
```

## Bảo mật

- Firestore rules yêu cầu người dùng phải đăng nhập mới có thể đọc/ghi dữ liệu
- Mỗi user có thể xem và chỉnh sửa tất cả dữ liệu (phù hợp cho team nhỏ)
- Có thể tùy chỉnh rules trong file `firestore.rules` để phân quyền chi tiết hơn

## Troubleshooting

### Lỗi kết nối Firebase
- Kiểm tra file `.env` hoặc `firebase.config.js` có đúng config không
- Đảm bảo đã bật Authentication và Firestore trong Firebase Console

### Lỗi permissions
- Kiểm tra Firestore Rules đã deploy chưa
- Đảm bảo đã đăng nhập trong ứng dụng

### Lỗi build
- Xóa folder `node_modules` và chạy lại `npm install`
- Clear cache: `npm cache clean --force`

## Phát triển thêm

Có thể mở rộng ứng dụng với:
- Export hóa đơn ra PDF
- Thống kê báo cáo
- Tìm kiếm và lọc nâng cao
- Upload hình ảnh/tài liệu
- Thông báo real-time
- Quản lý nhiều công ty
- Phân quyền chi tiết (Admin, User, Viewer)
- Tích hợp API Google Drive để tự động tạo thư mục

## Google Drive Integration

Ứng dụng hiện tại hỗ trợ tạo tên thư mục tự động cho ứng viên dựa trên tên và ngày sinh. Thư mục sẽ được tạo với định dạng: `Tên_YYYYMMDD`

Link Google Drive chung: https://drive.google.com/drive/folders/11XtTyW0H15tleBZTNiDVOVhLJJERxFv6?usp=drive_link

**Lưu ý**: Hiện tại thư mục cần được tạo thủ công trong Google Drive. Tính năng tự động tạo thư mục qua API có thể được phát triển trong tương lai.

## License

ISC

## Liên hệ

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub.
