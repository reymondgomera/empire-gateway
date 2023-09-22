import { ArgumentsHost, Catch, HttpStatus } from "@nestjs/common"
import { BaseExceptionFilter } from "@nestjs/core"
import { Prisma } from "@prisma/client"
import { Response } from "express"
import { Request } from "express"

const errorMappings: Record<string, { status: number; message: string }> = {
  P2000: { status: HttpStatus.BAD_REQUEST, message: "Input Data is too long" },
  P2001: { status: HttpStatus.NO_CONTENT, message: "Record does not exist" },
  P2002: { status: HttpStatus.CONFLICT, message: "Reference Data already exists" },
  P2003: { status: HttpStatus.BAD_REQUEST, message: "Foreign key constraint failed on the database" },
  P2004: { status: HttpStatus.BAD_REQUEST, message: "A constraint failed on the database" },
  P2005: { status: HttpStatus.BAD_REQUEST, message: "The value stored in the database for the field is invalid" },
  P2006: { status: HttpStatus.BAD_REQUEST, message: "The provided value for the field is not valid" },
  P2007: { status: HttpStatus.BAD_REQUEST, message: "Data Validation Error" },
  P2008: { status: HttpStatus.BAD_REQUEST, message: "Failed to Parse Query" },
  P2009: { status: HttpStatus.BAD_REQUEST, message: "Input Error" },
  P2010: { status: HttpStatus.BAD_REQUEST, message: "Raw Query Failed" },
  P2011: { status: HttpStatus.BAD_REQUEST, message: "Null Constraint Violation" },
  P2012: { status: HttpStatus.BAD_REQUEST, message: "Missing Required Value" },
  P2013: { status: HttpStatus.BAD_REQUEST, message: "Missing Required Argument" },
  P2014: { status: HttpStatus.BAD_REQUEST, message: "Required Relation Violation" },
  P2015: { status: HttpStatus.BAD_REQUEST, message: "Related Record Not Found" },
  P2016: { status: HttpStatus.BAD_REQUEST, message: "Query Interpretation Error" },
  P2017: { status: HttpStatus.BAD_REQUEST, message: "Records for Relation Not Connected" },
  P2018: { status: HttpStatus.BAD_REQUEST, message: "Required Connected Records Not Found" },
  P2019: { status: HttpStatus.BAD_REQUEST, message: "Input Error" },
  P2020: { status: HttpStatus.BAD_REQUEST, message: "Value Out of Range" },
  P2021: { status: HttpStatus.BAD_REQUEST, message: "Table Does Not Exist" },
  P2022: { status: HttpStatus.BAD_REQUEST, message: "Column Does Not Exist" },
  P2023: { status: HttpStatus.BAD_REQUEST, message: "Inconsistent Column Data" },
  P2024: { status: HttpStatus.BAD_REQUEST, message: "Connection Timed Out" },
  P2025: { status: HttpStatus.BAD_REQUEST, message: "Operation Depends on Missing Records" },
  P2026: { status: HttpStatus.BAD_REQUEST, message: "Unsupported Feature" },
  P2027: { status: HttpStatus.BAD_REQUEST, message: "Multiple Database Errors" },
  P2028: { status: HttpStatus.BAD_REQUEST, message: "Transaction API Error" },
  P2030: { status: HttpStatus.BAD_REQUEST, message: "Fulltext Index Not Found" },
  P2031: { status: HttpStatus.BAD_REQUEST, message: "MongoDB Replica Set Required" },
  P2033: { status: HttpStatus.BAD_REQUEST, message: "Number Exceeds 64-bit Integer" },
  P2034: { status: HttpStatus.BAD_REQUEST, message: "Transaction Failed Due to Conflict" },
};


@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorCode = exception.code;
    const errorMapping = errorMappings[errorCode];

    if (errorMapping) {
      const { status, message } = errorMapping;
      response.status(status).json({
        statusCode: status,
        message: `${message} at path: ${
          request.originalUrl.split("/")[request.originalUrl.split("/").length - 1]
        }, Error Code: ${errorCode.replace("P", "BG")}`,
      });
    } else {
      super.catch(exception, host); // Handle unknown error codes
    }
  }
}