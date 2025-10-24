'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { items, itemsAlter } from '@/components/Home/Header/HeaderMenu';
import HeaderRedes from '@/components/Home/Header/HeaderRedes';

export default function AlterHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const logo: string = '/logo-header.svg';

    return (
        <header className="relative z-60">
            <div className="bg-negro md:bg-negro w-full">
                <div className="mx-auto max-w-[1100px] px-4 sm:px-6 md:max-w-[1100px]">
                    <nav className="flex h-[80px] items-center justify-between sm:h-[100px] md:h-[120px]">
                        <div>
                            <Link href="/">
                                <Image
                                    src={logo}
                                    alt="Logo Principal"
                                    width={339}
                                    height={147}
                                    sizes="(max-width: 768px) 120px, (max-width: 640px) 100px, 200px"
                                    className="w-[100px] sm:w-[120px] md:w-[200px]"
                                />
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <Link
                                href="/impresos"
                                className="text-blanco hover:text-fucsia mr-[10px] text-[15px] font-bold uppercase md:mr-[15px] md:text-[22px]"
                            >
                                Revista Impresa
                            </Link>
                            <button
                                type="button"
                                onClick={toggleMenu}
                                aria-label="Abrir menú"
                                className="bg-negro border-blanco hover:border-fucsia rounded-[50%] border-[1px] p-[4px] drop-shadow-md transition-colors duration-300 sm:p-[5px]"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    data-slot="icon"
                                    className="group-hover:stroke-fucsia hover:stroke-fucsia h-7 w-7 cursor-pointer text-white transition-colors duration-300 sm:h-8 sm:w-8 md:h-9 md:w-9"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
                                    />
                                </svg>
                            </button>
                        </div>
                    </nav>
                </div>
            </div>

            <div
                className={
                    menuOpen
                        ? 'menu-mobile'
                        : 'fixed top-0 left-[-100%] h-screen p-6 duration-500 ease-in-out sm:p-8 md:p-10'
                }
            >
                <div className="flex w-full items-center justify-end">
                    <button
                        type="button"
                        onClick={toggleMenu}
                        aria-label="Cerrar menú"
                        className="bg-negro hover:border-fucsia rounded-[50%] border-[1px] border-white p-[4px] transition-colors duration-300 sm:p-[5px]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="white"
                            data-slot="icon"
                            className="group-hover:stroke-fucsia hover:stroke-fucsia h-7 w-7 cursor-pointer transition-colors duration-300 sm:h-8 sm:w-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="container mx-auto flex h-[85vh] max-w-[1100px] flex-col items-center justify-center px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="mb-8 sm:mb-0">
                        <ul>
                            {items.map((item) => (
                                <li
                                    key={item.id}
                                    className="my-[14px] text-center sm:my-[18px] sm:text-left"
                                >
                                    <Link
                                        href={item.link}
                                        passHref
                                        onClick={() => setMenuOpen(false)}
                                        className="font-basic-sans text-blanco hover:text-fucsia text-[18px] uppercase transition-colors sm:text-[20px]"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col items-center sm:items-end">
                        <ul className="mb-[30px] sm:mb-[50px]">
                            {itemsAlter.map((item) => (
                                <li
                                    key={item.id}
                                    className="my-[14px] text-center sm:my-[18px] sm:flex sm:justify-end"
                                >
                                    <Link
                                        href={item.link}
                                        passHref
                                        onClick={() => setMenuOpen(false)}
                                        className="font-basic-sans text-blanco hover:text-fucsia text-[18px] uppercase transition-colors sm:text-[20px]"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mb-4 text-center sm:mb-0 sm:text-right">
                            <a
                                href="mailto:catabilleke@gmail.com"
                                className="text-fucsia font-basic-sans text-[16px] transition-colors hover:opacity-80 sm:text-[18px] md:text-[20px]"
                                target="_blank"
                                rel="noreferrer"
                            >
                                catabilleke@gmail.com
                            </a>
                        </div>
                        <div className="mb-4 text-center sm:mb-0 sm:text-right">
                            <a
                                href="mailto:joja@agenciavolcano.cl"
                                className="text-fucsia font-basic-sans text-[16px] transition-colors hover:opacity-80 sm:text-[18px] md:text-[20px]"
                                target="_blank"
                                rel="noreferrer"
                            >
                                joja@agenciavolcano.cl
                            </a>
                        </div>
                        <HeaderRedes />
                    </div>
                </div>
            </div>
        </header>
    );
}
