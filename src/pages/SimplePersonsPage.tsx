import React, { useEffect, useState } from 'react';
import { buildApiUrl } from '../config/api';

export const SimplePersonsPage: React.FC = () => {
  const [persons, setPersons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔥 SimplePersonsPage useEffect triggered');
    
    const fetchPersons = async () => {
      try {
        console.log('🔥 About to make fetch request');
  const response = await fetch(buildApiUrl('/persons'), {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'secure-api-key-2024'
          }
        });
        
        console.log('🔥 Fetch response:', response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('🔥 Fetch data:', data);
        
        setPersons(data.data || []);
      } catch (err) {
        console.error('🔥 Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPersons();
  }, []);

  console.log('🔥 SimplePersonsPage render:', { persons, loading, error });

  if (loading) return <div>Loading persons...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Simple Persons Page</h1>
      <p>Found {persons.length} persons</p>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            {person.email} - {person.role}
          </li>
        ))}
      </ul>
    </div>
  );
};
