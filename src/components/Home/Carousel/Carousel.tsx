'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getAllSponsorsForCarousel } from '@/actions/Administration/Sponsors/queries';
import type { SponsorsCarouselInterface } from '@/types/Administration/Sponsors/SponsorsCarouselInterface';

export default function CarouselSponsors() {
    const [originalSponsors, setOriginalSponsors] = useState<SponsorsCarouselInterface[]>([]);
    const [displaySponsors, setDisplaySponsors] = useState<SponsorsCarouselInterface[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const data = await getAllSponsorsForCarousel();
                if (data && data.length > 0) {
                    setOriginalSponsors(data);

                    const minItems = isMobile ? 2 : 4;
                    if (data.length > minItems) {
                        setDisplaySponsors([...data, ...data, ...data]);
                    } else {
                        setDisplaySponsors(data);
                    }
                }
            } catch (error) {
                console.error('Error loading sponsors:', error);
            }
        };

        if (mounted) {
            fetchSponsors();
        }
    }, [isMobile, mounted]);

    useEffect(() => {
        const minItems = isMobile ? 2 : 4;

        if (originalSponsors.length === 0 || originalSponsors.length <= minItems) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                const itemWidth = isMobile ? 50 : 25;
                if (nextIndex >= displaySponsors.length - minItems) {
                    return 0;
                }
                return nextIndex;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [originalSponsors.length, displaySponsors.length, isMobile]);

    if (!mounted) {
        return (
            <div className="w-full overflow-hidden py-4 sm:py-6 md:py-8">
                <div className="flex justify-center">
                    <div className="w-full max-w-sm sm:max-w-xl md:max-w-2xl">
                        <div className="flex justify-center">
                            <div className="w-1/2 flex-shrink-0 px-2 sm:px-3 md:px-4">
                                <div className="h-16 w-full animate-pulse rounded bg-gray-200 sm:h-20 md:h-24"></div>
                            </div>
                            <div className="w-1/2 flex-shrink-0 px-2 sm:px-3 md:px-4">
                                <div className="h-16 w-full animate-pulse rounded bg-gray-200 sm:h-20 md:h-24"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (originalSponsors.length === 0 && !isLoading) {
        return null;
    }

    const minItems = isMobile ? 2 : 4;
    const shouldAnimate = originalSponsors.length > minItems;
    const itemWidth = isMobile ? 50 : 25;

    return (
        <div className="w-full overflow-hidden py-4 sm:py-6 md:py-8">
            <div className="flex justify-center">
                <div
                    className={`w-full ${shouldAnimate ? 'max-w-sm overflow-hidden sm:max-w-2xl md:max-w-4xl' : 'max-w-sm sm:max-w-xl md:max-w-2xl'}`}
                >
                    <div
                        className={`flex ${shouldAnimate ? 'transition-transform duration-1000 ease-in-out' : 'justify-center'}`}
                        style={{
                            transform: shouldAnimate
                                ? `translateX(-${currentIndex * itemWidth}%)`
                                : 'none',
                        }}
                    >
                        {displaySponsors.map((sponsor, index) => (
                            <div
                                key={`${sponsor.id}-${index}`}
                                className={`flex-shrink-0 px-2 sm:px-3 md:px-4 ${
                                    shouldAnimate
                                        ? isMobile
                                            ? 'w-1/2'
                                            : 'w-1/4'
                                        : isMobile
                                          ? 'w-1/2'
                                          : 'w-1/4'
                                }`}
                            >
                                {sponsor.link ? (
                                    <a
                                        href={sponsor.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block h-16 w-full sm:h-20 md:h-24"
                                    >
                                        {sponsor.image ? (
                                            <Image
                                                src={sponsor.image}
                                                alt={sponsor.name}
                                                width={200}
                                                height={96}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <span className="font-basic-sans text-xs text-gray-700 sm:text-sm">
                                                    {sponsor.name}
                                                </span>
                                            </div>
                                        )}
                                    </a>
                                ) : (
                                    <div className="h-16 w-full sm:h-20 md:h-24">
                                        {sponsor.image ? (
                                            <Image
                                                src={sponsor.image}
                                                alt={sponsor.name}
                                                width={200}
                                                height={96}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <span className="font-basic-sans text-xs text-gray-700 sm:text-sm">
                                                    {sponsor.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
