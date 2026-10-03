const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@]).{8,}$/;

document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const val = id => document.getElementById(id).value.trim();
    const body = {
        name: val('name'),
        lastName: val('lastName'),
        phoneNumber: val('phoneNumber'),
        birthdate: val('birthdate'),
        email: val('email'),
        password: document.getElementById('password').value
    };

    if (Object.values(body).some(v => !v)) return toast('Completa todos los campos');
    if (!PASSWORD_REGEX.test(body.password))
        return toast('La contraseña debe tener 8+ caracteres, 1 mayúscula, 1 número y 1 especial (# $ % & * @)');

    try {
        const res = await fetch('/api/auth/signUp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error al registrarse');

        toast('Registro exitoso. Ahora inicia sesión', 'green');
        setTimeout(() => window.location.href = '/signIn', 1200);
    } catch (err) {
        toast(err.message);
    }
});