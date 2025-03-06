
import React from 'react';
import { useRecordsData } from './useRecordsData';
import MonthNavigator from './MonthNavigator';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const RecordsTable = () => {
  const {
    currentMonth,
    daysData,
    isLoading,
    editingDay,
    editData,
    goToPreviousMonth,
    goToNextMonth,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleAddNew,
    getRoasColorClass,
    getProfitColorClass
  } = useRecordsData();

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Tabela de Registros</h1>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium min-w-[140px] text-center">
              Carregando...
            </span>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card glass-card hover-glass-card overflow-hidden shadow-md p-8">
          <div className="flex justify-center">
            <div className="animate-pulse text-muted-foreground">Carregando registros...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Tabela de Registros</h1>
        <MonthNavigator
          currentMonth={currentMonth}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />
      </div>
      
      <div className="rounded-lg border bg-card glass-card hover-glass-card overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse records-table">
            <thead>
              <TableHeader />
            </thead>
            <tbody>
              {daysData.map((day) => (
                <TableRow
                  key={day.day}
                  day={day}
                  editingDay={editingDay}
                  editData={editData}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onAddNew={handleAddNew}
                  onInputChange={handleInputChange}
                  getRoasColorClass={getRoasColorClass}
                  getProfitColorClass={getProfitColorClass}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecordsTable;
