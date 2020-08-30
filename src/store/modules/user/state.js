import Cookies from 'js-cookie';
export default {
    token: Cookies.get('Admin-Token'),
    name: '',
    avatar: '',
    dbs_prefix: '',
    roles: [],
    user_id: '',
  }