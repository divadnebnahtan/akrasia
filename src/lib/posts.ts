const modules = import.meta.glob('/src/content/*.svx');

export function getAllPosts() {
	return Object.keys(modules).map((path) => ({
		slug: path.split('/').pop()?.replace('.svx', '')
	}));
}

export async function getPost(slug: string) {
	const match = Object.entries(modules).find(([path]) =>
		path.endsWith(`/${slug}.svx`)
	);

	if (!match) return null;
	return match[1]();
}