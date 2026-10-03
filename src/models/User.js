import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    // Aquí se guarda el HASH (bcrypt). La regla de 8 caracteres, mayúscula,
    // dígito y especial se valida en AuthService ANTES de hashear.
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    url_profile: {
        type: String,
        trim: true
    },
    adress: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Edad calculada a partir de birthdate (no se guarda en la BD)
UserSchema.virtual('age').get(function () {
    if (!this.birthdate) return null;
    const today = new Date();
    const b = this.birthdate;
    let age = today.getUTCFullYear() - b.getUTCFullYear();
    const m = today.getUTCMonth() - b.getUTCMonth();
    if (m < 0 || (m === 0 && today.getUTCDate() < b.getUTCDate())) age--;
    return age;
});

export default mongoose.model('User', UserSchema);
