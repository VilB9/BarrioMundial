import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

// Utilizando la url de cliente
const supabaseUrl = 'https://ssvilevfzsqybgerjncn.supabase.co';
// Reemplaza esto si estÃ¡ mal tu anon key
const supabaseKey = 'sb_publishable_RcHYFCuAMA2luw5kR4jXZw_62CKTq2z';

const supabase = createClient(supabaseUrl, supabaseKey);

const results = [];
const csvFilePath = path.resolve('../sheet_data_utf8.csv');

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => {
    // Filtrar aquellas filas vacÃ­as invalidas (si el excel tenÃ­a basura al final)
    if (data['Nombre de la actividad/stand'] && data['Nombre de la actividad/stand'].trim() !== '') {
      results.push({
        name: data['Nombre de la actividad/stand'] || '',
        description: data['DescripciÃ³n'] || data['Descripción'] || 'Sin descripciÃ³n',
        category: data['CategorÃ­a'] || data['Categoría'] || 'General',
        speaker: data['Speaker/Responsable'] || 'No definido',
        start_time: data['Hora inicio'] || '',
        end_time: data['Hora fin'] || '',
        stage: data['Lugar / Stage'] || 'Main Stage'
      });
    }
  })
  .on('end', async () => {
    console.log(`Leidos ${results.length} stands. Insertando en Supabase en lotes...`);
    
    // Al ser tantos, subimos por lotes de 100
    const chunkSize = 100;
    for (let i = 0; i < results.length; i += chunkSize) {
      const chunk = results.slice(i, i + chunkSize);
      
      const { data, error } = await supabase
        .from('stands')
        .insert(chunk);

      if (error) {
        console.error('Error insertando lote:', error);
      } else {
        console.log(`Insertado lote: ${i} al ${i + chunk.length}`);
      }
    }
    console.log('Migracion Finalizada.');
  });
