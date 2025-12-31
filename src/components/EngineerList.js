import React, { useState, useEffect } from 'react';
import { engineerService, transferHistoryService } from '../services/dataService';
import { driveService } from '../services/driveService';
import './EngineerList.css';

function EngineerList() {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showTransferHistory, setShowTransferHistory] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [historyEngineer, setHistoryEngineer] = useState(null);
  const [transferHistory, setTransferHistory] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'engineer',
    dateOfBirth: '',
    company: '',
    position: '',
    startDate: '',
    email: '',
    phone: '',
    driveFolderName: ''
  });
  const [transferData, setTransferData] = useState({
    fromCompany: '',
    toCompany: '',
    transferDate: '',
    reason: ''
  });

  useEffect(() => {
    loadEngineers();
  }, []);

  const loadEngineers = async () => {
    setLoading(true);
    try {
      const data = await engineerService.getAllEngineers();
      setEngineers(data);
    } catch (error) {
      alert('Lỗi khi tải danh sách: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Generate Google Drive folder name if date of birth is provided
      const driveFolderName = formData.dateOfBirth 
        ? driveService.generateFolderName(formData.name, formData.dateOfBirth)
        : '';
      
      const dataToSave = {
        ...formData,
        driveFolderName
      };

      if (editingId) {
        await engineerService.updateEngineer(editingId, dataToSave);
        alert('Cập nhật thành công!');
      } else {
        await engineerService.addEngineer(dataToSave);
        alert('Thêm mới thành công!');
      }
      resetForm();
      loadEngineers();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (engineer) => {
    setFormData({
      name: engineer.name,
      type: engineer.type,
      dateOfBirth: engineer.dateOfBirth || '',
      company: engineer.company,
      position: engineer.position,
      startDate: engineer.startDate,
      email: engineer.email || '',
      phone: engineer.phone || '',
      driveFolderName: engineer.driveFolderName || ''
    });
    setEditingId(engineer.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      setLoading(true);
      try {
        await engineerService.deleteEngineer(id);
        alert('Xóa thành công!');
        loadEngineers();
      } catch (error) {
        alert('Lỗi khi xóa: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'engineer',
      dateOfBirth: '',
      company: '',
      position: '',
      startDate: '',
      email: '',
      phone: '',
      driveFolderName: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleTransferCompany = (engineer) => {
    setSelectedEngineer(engineer);
    setTransferData({
      fromCompany: engineer.company,
      toCompany: '',
      transferDate: new Date().toISOString().split('T')[0],
      reason: ''
    });
    setShowTransferForm(true);
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create transfer history record
      await transferHistoryService.addTransfer({
        engineerId: selectedEngineer.id,
        engineerName: selectedEngineer.name,
        fromCompany: transferData.fromCompany,
        toCompany: transferData.toCompany,
        transferDate: transferData.transferDate,
        reason: transferData.reason
      });

      // Update engineer's current company
      await engineerService.updateEngineer(selectedEngineer.id, {
        company: transferData.toCompany
      });

      alert('Chuyển công ty thành công!');
      setShowTransferForm(false);
      setSelectedEngineer(null);
      loadEngineers();
    } catch (error) {
      alert('Lỗi khi chuyển công ty: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTransferHistory = async (engineerId) => {
    setLoading(true);
    try {
      const history = await transferHistoryService.getTransfersByEngineerId(engineerId);
      setTransferHistory(history);
      setShowTransferHistory(true);
    } catch (error) {
      alert('Lỗi khi tải lịch sử chuyển công ty: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransfer = async (transferId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch sử này?')) {
      setLoading(true);
      try {
        await transferHistoryService.deleteTransfer(transferId);
        alert('Xóa lịch sử thành công!');
        if (historyEngineer) {
          loadTransferHistory(historyEngineer.id);
        }
      } catch (error) {
        alert('Lỗi khi xóa: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="engineer-list-container">
      <div className="header">
        <h2>Danh sách Kỹ sư & Tu nghiệp sinh</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Đóng' : 'Thêm mới'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Cập nhật' : 'Thêm mới'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ngày sinh</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Loại *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="engineer">Kỹ sư</option>
                  <option value="intern">Tu nghiệp sinh</option>
                </select>
              </div>
              <div className="form-group">
                <label>Công ty *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Vị trí *</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ngày bắt đầu *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            {formData.dateOfBirth && formData.name && (
              <div className="form-group">
                <label>Thư mục Google Drive</label>
                <div className="drive-info">
                  <p><strong>Tên thư mục:</strong> {driveService.generateFolderName(formData.name, formData.dateOfBirth)}</p>
                  <a 
                    href={driveService.getSharedDriveLink()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-link"
                  >
                    Mở Google Drive chung
                  </a>
                </div>
              </div>
            )}
            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Đang xử lý...' : (editingId ? 'Cập nhật' : 'Thêm mới')}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {showTransferForm && selectedEngineer && (
        <div className="form-container">
          <h3>Chuyển công ty - {selectedEngineer.name}</h3>
          <form onSubmit={handleTransferSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Từ công ty</label>
                <input
                  type="text"
                  value={transferData.fromCompany}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Đến công ty *</label>
                <input
                  type="text"
                  value={transferData.toCompany}
                  onChange={(e) => setTransferData({ ...transferData, toCompany: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ngày chuyển *</label>
                <input
                  type="date"
                  value={transferData.transferDate}
                  onChange={(e) => setTransferData({ ...transferData, transferDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Lý do</label>
                <input
                  type="text"
                  value={transferData.reason}
                  onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Đang xử lý...' : 'Chuyển công ty'}
              </button>
              <button type="button" onClick={() => setShowTransferForm(false)} className="btn-secondary">
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {showTransferHistory && historyEngineer && (
        <div className="form-container">
          <h3>Lịch sử chuyển công ty - {historyEngineer.name}</h3>
          {transferHistory.length === 0 ? (
            <p>Chưa có lịch sử chuyển công ty</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Từ công ty</th>
                  <th>Đến công ty</th>
                  <th>Ngày chuyển</th>
                  <th>Lý do</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {transferHistory.map((transfer) => (
                  <tr key={transfer.id}>
                    <td>{transfer.fromCompany}</td>
                    <td>{transfer.toCompany}</td>
                    <td>{transfer.transferDate}</td>
                    <td>{transfer.reason || '-'}</td>
                    <td>
                      <button onClick={() => handleDeleteTransfer(transfer.id)} className="btn-delete">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="form-actions">
            <button type="button" onClick={() => setShowTransferHistory(false)} className="btn-secondary">
              Đóng
            </button>
          </div>
        </div>
      )}

      {loading && <div className="loading">Đang tải...</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Ngày sinh</th>
              <th>Loại</th>
              <th>Công ty</th>
              <th>Vị trí</th>
              <th>Ngày bắt đầu</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Google Drive</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {engineers.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center' }}>
                  Chưa có dữ liệu
                </td>
              </tr>
            ) : (
              engineers.map((engineer) => (
                <tr key={engineer.id}>
                  <td>{engineer.name}</td>
                  <td>{engineer.dateOfBirth || '-'}</td>
                  <td>
                    <span className={`badge ${engineer.type}`}>
                      {engineer.type === 'engineer' ? 'Kỹ sư' : 'Tu nghiệp sinh'}
                    </span>
                  </td>
                  <td>{engineer.company}</td>
                  <td>{engineer.position}</td>
                  <td>{engineer.startDate}</td>
                  <td>{engineer.email || '-'}</td>
                  <td>{engineer.phone || '-'}</td>
                  <td>
                    {engineer.driveFolderName ? (
                      <a 
                        href={driveService.getFolderSearchLink(engineer.driveFolderName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-link-small"
                        title={engineer.driveFolderName}
                      >
                        Xem
                      </a>
                    ) : '-'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(engineer)} className="btn-edit">
                        Sửa
                      </button>
                      <button onClick={() => handleTransferCompany(engineer)} className="btn-transfer">
                        Chuyển CT
                      </button>
                      <button 
                        onClick={() => {
                          setHistoryEngineer(engineer);
                          loadTransferHistory(engineer.id);
                        }} 
                        className="btn-history"
                      >
                        Lịch sử
                      </button>
                      <button onClick={() => handleDelete(engineer.id)} className="btn-delete">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EngineerList;
