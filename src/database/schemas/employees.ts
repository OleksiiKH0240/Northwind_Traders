import { serial, text, integer, date } from 'drizzle-orm/pg-core';
import { mySchema } from "../schemasConfig";


const employees = mySchema.table('employees', {
    employeeId: serial('employee_id').primaryKey(),
    lastName: text('last_name'),
    firstName: text('first_name'),
    title: text('title'),
    titleOfCourtesy: text('title_of_courtesy'),
    birthDate: date('birth_date'),
    hireDate: date('hire_date'),
    address: text('address'),
    city: text('city'),
    region: text('region'),
    postalCode: text('postal_code'),
    country: text('country'),
    homePhone: text('home_phone'),
    extension: integer('extension'),
    notes: text('notes'),
    reportsTo: integer('reports_to')
});

export default employees;
