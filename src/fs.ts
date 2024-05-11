import fs from "node:fs"
import path from "node:path"
import chalk from "chalk";
import {DateTime} from "luxon";

export default() => {
    const workDir = process.cwd();
    const dataDir = "data";
    const dataFull = path.join(workDir, dataDir);

    try {
        const entities = fs.readdirSync(dataFull, {withFileTypes:true});
        for (const entity of entities) {
            openDir(entity)
        }
    } catch (error) {
        console.error(error);
    }
}

const openDir = (entity:any, prof=0) => {
    
    const indent = '| '.repeat(prof);
    if(entity.isDirectory()){
        console.log(chalk.green(indent + "|--", entity.name));

        const dataFull = path.join(entity.path, entity.name);
        const entities = fs.readdirSync(dataFull, {withFileTypes:true});

        for (const entity of entities) {
            openDir(entity, prof+1)
        }
    } else {
        console.log(indent, entity.name, lastMod(path.join(entity.path, entity.name)));
        
    }
}

const lastMod = (entityPath: string) => {
    const stats = fs.statSync(entityPath); 
    const lastModifiedTime = DateTime.fromJSDate(stats.mtime); 
    const now = DateTime.now(); 
    
    const diff = now.diff(lastModifiedTime, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']).toObject();
    
    let formattedDiff = '';
    if (diff.years) formattedDiff += `${diff.years} anni `;
    if (diff.months) formattedDiff += `${diff.months} mesi `;
    if (diff.days) formattedDiff += `${diff.days} giorni `;
    if (diff.hours) formattedDiff += `${diff.hours} ore `;
    if (diff.minutes) formattedDiff += `${diff.minutes} minuti `;

    return formattedDiff.trim() || 'just now';
};
 