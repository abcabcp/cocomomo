import { Progress } from "@/features/cocomomo";
import Image from "next/image";

export function Loading() {
    return (
        <div className="fixed inset-0 flex items-center flex-col justify-center z-99 bg-black bg-opacity-80">
            <Image
                src="/assets/svgs/load.svg"
                alt="load"
                width={130}
                height={130}
                priority={true}
                loading="eager"
            />
            <Progress />
        </div>
    );
}