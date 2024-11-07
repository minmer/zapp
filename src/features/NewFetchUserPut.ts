export async function FetchUserPut(user: string, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
        const response = await fetch('https://zapp.hostingasp.pl/user/', {
            method: 'PUT',
            credentials: 'include', // Include cookies for secure authentication
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user,
                oldpassword: oldPassword,
                newpassword: newPassword,
                databasekey: 'c5jY&V8;kXo!5HFy?)Z8g%qzgC',
            }),
        });

        if (response.status === 200) {
            return true;
        }

        console.warn(`User password update failed with status: ${response.status}`);
        return false;
    } catch (error) {
        console.error("Error in FetchUserPut:", error);
        return false;
    }
}
