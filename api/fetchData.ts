export async function fetchDataFromUrl(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}
