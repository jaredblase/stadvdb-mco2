export default async function promiseHandler(promise) {
    try {
        const data = await promise;
        return { succes: true, data, error: null }
    } catch (error) {
        return { success: false, error, data: null}
    }
}
