'use client';

import Link from 'next/link';
import {useState, useTransition} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {recoverUserPassword} from '@/lib/auth/password/passwordService';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('error');
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        // Validación básica del cliente
        if (!email.trim()) {
            setMessage('Por favor, ingresa tu dirección de email.');
            setMessageType('error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Por favor, ingresa un email con formato válido.');
            setMessageType('error');
            return;
        }

        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append('email', email.trim().toLowerCase());

                const result = await recoverUserPassword(formData);

                if (result.success) {
                    setMessage(result.message);
                    setMessageType('success');
                    setEmail(''); // Limpiar form solo si fue exitoso
                } else {
                    setMessage(result.message);
                    setMessageType('error');
                }
            } catch (error) {
                console.error('Error en recuperación:', error);
                setMessage('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
                setMessageType('error');
            }
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-inter text-[25px] leading-[25px] font-normal">
                        Restaurar su cuenta.
                    </CardTitle>
                    <CardDescription className="font-inter text-[14px] leading-[14px] font-normal">
                        Ingresa su correo electrónico para restaurar su cuenta.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="m@example.com"
                                    disabled={isPending}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full cursor-pointer"
                            >
                                {isPending ? 'Procesando...' : 'Recuperar Contraseña'}
                            </Button>

                            {message && (
                                <div
                                    className={`rounded-md p-3 text-center text-[14px] ${
                                        messageType === 'success'
                                            ? 'border border-green-200 bg-green-50 text-green-800'
                                            : 'border border-red-200 bg-red-50 text-red-800'
                                    }`}
                                >
                                    {messageType === 'success' && (
                                        <div className="mb-2">
                                            ✅ <strong>¡Email enviado!</strong>
                                        </div>
                                    )}
                                    {messageType === 'error' && (
                                        <div className="mb-2">
                                            ❌ <strong>Error</strong>
                                        </div>
                                    )}
                                    <p className="text-[13px] leading-relaxed">{message}</p>
                                    {messageType === 'success' && (
                                        <p className="mt-2 text-[12px] opacity-75">
                                            Revisa tu bandeja de entrada y carpeta de spam
                                        </p>
                                    )}
                                </div>
                            )}

                            <div
                                className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                <span className="bg-background text-muted-foreground relative z-10 px-2">
                                    ¿Ya sos cliente?{' '}
                                    <Link
                                        href="/login"
                                        className="ml-[5px] underline underline-offset-4"
                                    >
                                        Ingresar
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            {/*<div className="text-muted-foreground hover:[&_a]:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
                By clicking continue, you agree to our <a href="/terms">Terms of Service</a> and{' '}
                <a href="/politics">Privacy Policy</a>.
            </div>*/}
        </div>
    );
}
