
import React from 'react';
import { Edit, DollarSign, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DayActionsProps {
  isEditing: boolean;
  hasData: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAddNew: () => void;
}

const DayActions: React.FC<DayActionsProps> = ({
  isEditing,
  hasData,
  onEdit,
  onSave,
  onCancel,
  onAddNew
}) => {
  if (isEditing) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={onSave}
        >
          <Save className="h-4 w-4 mr-1" />
          Salvar
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={onCancel}
        >
          <X className="h-4 w-4 mr-1" />
          Cancelar
        </Button>
      </div>
    );
  }

  return hasData ? (
    <Button 
      size="sm" 
      variant="ghost" 
      onClick={onEdit}
      className="hover:bg-primary/10 hover:text-primary transition-colors"
    >
      <Edit className="h-4 w-4 mr-1" />
      Editar
    </Button>
  ) : (
    <Button 
      size="sm" 
      variant="ghost" 
      onClick={onAddNew}
      className="hover:bg-primary/10 hover:text-primary transition-colors"
    >
      <DollarSign className="h-4 w-4 mr-1" />
      Adicionar
    </Button>
  );
};

export default DayActions;
