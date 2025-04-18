import db from '../../common/Services/indexedDB';



export const syncIndexData = async (tableName: string, newData: any[], keyField: string = 'id') => {
    try {
      const table =  db.table(tableName);
      if (!table) {
        throw new Error(`Table "${tableName}" does not exist in the database.`);
      }
  
      // Step 1: Retrieve all existing keys from the table
      const existingKeys = await table.toCollection().keys();
  
      // Step 2: Get keys from the new data
      const newKeys = newData.map((item) => item[keyField]);
  
      // Step 3: Identify keys to delete
      const keysToDelete = existingKeys.filter((key:any) => !newKeys.includes(key));
      if (keysToDelete.length > 0) {
        await table.bulkDelete(keysToDelete);
      }
      await table.bulkPut(newData);
    } catch (error) {
      console.error(`Error syncing data with table "${tableName}":`, error);
    }
  };
  

  