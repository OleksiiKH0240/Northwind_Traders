import { serial, integer } from 'drizzle-orm/pg-core';
import { mySchema } from "../schemasConfig";
import employees from './employees';
import territories from './territories';


const employeeTerritories = mySchema.table('employee_territories', {
    employeeId: serial('employee_id').references(() => employees.employeeId),
    territoryId: integer('territory_id').references(() => territories.territoryId),
});

export default employeeTerritories;
