export { }

declare global {
    interface article {
        _id: string;
        title: string;
        metaDescription: string;
        content: string;
        slug: string;
        _createdAt: Date;
        _updatedAt: Date;
        course: string;
        subCourse: string;
    }

    interface course {
        _id: string;
        title: string;
        metaDescription: string;
        slug: string;
        _createdAt: Date;
        _updatedAt: Date;
    }

    interface subCourse {
        _id: string;
        title: string;
        metaDescription: string;
        slug: string;
        _createdAt: Date;
        _updatedAt: Date;
        course: string;
    }
}