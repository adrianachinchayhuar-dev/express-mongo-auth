document.addEventListener('DOMContentLoaded', async () => {
    try {
        const u = await Auth.api('/api/users/me');
        document.getElementById('welcome').textContent = `Bienvenido, ${u.name} ${u.lastName || ''}`;
        const rows = [
            ['Email', u.email],
            ['Teléfono', u.phoneNumber || '-'],
            ['Fecha de nacimiento', fmtDate(u.birthdate)],
            ['Edad', u.age ?? '-'],
            ['Dirección', u.adress || '-'],
            ['Rol', u.roles.join(', ')],
            ['Registrado el', fmtDateTime(u.createdAt)]
        ];
        document.getElementById('userData').innerHTML =
            rows.map(([k, v]) => `<tr><th>${k}</th><td>${esc(v)}</td></tr>`).join('');
    } catch (err) { toast(err.message); }
});