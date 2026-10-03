let users = [];

document.addEventListener('DOMContentLoaded', async () => {
    const modal = M.Modal.init(document.getElementById('userModal'));
    try {
        users = await Auth.api('/api/users');
        document.getElementById('count').textContent = users.length;
        document.getElementById('usersBody').innerHTML = users.map((u, i) => `
            <tr>
                <td>${esc(u.name)} ${esc(u.lastName)}</td>
                <td>${esc(u.email)}</td>
                <td>${esc(u.roles.join(', '))}</td>
                <td>${esc(u.phoneNumber || '-')}</td>
                <td>${esc(u.age ?? '-')}</td>
                <td>${fmtDateTime(u.createdAt)}</td>
                <td><button class="btn-small teal darken-2 btn-ver" data-i="${i}"><i class="material-icons left">visibility</i>Ver</button></td>
            </tr>`).join('');
    } catch (err) { toast(err.message); }

    document.getElementById('usersBody').addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-ver');
        if (!btn) return;
        const u = users[btn.dataset.i];
        document.getElementById('modalTitle').textContent = `${u.name} ${u.lastName || ''}`;
        const rows = [
            ['ID', u.id], ['Email', u.email], ['Rol', u.roles.join(', ')],
            ['Teléfono', u.phoneNumber || '-'], ['Fecha de nacimiento', fmtDate(u.birthdate)],
            ['Edad', u.age ?? '-'], ['Dirección', u.adress || '-'],
            ['URL de perfil', u.url_profile || '-'],
            ['Registrado el', fmtDateTime(u.createdAt)], ['Última actualización', fmtDateTime(u.updatedAt)]
        ];
        document.getElementById('modalBody').innerHTML =
            rows.map(([k, v]) => `<tr><th>${k}</th><td>${esc(v)}</td></tr>`).join('');
        modal.open();
    });
});