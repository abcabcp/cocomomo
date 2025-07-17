import React from 'react';

export const icons = {
    close: {
        title: 'close',
        asset: (
            <path
                d="M4 4L20 20M20 4L4 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
        attr: {
            viewBox: '0 0 24 24',
        },
    },
    add: {
        title: 'add',
        asset: (
            <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
        attr: {
            viewBox: '0 0 24 24',
        },
    },
    edit: {
        title: 'edit',
        asset: (
            <path
                d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
        attr: {
            viewBox: '0 0 24 24',
        },
    },
    search: {
        title: 'search',
        asset: (
            <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
        attr: {
            viewBox: '0 0 24 24',
        },
    },
    info: {
        title: 'info',
        asset: (
            <>
                <path
                    d="M8 8.00004C8 6.93917 8.42143 5.92175 9.17157 5.17161C9.92172 4.42147 10.9391 4.00004 12 4.00004C13.0609 4.00004 14.0783 4.42147 14.8284 5.17161C15.5786 5.92175 16 6.93917 16 8.00004C16 9.06091 15.5786 10.0783 14.8284 10.8285C14.0783 11.5786 13.0609 12 12 12V13M12 16H12.01"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </>
        ),
        attr: {
            viewBox: '0 0 24 24',
        },
    },
    reset: {
        title: 'reset',
        asset: (
            <path
                d="M21.1679 8C19.6247 4.46819 16.1006 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C16.1006 22 19.6247 19.5318 21.1679 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
        attr: {
            viewBox: '0 0 24 24',
        },
    },
    wifi: {
        title: 'wifi',
        asset: (
            <path
                d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
        attr: {
            viewBox: '0 0 24 24',
        },
    },
    wifiOff: {
        title: 'wifi off',
        asset: (
            <path
                d="M1 1L23 23M16.72 11.06C17.54 11.45 18.29 11.94 18.94 12.55M5 12.55C6.17 11.64 7.46 10.93 8.84 10.44M10.71 7.06C13.58 6.38 16.62 6.55 19.38 7.56M1.42 9C2.87 8.13 4.43 7.48 6.05 7.07M8.53 16.11C9.55 15.39 10.81 15 12.12 15C13.37 15 14.58 15.36 15.57 16.03M12 20H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
        attr: {
            viewBox: '0 0 24 24',
        },
    },
    video: {
        title: 'video',
        asset: (
            <path
                d="M23 7L16 12L23 17V7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
        attr: {
            viewBox: '0 0 24 24',
        },
    },
    blog: {
        title: 'blog',
        asset: (
            <>
                <rect x="2" y="2" width="20" height="20" rx="4" fill="#FF6F00" />
                <path
                    d="M17.5 11H16.5C15.67 11 15 10.33 15 9.5V9C15 6.24 12.76 4 10 4H7C4.24 4 2 6.24 2 9V14C2 16.76 4.24 19 7 19H13C15.76 19 18 16.76 18 14V11.5C18 11.22 17.78 11 17.5 11ZM9 10C9.55 10 10 9.55 10 9C10 8.45 9.55 8 9 8H7C6.45 8 6 8.45 6 9C6 9.55 6.45 10 7 10H9ZM14 15H7C6.45 15 6 14.55 6 14C6 13.45 6.45 13 7 13H14C14.55 13 15 13.45 15 14C15 14.55 14.55 15 14 15Z"
                    fill="#FFFFFF"
                />
            </>
        ),
        attr: {
            viewBox: '0 0 24 24',
        },
    },
    instagram: {
        title: 'instagram',
        asset: (
            <path
                d="M12 8.5C11.5055 8.5 11.0222 8.6466 10.6111 8.92127C10.2 9.19594 9.87542 9.58766 9.68077 10.0438C9.48613 10.5 9.43214 11.0028 9.52433 11.4877C9.61652 11.9727 9.85021 12.4181 10.1967 12.7678C10.5432 13.1176 10.9849 13.3538 11.4658 13.447C11.9468 13.5401 12.4452 13.4866 12.8981 13.2908C13.3509 13.095 13.7398 12.7675 14.0125 12.3525C14.2853 11.9374 14.4308 11.4494 14.4308 10.9498C14.4297 10.2794 14.1631 9.63707 13.6992 9.16888C13.2352 8.70068 12.6002 8.43164 11.9375 8.43164"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
        attr: {
            viewBox: '0 0 24 24',
        },
    },
    github: {
        title: 'github',
        asset: (
            <path
                d="M9 19C4 20.5 4 16.5 2 16M16 22V18.13C16.0375 17.6532 15.9731 17.1738 15.811 16.7238C15.6489 16.2738 15.3929 15.8634 15.06 15.52C18.2 15.17 21.5 13.98 21.5 8.52C21.4997 7.12383 20.9627 5.7812 20 4.77C20.4559 3.54851 20.4236 2.19835 19.91 0.999999C19.91 0.999999 18.73 0.649999 16 2.48C13.708 1.85882 11.292 1.85882 9 2.48C6.27 0.649999 5.09 0.999999 5.09 0.999999C4.57638 2.19835 4.54414 3.54851 5 4.77C4.03013 5.7887 3.49252 7.14346 3.5 8.55C3.5 13.97 6.8 15.16 9.94 15.55C9.611 15.89 9.35726 16.2954 9.19531 16.7399C9.03335 17.1844 8.96681 17.6581 9 18.13V22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        ),
        attr: {
            viewBox: '0 0 24 24',
        },
    },
} as const;

export type IconType = keyof typeof icons;
