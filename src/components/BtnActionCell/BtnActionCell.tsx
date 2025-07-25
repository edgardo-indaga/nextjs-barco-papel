import { CheckCircle, Cog, Eye, FilePenLine, Key, Trash2, XCircle } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useUserPermissionStore } from '@/store/useUserPermissionStore';

interface BtnActionCellProps {
    onAction: () => void;
    label: string;
    className?: string;
    permission?: string[];
}

interface BtnDeleteCellProps {
    onDelete: (id: string) => void;
    label: string;
    className?: string;
    permission?: string[];
    itemId: string;
}

interface BtnToggleStateCellProps {
    onToggle: (id: string) => void;
    label: string;
    className?: string;
    permission?: string[];
    itemId: string;
    currentState: number;
}

// Hook para verificar permisos fácilmente
const useHasPermission = (permissions?: string[]) => {
    const hasPermission = useUserPermissionStore((state) => state.hasPermission);
    if (!permissions || permissions.length === 0) return true;

    // Valida si el usuario tiene al menos uno de los permisos especificados
    return permissions.some((perm) => hasPermission(perm));
};

export function BtnViewCell({
    onAction,
    label,
    className,
    permission = ['Ver'],
}: BtnActionCellProps) {
    const permitted = useHasPermission(permission);
    if (!permitted) return null;

    return (
        <DropdownMenuItem
            onClick={onAction}
            className={`${className} ${!permitted ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!permitted}
        >
            <Eye className="mr-1 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}

export function BtnEditCell({
    onAction,
    label,
    className,
    permission = ['Editar'],
}: BtnActionCellProps) {
    const permitted = useHasPermission(permission);

    return (
        <DropdownMenuItem
            onClick={onAction}
            className={`${className} ${!permitted ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!permitted}
        >
            <FilePenLine className="mr-1 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}

export function BtnDeleteCell({
    onDelete,
    itemId,
    label,
    className,
    permission = ['Eliminar'],
}: BtnDeleteCellProps) {
    const permitted = useHasPermission(permission);

    const handleDelete = () => {
        onDelete(itemId);
    };

    return (
        <DropdownMenuItem
            onClick={handleDelete}
            className={`${className} ${!permitted ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!permitted}
        >
            <Trash2 className="mr-1 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}

export function BtnChangePasswordCell({
    onAction,
    label,
    className,
    permission = ['Editar'],
}: BtnActionCellProps) {
    const permitted = useHasPermission(permission);

    return (
        <DropdownMenuItem
            onClick={onAction}
            className={`${className} ${!permitted ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!permitted}
        >
            <Key className="mr-1 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}

export function BtnConfigCell({
    onAction,
    label,
    className,
    permission = ['Editar'],
}: BtnActionCellProps) {
    const permitted = useHasPermission(permission);

    return (
        <DropdownMenuItem
            onClick={onAction}
            className={`${className} ${!permitted ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!permitted}
        >
            <Cog className="mr-1 h-4 w-4" />
            {label}
        </DropdownMenuItem>
    );
}

export function BtnToggleStateCell({
    onToggle,
    label,
    className,
    permission = ['Editar'],
    itemId,
    currentState,
}: BtnToggleStateCellProps) {
    const permitted = useHasPermission(permission);
    if (!permitted) return null;

    const handleToggle = () => {
        onToggle(itemId);
    };

    const isActive = currentState === 1;
    const dynamicLabel = isActive ? `Desactivar ${label}` : `Activar ${label}`;
    const iconColor = isActive ? 'text-orange-600' : 'text-green-600';

    return (
        <DropdownMenuItem
            onClick={handleToggle}
            className={`${className} ${iconColor} ${!permitted ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!permitted}
        >
            {isActive ? (
                <XCircle className="mr-1 h-4 w-4" />
            ) : (
                <CheckCircle className="mr-1 h-4 w-4" />
            )}
            {dynamicLabel}
        </DropdownMenuItem>
    );
}
