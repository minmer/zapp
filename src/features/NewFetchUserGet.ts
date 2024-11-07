export interface UserOutput {
    token: string;
}

export async function FetchUserGet(user: string, password: string): Promise<UserOutput | null> {
    try {
        const response = await fetch('https://zapp.hostingasp.pl/user/get/', {
            method: 'POST',
            credentials: 'include', // Include cookies for secure authentication
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user,
                password,
            }),
        });

        if (response.status === 200) {
            return (await response.json()) as UserOutput;
        }

        console.warn(`User get request failed with status: ${response.status}`);
        return null;
    } catch (error) {
        console.error("Error in FetchUserGet:", error);
        return null;
    }
}
