import { Node } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        iframe: {
            setIframe: (options: { src: string; title?: string }) => ReturnType;
        };
    }
}

export const IframeExtension = Node.create({
    name: 'iframe',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            title: {
                default: 'Documento embebido',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'iframe[src]:not([src*="youtube"]):not([src*="youtu.be"]):not([src*="vimeo"])',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'iframe',
            {
                ...HTMLAttributes,
                class: 'w-full rounded border',
                style: 'height:600px',
                allowfullscreen: 'true',
                loading: 'lazy',
            },
        ];
    },

    addCommands() {
        return {
            setIframe:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options,
                    });
                },
        };
    },
});
