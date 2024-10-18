import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineLink } from 'react-icons/ai';
import ReactQuill from 'react-quill'; // Import Quill
import 'react-quill/dist/quill.snow.css';

export default function Templates({ templates: initialTemplates }) {
    const [templates, setTemplates] = useState(initialTemplates);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ name: '', content: '' });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
    const [urlText, setUrlText] = useState('');
    const [urlLink, setUrlLink] = useState('');

    const handleAdd = () => {
        setIsModalOpen(true);
        setNewTemplate({ name: '', content: '' });
        setEditingTemplate(null);
    };

    const handleEdit = (template) => {
        setIsModalOpen(true);
        setNewTemplate({ name: template.name, content: template.content });
        setEditingTemplate(template);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewTemplate({ name: '', content: '' });
        setEditingTemplate(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTemplate((prev) => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content) => {
        setNewTemplate((prev) => ({ ...prev, content })); // Update content from Quill editor
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredTemplates = templates.filter((template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        try {
            const response = await fetch('/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(newTemplate),
            });

            if (response.ok) {
                const data = await response.json();
                setTemplates((prevTemplates) => [...prevTemplates, data]);
                toast.success('Template created successfully!');
                handleModalClose();
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                toast.error(errorData.error || 'Failed to create template');
            }
        } catch (error) {
            console.error('Error adding template:', error);
            toast.error('Error adding template');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        try {
            const response = await fetch(`/templates/${editingTemplate.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(newTemplate),
            });

            if (response.ok) {
                const updatedTemplate = await response.json();
                setTemplates((prevTemplates) =>
                    prevTemplates.map((template) =>
                        template.id === updatedTemplate.id ? updatedTemplate : template
                    )
                );
                toast.success('Template updated successfully!');
                handleModalClose();
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                toast.error(errorData.error || 'Failed to update template');
            }
        } catch (error) {
            console.error('Error updating template:', error);
            toast.error('Error updating template');
        }
    };

    const handleDelete = (template) => {
        setIsDeleteModalOpen(true);
        setTemplateToDelete(template);
    };

    const confirmDelete = async () => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        try {
            const response = await fetch(`/templates/${templateToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            if (response.ok) {
                setTemplates((prevTemplates) => prevTemplates.filter((template) => template.id !== templateToDelete.id));
                toast.success('Template deleted successfully!');
                setIsDeleteModalOpen(false);
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                toast.error(errorData.error || 'Failed to delete template');
            }
        } catch (error) {
            console.error('Error deleting template:', error);
            toast.error('Error deleting template');
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setTemplateToDelete(null);
    };

    const handleCopy = async (content) => {
        try {
            const tempElement = document.createElement('textarea');
            tempElement.innerHTML = content;
            document.body.appendChild(tempElement);
            tempElement.select();
            document.execCommand('copy');
            document.body.removeChild(tempElement);
            toast.success('Template content copied to clipboard!');
        } catch (error) {
            console.error('Error copying text:', error);
            toast.error('Failed to copy template content');
        }
    };

    const handleInsertUrl = () => {
        setIsUrlModalOpen(true);
    };

    const handleUrlSubmit = () => {
        const link = `<a href="${urlLink}" target="_blank">${urlText}</a>`;
        setNewTemplate((prev) => ({
            ...prev,
            content: prev.content + link,
        }));
        setIsUrlModalOpen(false);
        setUrlText('');
        setUrlLink('');
    };

    const handleUrlModalClose = () => {
        setIsUrlModalOpen(false);
        setUrlText('');
        setUrlLink('');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-200">
                    Templates
                </h2>
            }
        >
            <Head title="Templates" />
            <ToastContainer />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-gray-900 shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-100">
                            <div className="flex items-center mb-4">
                                <button 
                                    onClick={handleAdd}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Add New
                                </button>

                                <input 
                                    type="text" 
                                    placeholder="Search templates..." 
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="ml-4 flex-1 px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg"
                                />
                            </div>

                            {filteredTemplates.length > 0 ? (
                                <ul>
                                    {filteredTemplates.map((template) => (
                                        <li key={template.id} className="mb-4 p-4 border border-gray-600 rounded-lg">
                                            <div className="flex justify-between">
                                                <div>
                                                    <div className="text-lg font-medium text-gray-100">
                                                        {template.name}
                                                    </div>
                                                    <div className="text-gray-300">
                                                        <p dangerouslySetInnerHTML={{ __html: template.content }}></p>
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        <p>Created At: {new Date(template.created_at).toLocaleString()}</p>
                                                        <p>Updated At: {new Date(template.updated_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button 
                                                        onClick={() => handleEdit(template)} 
                                                        className="px-2 py-1 bg-yellow-600 text-white rounded h-8"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleCopy(template.content)} 
                                                        className="px-2 py-1 bg-green-600 text-white rounded h-8"
                                                    >
                                                        Copy
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(template)} 
                                                        className="px-2 py-1 bg-red-600 text-white rounded h-8"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400">No templates found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for adding/editing templates */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded shadow-lg w-[1200px]">
                        <h3 className="text-lg font-semibold text-gray-200">
                            {editingTemplate ? 'Edit Template' : 'Add Template'}
                        </h3>
                        <form onSubmit={editingTemplate ? handleUpdate : handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={newTemplate.name}
                                    onChange={handleInputChange}
                                    required
                                    className="px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Content</label>
                                <ReactQuill 
                                    value={newTemplate.content} 
                                    onChange={handleContentChange} 
                                    theme="snow"
                                    className="h-40"
                                />
                            </div>

                            <div className="flex justify-between mt-[70px]">
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded"
                                >
                                    {editingTemplate ? 'Update' : 'Add'}
                                </button>
                                <button onClick={handleModalClose} className="mt-4 text-gray-400 hover:underline">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for delete confirmation */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-200">Confirm Delete</h3>
                        <p className="text-gray-400">Are you sure you want to delete the template "{templateToDelete?.name}"?</p>
                        <div className="flex justify-between mt-4">
                            <button 
                                onClick={confirmDelete} 
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Yes, Delete
                            </button>
                            <button 
                                onClick={handleCancelDelete} 
                                className="px-4 py-2 bg-gray-600 text-white rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for inserting URL */}
            {isUrlModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-200">Insert URL</h3>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2">Text</label>
                            <input 
                                type="text"
                                value={urlText}
                                onChange={(e) => setUrlText(e.target.value)}
                                className="px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2">URL</label>
                            <input 
                                type="url"
                                value={urlLink}
                                onChange={(e) => setUrlLink(e.target.value)}
                                className="px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded w-full"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button 
                                onClick={handleUrlSubmit} 
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                Insert
                            </button>
                            <button 
                                onClick={handleUrlModalClose} 
                                className="px-4 py-2 bg-gray-600 text-white rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
