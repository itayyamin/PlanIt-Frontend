import React, { useState, useEffect } from 'react';
import {
    Folders,
    Users,
    Package,
    FileText,
    Menu,
    ChevronDown
} from 'lucide-react';
import Tasks from './dashboard/Tasks';
import Items from './dashboard/Items';
import Description from './dashboard/Description';
import People from './dashboard/People';
import { apiService } from '../services/api';

const DashboardLayout = () => {
    const [events, setEvents] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeTab, setActiveTab] = useState('tasks');
    const [isLoading, setIsLoading] = useState(true);
    const [projectDescription, setProjectDescription] = useState('');

    const tabs = [
        { id: 'description', label: 'Description', icon: <FileText className="w-4 h-4" /> },
        { id: 'people', label: 'People', icon: <Users className="w-4 h-4" /> },
        { id: 'tasks', label: 'Tasks', icon: <Folders className="w-4 h-4" /> },
        { id: 'items', label: 'Items', icon: <Package className="w-4 h-4" /> },
    ];

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const fetchedEvents = await apiService.get_user_events();
                console.log('Fetched events:', fetchedEvents);
                setEvents(fetchedEvents);

                if (fetchedEvents && fetchedEvents.length > 0) {
                    const firstEvent = fetchedEvents[0];
                    setSelectedProject({
                        id: firstEvent.id,
                        title: firstEvent.title,
                        description: firstEvent.description || ''
                    });
                    setProjectDescription(firstEvent.description || '');
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleProjectChange = (eventId) => {
        const selected = events.find(event => event.id.toString() === eventId);
        setSelectedProject({
            id: selected.id,
            title: selected.title,
            description: selected.description || ''
        });
        setProjectDescription(selected.description || '');
    };

    const handleDescriptionChange = (newDescription) => {
        setProjectDescription(newDescription);
        setSelectedProject(prev => ({
            ...prev,
            description: newDescription
        }));
        // Here you could also add an API call to update the description on the server
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-200">
                <div className="px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Menu className="w-6 h-6 flex-shrink-0" />
                        <div className="relative w-64">
                            {isLoading ? (
                                <div className="w-full rounded-md border border-gray-300 p-2 bg-gray-50">
                                    Loading projects...
                                </div>
                            ) : (
                                <select
                                    value={selectedProject?.id || ''}
                                    onChange={(e) => handleProjectChange(e.target.value)}
                                    className="w-full appearance-none rounded-md border border-gray-300 p-2 pr-8 bg-white text-sm truncate"
                                >
                                    {events.map(event => (
                                        <option key={event.id} value={event.id} className="text-sm">
                                            {event.title}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex h-[calc(100vh-64px)]">
                <aside className="w-42 bg-white border-r border-gray-200">
                    <nav className="p-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md mb-2 ${
                                    activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 p-6 overflow-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {tabs.find(tab => tab.id === activeTab)?.label}
                        </h2>
                        <div>
                            {activeTab === 'tasks' && (
                                <Tasks projectId={selectedProject?.id} />
                            )}
                            {activeTab === 'items' && (
                                <Items projectId={selectedProject?.id} />
                            )}
                            {activeTab === 'description' && (
                                <Description
                                    projectId={selectedProject?.id}
                                    description={projectDescription}
                                    onDescriptionChange={handleDescriptionChange}
                                />
                            )}
                            {activeTab === 'people' && selectedProject?.id && (
                                <People projectId={selectedProject.id} />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;