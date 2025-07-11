import { Loading } from "@/shared";

export default function LogoutLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Loading />
            {children}
        </>
    )
}