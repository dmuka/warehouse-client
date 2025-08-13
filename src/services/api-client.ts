interface ApiFetchOptions extends RequestInit {
  showToast?: boolean;
  allowEmptyResponse?: boolean;
}

export async function apiFetch<T>(
  url: string,
  options?: ApiFetchOptions
): Promise<T | null> {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, application/problem+json',
    ...options?.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      if (options?.allowEmptyResponse) {
        return null;
      }
      throw new Error('Empty response received');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.title ||
        errorData?.message ||
        `Request failed: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }

    return await response.json() as T;
  } catch (error) {
    console.error('API Error:', error);

    throw error;

  }
}