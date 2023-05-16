// webService.js
export async function callWebService(file1, file2) {
    const headers = new Headers();

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    try {
        const response = await fetch('http://localhost:8081/points', {
            method: 'POST',
            headers: headers,
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la requête :', error);
        throw error;
    }
}
