'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/actions/Administration/Newsletter/mutations';

export default function Suscribite() {
    return (
        <div className="relative z-50 flex w-full justify-center py-8 sm:py-12 md:w-[700px] md:py-16">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
                <iframe
                    src="https://barcodepapel.substack.com/embed"
                    width="480"
                    height="320"
                    style={{
                        border: '1px solid #EEE',
                        background: 'transparent',
                    }}
                    frameBorder="0"
                    scrolling="no"
                    className="h-auto w-[350px] md:h-auto md:w-full"
                ></iframe>
            </div>
        </div>
    );
}
