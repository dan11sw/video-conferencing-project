/**
 * @typedef SignUpDto
 * @property {string} email.required
 * @property {string} password.required
 * @property {string} nickname.required
 */
class SignUpDto {
    email;
    password;
    nickname;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default SignUpDto;