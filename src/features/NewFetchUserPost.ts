export async function FetchUserPost(user: string, password: string): Promise<boolean> {
    try {
        const response = await fetch('https://zapp.hostingasp.pl/user/', {
            method: 'POST',
            credentials: 'include', // Include cookies for secure authentication
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user,
                password,
                databasekey: 'c5jY&V8;kXo!5HFy?)Z8g%qzgC',
            }),
        });

        if (response.status === 200) {
            return true;
        }

        console.warn(`User post request failed with status: ${response.status}`);
        return false;
    } catch (error) {
        console.error("Error in FetchUserPost:", error);
        return false;
    }
}
