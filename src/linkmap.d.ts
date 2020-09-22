declare module "linkmap.json" {
    const value: {
        namespaceName: string,
        name: string,
        comment: string | null,
        path: string
    }[];
    export default value;
}