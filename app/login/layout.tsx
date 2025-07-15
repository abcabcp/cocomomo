import { Loading } from "@/shared";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Loading />
            {children}
        </>
    )
}