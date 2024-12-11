// src/components/dashboard/People.jsx
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { apiService } from '../../services/api';

const People = ({ projectId }) => {
    const [people, setPeople] = useState([]);
    const [newPerson, setNewPerson] = useState({ name: '', email: '', role: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPeople = async () => {
            if (!projectId) return;

            setIsLoading(true);
            setError(null);

            try {
                // First fetch event details
                const eventDetails = await apiService.getEventDetails(projectId);

                // Then fetch details for each participant
                const participantPromises = eventDetails.participants.map(async (participant) => {
                    const userDetails = await apiService.getUserDetails(participant.user_id);
                    return {
                        id: userDetails.id,
                        name: userDetails.username,
                        email: userDetails.email,
                        role: participant.role
                    };
                });

                // Wait for all user details to be fetched
                const participantsWithDetails = await Promise.all(participantPromises);
                setPeople(participantsWithDetails);

            } catch (error) {
                console.error('Failed to fetch participants:', error);
                setError('Failed to load participants');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPeople();
    }, [projectId]);

    const addPerson = (e) => {
        e.preventDefault();
        if (newPerson.name && newPerson.email) {
            setPeople([...people, { ...newPerson, id: people.length + 1 }]);
            setNewPerson({ name: '', email: '', role: '' });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-4">
                {error}
            </div>
        );
    }

    return (
        <div>
            <form onSubmit={addPerson} className="mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={newPerson.name}
                    onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                    className="flex-1 rounded-md border p-2"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newPerson.email}
                    onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                    className="flex-1 rounded-md border p-2"
                />
                <input
                    type="text"
                    placeholder="Role"
                    value={newPerson.role}
                    onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
                    className="w-48 rounded-md border p-2"
                />
                <button
                    type="submit"
                    className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                    <Plus className="h-4 w-4" /> Add Person
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b">
                        <th className="pb-2 text-left">Name</th>
                        <th className="pb-2 text-left">Email</th>
                        <th className="pb-2 text-left">Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {people.map(person => (
                        <tr key={person.id} className="border-b">
                            <td className="py-2">{person.name}</td>
                            <td className="py-2">{person.email}</td>
                            <td className="py-2">{person.role}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default People;