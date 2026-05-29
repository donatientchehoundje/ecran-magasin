import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTenant } from './useTenant';

export function useLivraisons(pollInterval = 5000) {
  const { apiUrl } = useTenant();
  const [livraisons, setLivraisons] = useState([]);
  const [stats, setStats] = useState({
    en_attente: 0,
    livrées: 0,
    partielles: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Créer un client axios avec l'URL dynamique du tenant
        const client = axios.create({
          baseURL: apiUrl,
          timeout: 5000,
        });

        const response = await client.get('/livraisons/en-attente');
        setLivraisons(response.data.data);
        setStats(response.data.stats);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Erreur fetch livraisons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval, apiUrl]);

  return { livraisons, stats, loading, error };
}
