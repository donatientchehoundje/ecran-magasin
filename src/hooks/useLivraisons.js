import { useState, useEffect } from 'react';
import axios from 'axios';

export function useLivraisons(pollInterval = 5000) {
  const [livraisons, setLivraisons] = useState([]);
  const [stats, setStats] = useState({
    en_attente: 0,
    livrées: 0,
    partielles: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL API STATIQUE - À CONFIGURER AVEC TON DOMAINE
  const API_URL = 'https://demo-factura.app-bys.com/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const client = axios.create({
          baseURL: API_URL,
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
  }, [pollInterval]);

  return { livraisons, stats, loading, error };
}
