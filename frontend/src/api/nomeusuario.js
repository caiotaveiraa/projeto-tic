export function getNomeUsuario() {
    const nomeusuario = {
    idusuario: localStorage.getItem('idUsuario'),
    displayName: localStorage.getItem('nomeUsuario'),
    email: '',
    photoURL: '/assets/images/avatars/avatar_23.jpg',
    }
    return nomeusuario
}