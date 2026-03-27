import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BtnSubmitProps {
    label?: string;
    isLoading?: boolean;
}

export default function BtnSubmit({ label = 'Crear', isLoading = false }: BtnSubmitProps) {
    return (
        <Button type="submit" className="custom-button" disabled={isLoading}>
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                </>
            ) : (
                label
            )}
        </Button>
    );
}
