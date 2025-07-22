import { BlogLayout } from "@/features/blog/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <BlogLayout>{children}</BlogLayout>
}