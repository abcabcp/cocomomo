'use client';

import { useAuth } from "@/features/auth";
import { cn, useOutsideClick } from "@/shared";
import { useModalStore, useUserStore } from "@/shared/store";
import { useSession } from "next-auth/react";
import { RefObject, useRef } from "react";
import { SUBMENU_STATE } from "./Header";


export function SubMenu({
    dropdownState,
    handleDropdownClick
}: {
    dropdownState: SUBMENU_STATE;
    handleDropdownClick: (state: SUBMENU_STATE) => void;
}) {
    const { setPreviousPath } = useModalStore();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { status } = useSession();
    const { handleGithubLogin, handleLogout } = useAuth();
    const { user } = useUserStore();

    useOutsideClick(dropdownRef as RefObject<HTMLElement>, () => {
        if (dropdownState !== SUBMENU_STATE.NONE) handleDropdownClick(SUBMENU_STATE.NONE);
    }, dropdownState !== SUBMENU_STATE.NONE);

    return (
        <>
            {dropdownState !== SUBMENU_STATE.NONE && (
                <div ref={dropdownRef}
                    className={cn("absolute top-6 left-2 w-48 shadow-lg rounded-md bg-black/70 text-white font-bold text-xs border-1 border-gray-800", {
                        'left-2': dropdownState === SUBMENU_STATE.COCOMOMO,
                        'left-9': dropdownState === SUBMENU_STATE.HELP,
                    })}
                >
                    <ul>
                        {dropdownState === SUBMENU_STATE.COCOMOMO &&
                            <>
                                <li className="w-full px-2 min-w-24 text-ellipsis">
                                    <button
                                        onClick={() => {
                                            window.location.href = '/';
                                            window.history.pushState(null, '', '/');
                                            setPreviousPath('/');
                                        }}
                                        className="w-full py-1 hover:bg-white/10 text-start">
                                        홈으로 가기
                                    </button>
                                    <button className="py-1 hover:bg-white/10 w-full border-b border-gray-800 text-start">
                                        Cocomomo에 관하여
                                    </button>
                                </li>
                                <li className="w-full px-2 min-w-24 text-ellipsis">
                                    <button className="py-1 hover:bg-white/10 w-full border-b border-gray-800 text-start">
                                        업데이트 내역
                                    </button>
                                    <button className="py-1 hover:bg-white/10 w-full text-start">
                                        시스템 설정
                                    </button>
                                </li>
                                <li className="w-full px-2 min-w-24 text-ellipsis">
                                    <button
                                        className="w-full py-1 hover:bg-white/10 text-start"
                                        onClick={async () => {
                                            if (status === 'unauthenticated') {
                                                handleGithubLogin();
                                            } else {
                                                handleLogout();
                                            }
                                        }}>
                                        {status === 'unauthenticated' ? '로그인' : `${user?.name ? user?.name : ''} 로그아웃`}
                                    </button>
                                </li></>
                        }
                        {dropdownState === SUBMENU_STATE.HELP &&
                            <>
                                <li className="w-full px-2 min-w-24 text-ellipsis">
                                    <button className="py-1 hover:bg-white/10 w-full border-b border-gray-800 text-start">
                                        문제 신고하기
                                    </button>
                                </li>
                                <li className="w-full px-2 min-w-24 text-ellipsis">
                                    <button className="py-1 hover:bg-white/10 w-full text-start">
                                        Contact developer
                                    </button>
                                </li></>
                        }
                    </ul>
                </div>
            )}
        </>
    );
}