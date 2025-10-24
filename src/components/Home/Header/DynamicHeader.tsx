'use client';

import { usePathname } from 'next/navigation';
import AlterHeader from '@/components/Home/Header/AlterHeader';
import HeaderWeb from '@/components/Home/Header/Header';

export default function DynamicHeader() {
    const pathname = usePathname();

    return pathname === '/' ? <HeaderWeb /> : <AlterHeader />;
}
