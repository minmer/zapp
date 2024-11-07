export async function FetchUserDelete(user: string, password: string): Promise<Response> {
    try {
        const response = await fetch('https://zapp.hostingasp.pl/user/', {
            method: 'DELETE',
            credentials: 'include', // Use cookies for authentication
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user,
                password,
                databasekey: 'c5jY&V8;kXo!5HFy?)Z8g%qzgC',
            }),
        });

        if (!response.ok) {
            console.error(`Failed to delete user: ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error("Error in FetchUserDelete:", error);
        throw error; // Propagate error to the caller
    }
}
