// Détecte le tenant depuis le paramètre URL
// https://ecran-magasin.vercel.app/?tenant=ibp → ibp
// https://ecran-magasin.vercel.app/ → demo-factura (défaut)
export function useQueryTenant() {
  const getTenant = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tenant') || 'localhost'; // Défaut : demo-factura
  };

  const getTenantApiUrl = (tenant) => {
    // Map tes tenants vers leurs domaines API
    const tenantMap = {
      'demo-factura': 'https://demo-factura.app-bys.com',
      'ibp': 'https://ibp.app-bys.com',
      'ctpsakpakpa': 'https://ctpsakpakpa.app-bys.com',
      'ctpsmenontin': 'https://ctpsmenontin.app-bys.com',
      'gp': 'https://gp.app-bys.com',
      'localhost': 'http://localhost:8000',
      // Ajoute d'autres tenants ici
    };

    return (tenantMap[tenant] || tenantMap['demo-factura']) + '/api';
  };

  const tenant = getTenant();
  const apiUrl = getTenantApiUrl(tenant);

  return { tenant, apiUrl };
}
