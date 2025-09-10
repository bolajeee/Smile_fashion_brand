// Stub implementation for uploadImage. Replace with real Cloudinary logic as needed.
export async function uploadImage(image: string): Promise<string> {
	// TODO: Implement actual upload logic
	return 'https://dummy-cloudinary-url.com/' + encodeURIComponent(image.slice(0, 10));
}
