import { db, POSTGRES_DB, PRODUCT_VERSION } from "database/databaseConnection";
import employees from 'database/schemas/employees';
import { ModelTemplateReturnType, EmployeeReturnType, EmployeesReturnType } from "database/RepReturnTypes";
import { eq, sql, aliasedTable } from "drizzle-orm";


class EmployeeRep {
    dbClient

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    allEmployees = async (): Promise<ModelTemplateReturnType<EmployeesReturnType>> => {
        const start = Date.now();
        const result = await this.dbClient.select({
            employeeId: employees.employeeId,
            Name: sql<string>`concat(${employees.firstName}, ' ', ${employees.lastName})`,
            Title: employees.title,
            City: employees.city,
            Country: employees.country,
            Phone: employees.homePhone
        }).from(employees);
        const end = Date.now();

        const sqlQuery = `
        select employee_id                 as "employeeId",
        concat(first_name, ' ', last_name) as "Name",
        title                              as "Title",
        city                               as "City",
        country                            as "Country",
        home_phone                         as "Phone"
        from ${POSTGRES_DB}.employees;`;

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }

    employeeById = async (employeeId: number): Promise<ModelTemplateReturnType<EmployeeReturnType>> => {
        const start = Date.now();
        const e = aliasedTable(employees, "e");
        const result = await this.dbClient.select({
            employeeId: employees.employeeId,
            Name: sql<string>`concat(${employees.firstName}, ' ', ${employees.lastName})`,
            Title: employees.title,
            "Title Of Courtesy": employees.titleOfCourtesy,
            "Birth Date": employees.birthDate,
            "Hire Date": employees.hireDate,
            Address: employees.address,
            City: employees.city,
            "Postal Code": employees.postalCode,
            "Country": employees.country,
            "Home Phone": employees.homePhone,
            Extension: employees.extension,
            Notes: employees.notes,
            "Reports To": sql<string>`concat(${e.firstName}, ' ', ${e.lastName})`,
            "reportsTo": employees.reportsTo
        }).from(employees).
            leftJoin(e, eq(employees.reportsTo, e.employeeId)).
            where(eq(employees.employeeId, employeeId));
        const end = Date.now();

        const sqlQuery = `
        select employee_id                     as "employeeId",
        concat(first_name, ' ', last_name)     as "Name",
        title                                  as "Title",
        title_of_courtesy                      as "Title Of Courtesy",
        birth_date                             as "Birth Date",
        hire_date                              as "Hire Date",
        address                                as "Address",
        city                                   as "City",
        postal_code                            as "Postal Code",
        country                                as "Country",
        home_phone                             as "Phone",
        extension                              as "Extension",
        notes                                  as "Notes",
        concat(e.first_name, ' ', e.last_name) as "Reports To",
        employees.reports_to                   as "reportsTo"
        from ${POSTGRES_DB}.employees
          left join ${POSTGRES_DB}.employees e on e.employee_id = employees.reports_to from ${POSTGRES_DB}.employees
        where employee_id=${employeeId};`;

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result[0] };
    }
}

export default new EmployeeRep();
