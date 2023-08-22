import axios from 'axios';

export async function login(user: any) {
    try {
        const response = await axios.post("https://roee-supermarket-04ji.onrender.com/login/", user);
        return response;
    } catch (error) {
        throw error; 
    }
}

export function testAbout(token:string) {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return new Promise<{ data: any }>((resolve) =>
        axios.get("https://roee-supermarket-04ji.onrender.com/about/",config).then(res => resolve({ data: res.data }))
    );
}

export function testContact() {
    return new Promise<{ data: any }>((resolve) =>
        axios.get("https://roee-supermarket-04ji.onrender.com/contact/").then(res => resolve({ data: res.data }))
    );
}
