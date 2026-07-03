import { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { useDashboardContext, type Template } from '../context/DashboardContext';
import { Modal } from '../components/Modal';
import './TemplatesPage.css';

const TemplatesPage = () => {
  const { templates, addTemplate, deleteTemplate, addTask } = useDashboardContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;
    addTemplate(title, description);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const useTemplate = (t: Template) => {
    addTask(`${t.title} - ${t.description}`, 'Medium');
  };

  const openModal = () => {
    setTitle('');
    setDescription('');
    setIsModalOpen(true);
  };

  return (
    <div className="page-container">
      <div className="header">
        <div className="header-left">
          <h1 className="page-title">Templates</h1>
          <p className="page-subtitle">Manage reusable tasks and workflows.</p>
        </div>
        <div className="header-right">
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> New Template
          </button>
        </div>
      </div>

      <div className="templates-grid">
        {templates.map(t => (
          <div key={t.id} className="card template-card" onMouseEnter={(e) => e.currentTarget.classList.add('hovered')} onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}>
            <div>
              <div className="template-header">
                <FileText size={16} className="icon" />
                <h3 className="template-title">{t.title}</h3>
              </div>
              <p className="template-description">{t.description}</p>
            </div>
            <div className="template-actions">
              <button className="btn btn-outline" onClick={() => useTemplate(t)}>Use Template</button>
              <button className="btn btn-danger" onClick={() => deleteTemplate(t.id)}>Delete</button>
            </div>
          </div>
        ))}
        
        {templates.length === 0 && (
          <div className="card empty-state">
            <FileText size={32} className="icon" />
            <p>No templates found.</p>
            <button className="btn btn-outline" onClick={() => openModal()}>Create One</button>
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Template">
        <div className="flex flex-col gap-4">
          <input type="text" className="modal-input" placeholder="Template title..." value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <textarea className="modal-input" placeholder="Template description..." rows={4} value={description} onChange={e => setDescription(e.target.value)}></textarea>
          <button className="btn btn-primary mt-2" onClick={handleSave}>Save Template</button>
        </div>
      </Modal>
    </div>
  );
};

export default TemplatesPage;
