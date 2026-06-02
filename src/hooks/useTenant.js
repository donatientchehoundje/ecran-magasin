// Détecte le tenant depuis le sous-domaine Vercel
// ecran-magasin-demo-factura.vercel.app → demo-factura
// ecran-magasin-ibp.vercel.app → ibp
export function useTenant() {
  const getTenantFromUrl = () => {
    const hostname = window.location.hostname;

    // Cas local
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return 'localhost';
    }

    // Cas Vercel : ecran-magasin-TENANT.vercel.app
    // Extrait la partie après le dernier tiret avant vercel.app
    if (hostname.includes('vercel.app')) {
      const match = hostname.match(/ecran-magasin-([a-z0-9-]+)\.vercel\.app/);
      if (match && match[1]) {
        return match[1]; // retourne : demo-factura, ibp, ctps, etc.
      }
    }

    // Fallback
    return 'default';
  };

  const getTenantApiDomain = (tenant) => {
    // Map ton tenant Vercel vers ton domaine API Hostinger
    const tenantMap = {
      'demo-factura': 'demo-factura.app-bys.com',
      'ibp': 'ibp.app-bys.com',
      'ctpsakpakpa': 'ctpsakpakpa.app-bys.com',
      'ctpsmenontin': 'ctpsmenontin.app-bys.com',
      'gp': 'gp.app-bys.com',
      'localhost': 'localhost:8000',
      // Ajoute tes autres tenants ici
    };

    return tenantMap[tenant] || tenantMap['default'];
  };

  const getApiUrl = () => {
    const protocol = window.location.protocol;
    const tenant = getTenantFromUrl();
    const tenantDomain = getTenantApiDomain(tenant);

    return `${protocol}//${tenantDomain}/api`;
  };

  return {
    tenant: getTenantFromUrl(),
    apiUrl: getApiUrl(),
  };
}
