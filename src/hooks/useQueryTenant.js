// Détecte le tenant depuis le paramètre URL
// https://ecran-magasin.vercel.app/?tenant=ibp → ibp
// https://ecran-magasin.vercel.app/ → demo-factura (défaut)
export function useQueryTenant() {
  const getTenant = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tenant') || 'demo-factura'; // Défaut : demo-factura
  };

  const getTenantApiUrl = (tenant) => {
    // Map tes tenants vers leurs domaines API
    const tenantMap = {
      'demo-factura': 'https://demo-factura.app-bys.com',
      'ibp': 'https://ibp.app-bys.com',
      'ctps': 'https://ctps.app-bys.com',
      // Ajoute d'autres tenants ici
    };

    return (tenantMap[tenant] || tenantMap['demo-factura']) + '/api';
  };

  const tenant = getTenant();
  const apiUrl = getTenantApiUrl(tenant);

  return { tenant, apiUrl };
}
