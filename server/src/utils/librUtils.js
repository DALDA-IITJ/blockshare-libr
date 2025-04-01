import axios from 'axios';

export async function librVerification(transaction) {
    try {
        const { sender, data } = transaction;
        const { type, metadata } = data;
        const { ip, port } = metadata;
        
        if (!ip || !port) return false; // Invalid metadata
        
        const url = `http://${ip}:${port}/blockchain`;

        if (type === "DB_JOINED" || type === "MOD_JOINED") {
            // Expect a successful response (status 200) for join events
            const response = await axios.get(url, { timeout: 5000 });
            return response.status === 200;
        } 
        else if (type === "DB_LEFT" || type === "MOD_LEFT") {
            // Expect a failure (network error) or error codes >= 400 for leave events
            try {
                const response = await axios.get(url, { timeout: 5000 });
                return response.status >= 400; // If status >= 400, consider node left, else return false
            } catch (error) {
                return true; // Request failure (network error, timeout) means the node is offline
            }
        }
        
        return true; // Unknown transaction type
    } catch (error) {
        return false;
    }
}