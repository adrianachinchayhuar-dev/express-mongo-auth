// Si ya hay sesión válida, ir al dashboard que corresponde
(() => {
    const p = Auth.payload();
    if (p && !Auth.isExpired(p)) window.location.href = Auth.homeFor(Auth.roles());
})();

document.getElementById('signInForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (!email || !password) return toast('Ingresa tu email y contraseña');

    try {
        const res = await fetch('/api/auth/signIn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');

        Auth.setToken(data.token);
        window.location.href = Auth.homeFor(Auth.roles());
    } catch (err) {
        toast(err.message);
    }
});