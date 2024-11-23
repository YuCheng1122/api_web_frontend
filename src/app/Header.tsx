'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuthContext } from '@/features/auth/contexts/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/app/ui/dropdown-menu";

// 定義導航項目類型
interface NavItem {
    href: string;
    label: string;
    adminOnly?: boolean;
}

// 導航項目列表
const navItems: NavItem[] = [
    { href: '/graph', label: '威脅獵捕圖' },
    { href: '/agent', label: '代理資訊' },
    { href: '/chatbot', label: 'SenseX 聊天機器人' },
    { href: '/visionboard', label: '視覺化儀表板' },
    { href: '/managecenter', label: '管理中心', adminOnly: true },
    { href: '/ics', label: 'ICS' },
    { href: '/ndr', label: 'NDR' },
    { href: '/admin/script', label: '軟體下載' }
]

// 導航項目組件 - 行動版
const NavMenuItem = ({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) => (
    <DropdownMenuItem>
        <Link
            href={href}
            className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838] whitespace-nowrap'
            onClick={onClick}
        >
            {label}
        </Link>
    </DropdownMenuItem>
)

// 導航項目組件 - 桌面版
const DesktopNavItem = ({ href, label }: { href: string; label: string }) => (
    <Link
        href={href}
        className='nav-item text-lg font-bold px-4 py-2 text-[#423838] whitespace-nowrap'
    >
        {label}
    </Link>
)

const Header = () => {
    const { isLogin, username, updateLoginState, isadmin } = useAuthContext()
    const router = useRouter()

    const logout = () => {
        updateLoginState(false, '', null)
        router.push('/')
    }

    useEffect(() => {
        // 您可以在這裡添加與 isadmin 相關的副作用
    }, [isadmin])

    // 過濾導航項目
    const filteredNavItems = navItems.filter(item => !item.adminOnly || isadmin)

    return (
        <div className='flex items-center justify-between py-4 header-animation'>
            {/* 左側：標題 */}
            <div className="text-3xl font-bold text-black whitespace-nowrap">
                <Link href={'/public'} className='nav-item'>
                    AVOCADO
                </Link>
            </div>

            {/* 中間：導航選單（桌面版） */}
            {isLogin && username && (
                <div className='hidden lg:flex items-center space-x-2 overflow-x-auto scrollbar-hide'>
                    {filteredNavItems.map((item) => (
                        <DesktopNavItem key={item.href} href={item.href} label={item.label} />
                    ))}
                </div>
            )}

            {/* 手機版選單 */}
            <div className='lg:hidden'>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>選單</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <NavMenuItem href="/" label="首頁" />
                        {isLogin && username && (
                            <>
                                {filteredNavItems.map((item) => (
                                    <NavMenuItem key={item.href} href={item.href} label={item.label} />
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <div
                                        className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838] cursor-pointer'
                                        onClick={logout}
                                    >
                                        登出
                                    </div>
                                </DropdownMenuItem>
                            </>
                        )}
                        {!isLogin && (
                            <>
                                <NavMenuItem href="/admin/signup" label="註冊" />
                                <NavMenuItem href="/admin/login" label="登入" />
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* 右側：用戶賬戶（大螢幕） */}
            <div className='hidden lg:block'>
                <div className='flex items-center space-x-4 whitespace-nowrap'>
                    {!isLogin && (
                        <Link
                            href={'/admin/signup'}
                            className='nav-item text-lg font-bold px-4 py-2 text-[#423838]'
                        >
                            註冊
                        </Link>
                    )}

                    <div className='flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200'>
                        <Image
                            src={'/user.png'}
                            height={30}
                            width={30}
                            alt='使用者圖片'
                            className='p-[1px]'
                        />

                        {isLogin && username ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div className='flex items-center space-x-2'>
                                        <div className='text-xl font-semibold cursor-pointer text-[#423838]' title='點擊登出'>
                                            {username}
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>帳戶選單</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <div
                                            className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838] cursor-pointer'
                                            onClick={logout}
                                        >
                                            登出
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href={'/admin/login'}
                                className='nav-item text-xl font-semibold text-[#423838]'
                            >
                                登入
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
