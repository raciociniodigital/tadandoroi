
// Uma simples implementação de serviço baseado em localStorage
// Em uma aplicação real, você poderia substituir isso por chamadas a uma API

// Tipo para os dados de tracking
export interface TrackingData {
  investment: number;
  sales: number;
  revenue: number;
  date: string; // formato ISO string 'YYYY-MM-DD'
}

// Chave para os dados no localStorage
const STORAGE_KEY = 'tadandoroi_tracking_data';

// Carregar todos os registros
export const getAllRecords = (): Record<string, TrackingData> => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return {};
  }
};

// Obter um registro específico por data
export const getRecordByDate = (dateStr: string): TrackingData | null => {
  const records = getAllRecords();
  return records[dateStr] || null;
};

// Salvar um novo registro ou atualizar um existente
export const saveRecord = (dateStr: string, data: Omit<TrackingData, 'date'>): TrackingData => {
  const records = getAllRecords();
  
  const newRecord: TrackingData = {
    ...data,
    date: dateStr
  };
  
  records[dateStr] = newRecord;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  
  return newRecord;
};

// Excluir um registro
export const deleteRecord = (dateStr: string): boolean => {
  const records = getAllRecords();
  
  if (!records[dateStr]) return false;
  
  delete records[dateStr];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  
  return true;
};

// Limpar todos os dados
export const clearAllRecords = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
