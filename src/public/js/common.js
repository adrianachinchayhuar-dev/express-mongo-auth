// Token JWT, guardia de rutas y fetch autenticado
const Auth = {
    getToken() { return sessionStorage.getItem('token'); },
    setToken(t) { sessionStorage.setItem('token', t); },

    logout() {
        sessionStorage.removeItem('token');
        window.location.href = '/signIn';
    },

    // Decodifica el payload del JWT (sub, roles, iat, exp)
    payload() {
        const token = this.getToken();
        if (!token) return null;
        try {
            const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(b64));
        } catch { return null; }
    },

    isExpired(p) { return !p || !p.exp || p.exp * 1000 <= Date.now(); },

    roles() { const p = this.payload(); return p ? (p.roles || []) : []; },

    homeFor(roles) { return roles.includes('admin') ? '/admin' : '/dashboard'; },

    // fetch con Authorization; si responde 401 cierra sesión
    async api(url, options = {}) {
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.getToken(),
                ...(options.headers || {})
            }
        });
        if (res.status === 401) { this.logout(); throw new Error('Sesión expirada'); }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Error en la solicitud');
        return data;
    },

    // Sin token / expirado => /signIn ; sin rol suficiente => /403
    guard() {
        const p = this.payload();
        if (this.isExpired(p)) return this.logout();

        const allowed = (document.body.dataset.roles || '').split(',').filter(Boolean);
        if (allowed.length && !this.roles().some(r => allowed.includes(r))) {
            window.location.href = '/403';
            return;
        }
        // Cierra sesión automáticamente cuando el token venza
        setTimeout(() => this.logout(), Math.max(p.exp * 1000 - Date.now(), 0));
    }
};

// Escapa HTML para evitar XSS al usar innerHTML
function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, ch =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function toast(msg, cls = 'red') { M.toast({ html: msg, classes: cls }); }

function fmtDate(d) {
    return d ? new Date(d).toLocaleDateString('es-PE', { timeZone: 'UTC' }) : '-';
}
function fmtDateTime(d) {
    return d ? new Date(d).toLocaleString('es-PE', { timeZone: 'America/Lima' }) : '-';
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.hasAttribute('data-protected')) {
        Auth.guard();
        document.querySelectorAll('[data-role]').forEach(el => {
            if (Auth.roles().includes(el.dataset.role)) el.style.display = '';
        });
        const btn = document.getElementById('btnLogout');
        if (btn) btn.addEventListener('click', e => { e.preventDefault(); Auth.logout(); });
    }
});