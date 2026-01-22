export default interface BlogInterface {
    id: number;
    title: string;
    slug: string;
    created_at: string;
    updated_at: string;
    tags: string[];
    image: string;
    content: string;
    author: {
        name: string;
        image: string;
    };
}