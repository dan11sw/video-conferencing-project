/**
 * @typedef SignInDto
 * @property {string} email.required
 * @property {string} password.required
 */
class SignInDto {
    email;
    password;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default SignInDto;