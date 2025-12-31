import React, { useState, useEffect } from 'react';
import { companyService } from '../services/dataService';
import './CompanyList.css';

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [aiInfo, setAiInfo] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    taxId: '',
    website: '',
    email: '',
    contactPerson: '',
    notes: ''
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await companyService.getAllCompanies();
      setCompanies(data);
    } catch (error) {
      alert('Lỗi khi tải danh sách công ty: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await companyService.updateCompany(editingId, formData);
        alert('Cập nhật công ty thành công!');
      } else {
        await companyService.addCompany(formData);
        alert('Thêm công ty mới thành công!');
      }
      resetForm();
      loadCompanies();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company) => {
    setFormData({
      name: company.name,
      address: company.address || '',
      phone: company.phone || '',
      taxId: company.taxId || '',
      website: company.website || '',
      email: company.email || '',
      contactPerson: company.contactPerson || '',
      notes: company.notes || ''
    });
    setEditingId(company.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công ty này?')) {
      setLoading(true);
      try {
        await companyService.deleteCompany(id);
        alert('Xóa công ty thành công!');
        loadCompanies();
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
      address: '',
      phone: '',
      taxId: '',
      website: '',
      email: '',
      contactPerson: '',
      notes: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleCompanyClick = async (company) => {
    setSelectedCompany(company);
    setLoadingAI(true);
    setAiInfo(null);

    try {
      // Build a comprehensive search query for the company
      const searchQuery = `${company.name} ${company.taxId ? 'tax ID ' + company.taxId : ''} Japan company information address phone contact`;
      
      // Since web_search tool is available on backend, we show what we have
      // and suggest manual web search
      const databaseInfo = `**Thông tin trong hệ thống:**

📋 Tên công ty: ${company.name}
${company.taxId ? `🏢 Mã số thuế: ${company.taxId}` : ''}
${company.address ? `📍 Địa chỉ: ${company.address}` : ''}
${company.phone ? `📞 Điện thoại: ${company.phone}` : ''}
${company.email ? `📧 Email: ${company.email}` : ''}
${company.website ? `🌐 Website: ${company.website}` : ''}
${company.contactPerson ? `👤 Người liên hệ: ${company.contactPerson}` : ''}
${company.notes ? `📝 Ghi chú: ${company.notes}` : ''}

**Tìm kiếm thêm thông tin:**
Để tìm thêm thông tin chi tiết về công ty này (địa chỉ chính xác, số điện thoại, mã số thuế, thông tin liên hệ...), bạn có thể:
1. Truy cập Google: https://www.google.com/search?q=${encodeURIComponent(searchQuery)}
2. Tìm kiếm trên các website công ty Nhật Bản
3. Sử dụng dịch vụ tra cứu doanh nghiệp Nhật Bản

💡 Gợi ý: Cập nhật thông tin tìm được vào hệ thống bằng nút "Sửa" để lưu lại cho lần sau.`;

      setAiInfo({
        answer: databaseInfo,
        sources: [
          {
            title: 'Google Search - ' + company.name,
            url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
          }
        ]
      });
    } catch (error) {
      console.error('Error preparing company info:', error);
      setAiInfo({
        sources: [],
        answer: `Lỗi khi chuẩn bị thông tin: ${error.message}`
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const closeAIModal = () => {
    setSelectedCompany(null);
    setAiInfo(null);
  };

  return (
    <div className="company-list-container">
      <div className="header">
        <h2>Danh sách Công ty</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Đóng' : 'Thêm mới'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Cập nhật công ty' : 'Thêm công ty mới'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Tên công ty *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mã số thuế</label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Người liên hệ</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Ghi chú</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
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

      {loading && <div className="loading">Đang tải...</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tên công ty</th>
              <th>Mã số thuế</th>
              <th>Địa chỉ</th>
              <th>Điện thoại</th>
              <th>Email</th>
              <th>Website</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  Chưa có dữ liệu
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company.id}>
                  <td>
                    <button 
                      onClick={() => handleCompanyClick(company)} 
                      className="btn-company-name"
                      title="Click để xem thông tin chi tiết với AI"
                    >
                      {company.name}
                    </button>
                  </td>
                  <td>{company.taxId || '-'}</td>
                  <td>{company.address || '-'}</td>
                  <td>{company.phone || '-'}</td>
                  <td>{company.email || '-'}</td>
                  <td>
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        {company.website}
                      </a>
                    ) : '-'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(company)} className="btn-edit">
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(company.id)} className="btn-delete">
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

      {/* AI Information Modal */}
      {selectedCompany && (
        <div className="modal-overlay" onClick={closeAIModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <span className="ai-badge">🤖 AI</span> Thông tin về: {selectedCompany.name}
              </h3>
              <button onClick={closeAIModal} className="btn-close">×</button>
            </div>
            <div className="modal-body">
              {loadingAI ? (
                <div className="loading-ai">
                  <div className="spinner"></div>
                  <p>Đang tìm kiếm thông tin với AI...</p>
                </div>
              ) : aiInfo ? (
                <div className="ai-info">
                  <div className="ai-answer">
                    <pre>{aiInfo.answer}</pre>
                  </div>
                  {aiInfo.sources && aiInfo.sources.length > 0 && (
                    <div className="ai-sources">
                      <h4>Nguồn tham khảo:</h4>
                      <ul>
                        {aiInfo.sources.map((source, index) => (
                          <li key={index}>
                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                              {source.title || source.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p>Không có thông tin</p>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={closeAIModal} className="btn-secondary">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyList;
