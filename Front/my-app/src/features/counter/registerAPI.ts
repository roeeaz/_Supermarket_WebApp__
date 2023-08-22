import axios from 'axios'

export function register(user: any) {
    return new Promise<{ data: any }>((resolve) =>
        axios.post("https://roee-supermarket-04ji.onrender.com/register/", user).then(res => resolve({ data: res.data }))
    );
}
