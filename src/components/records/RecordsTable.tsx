
import React from 'react';
import { useRecordsTable } from './hooks/useRecordsTable';
import MonthSelector from './components/MonthSelector';
import TableHeader from './components/TableHeader';
import RecordRow from './components/RecordRow';

const RecordsTable = () => {
  const {
    daysData,
    editingDay,
    editData,
    formatMonth,
    goToPreviousMonth,
    goToNextMonth,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleAddNew
  } = useRecordsTable();

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Tabela de Registros</h1>
        <MonthSelector 
          formattedMonth={formatMonth()}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
        />
      </div>
      
      <div className="rounded-lg border bg-card glass-card hover-glass-card overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse records-table">
            <thead>
              <TableHeader />
            </thead>
            <tbody>
              {daysData.map((dayData) => (
                <RecordRow
                  key={dayData.day}
                  dayData={dayData}
                  editingDay={editingDay}
                  editData={editData}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onInputChange={handleInputChange}
                  onAddNew={handleAddNew}
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
