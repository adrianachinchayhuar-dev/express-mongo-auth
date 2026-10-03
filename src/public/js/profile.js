const fields = ['name', 'lastName', 'phoneNumber', 'birthdate', 'adress', 'url_profile'];

function fill(u) {
    document.getElementById('email').value = u.email;
    document.getElementById('age').value = u.age ?? '';
    fields.forEach(f => {
        const v = u[f] || '';
        document.getElementById(f).value = f === 'birthdate' && v ? v.slice(0, 10) : v;
    });
    document.getElementById('meta').textContent =
        `Rol: ${u.roles.join(', ')} · Registrado el ${fmtDateTime(u.createdAt)}`;
    M.updateTextFields();
}

document.addEventListener('DOMContentLoaded', async () => {
    try { fill(await Auth.api('/api/users/me')); }
    catch (err) { toast(err.message); }
});

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {};
    fields.forEach(f => body[f] = document.getElementById(f).value.trim());
    try {
        fill(await Auth.api('/api/users/me', { method: 'PUT', body: JSON.stringify(body) }));
        toast('Perfil actualizado', 'green');
    } catch (err) { toast(err.message); }
});