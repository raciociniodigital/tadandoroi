
import { getAllRecords, saveRecord } from '@/services/trackingService';
import { format, getMonth, getYear, parseISO } from 'date-fns';

export interface DailyRecord {
  date: Date;
  investment: number;
  sales: number;
  revenue: number;
}

export interface DayData {
  day: number;
  investment: number | null;
  sales: number | null;
  revenue: number | null;
  costPerSale: number | null;
  profit: number | null;
  roas: number | null;
}

export const loadRecords = (): DailyRecord[] => {
  const storedRecords = getAllRecords();
  const loadedRecords: DailyRecord[] = [];
  
  Object.entries(storedRecords).forEach(([dateStr, data]) => {
    loadedRecords.push({
      date: parseISO(dateStr),
      investment: data.investment,
      sales: data.sales,
      revenue: data.revenue
    });
  });
  
  return loadedRecords;
};

export const filterRecordsByMonth = (records: DailyRecord[], currentMonth: Date): DailyRecord[] => {
  return records.filter((record) => 
    getMonth(record.date) === getMonth(currentMonth) && 
    getYear(record.date) === getYear(currentMonth)
  );
};

export const calculateDerivedValues = (record: {
  investment: number | null;
  sales: number | null;
  revenue: number | null;
}) => {
  if (!record.investment || !record.sales || !record.revenue) {
    return {
      costPerSale: null,
      profit: null,
      roas: null
    };
  }
  
  const profit = record.revenue - record.investment;
  const costPerSale = record.sales > 0 ? record.investment / record.sales : 0;
  const roas = record.investment > 0 ? record.revenue / record.investment : 0;
  
  return {
    profit,
    costPerSale,
    roas
  };
};

export const saveDailyRecord = (
  day: number, 
  currentMonth: Date, 
  data: { investment: string; sales: string; revenue: string }
) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const dateToEdit = new Date(year, month, day);
  const dateKey = format(dateToEdit, 'yyyy-MM-dd');
  
  return saveRecord(dateKey, {
    investment: parseFloat(data.investment) || 0,
    sales: parseInt(data.sales) || 0,
    revenue: parseFloat(data.revenue) || 0
  });
};
