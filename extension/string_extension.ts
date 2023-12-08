import { DayOfWeekEnum, PwaCurrentPageEnum } from '@/model/enumModel';
import { Decimal } from '@prisma/client/runtime';
import crypto from 'crypto';

export const EncryptString = (text: string, secretKey: string, iv_key?: string) => {

    const ivKeyBuffer = iv_key ? Buffer.from(iv_key, 'hex') : crypto.randomBytes(16);
    const secretKeyBuffer = Buffer.from(secretKey, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKeyBuffer, ivKeyBuffer);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return [ encrypted, ivKeyBuffer.toString('hex') ]
}
  
export const DecryptString = (encryptedText: string, secretKey: string, iv_key: string) => {

    const ivKeyBuffer = Buffer.from(iv_key, 'hex');
    const secretKeyBuffer = Buffer.from(secretKey, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKeyBuffer, ivKeyBuffer);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

export const IsStringValid = (value: string | null | undefined): boolean => {
    
    if (value === null || value === undefined) {
      return false; // Check for null or undefined
    }
  
    if (value.trim().length === 0) {
      return false; // Check for empty string or whitespace
    }
  
    return true; // String is valid
  }

export const IsStringValidEmpty = (value: string | null | undefined): string => {
    
    if (value === null || value === undefined) {
      return ""; // Check for null or undefined
    }
  
    if (value.trim().length === 0) {
      return ""; // Check for empty string or whitespace
    }
  
    return value; // String is valid
}

export const DecimalToNumber = (decimal: Decimal | null) => {

    // change to string and cast to number with "+"
    return decimal ? +(decimal.toString()) : 0;
}

export const DisplayCurrentPageName = (currentPage: PwaCurrentPageEnum) => {

    switch (currentPage) {
        case PwaCurrentPageEnum.ReminderList:
            return "Reminder Card";
        case PwaCurrentPageEnum.MapView:
            return "Map View";
        case PwaCurrentPageEnum.EvBattery:
            return "Ev Battery";
        case PwaCurrentPageEnum.AddList:
            return "Add Card";
        case PwaCurrentPageEnum.UpdateList:
            return "Update Card ";
        default:
            return PwaCurrentPageEnum[currentPage];
    }
}

export const DisplayStringDateToUpdateForm = (stringDate?: string | null) => {

    if (stringDate) {

        const [ date, month, year ] = stringDate.split(" ")[1].split("/");

        if (date && month && year) {
    
            return `${year}-${month}-${date}`;
        }
    }

    return null;
}

// use in place card
export const StringDateToDisplayDate = (date: string | Date | null, includeTime = false) => {

    if (date == null) {

        return "";
    }

    // 24 is number of char in default prisma Date object
    if (typeof date == "string" && date.length == 24) {
        
        const dateObject = new Date(date);

        const day = ConvertToDisplayStringOfNumber(dateObject.getDate());
        const month = ConvertToDisplayStringOfNumber(dateObject.getMonth() + 1); // +1 because 1st month is 0 "idk why"
        const year = dateObject.getFullYear();  
        const dayOfweekName = DayOfWeekEnum[dateObject.getDay()];
    
        let result = `${dayOfweekName} ${day}/${month}/${year}`;

        if (includeTime) {

            const hour = ConvertToDisplayStringOfNumber(dateObject.getHours());
            const minute = ConvertToDisplayStringOfNumber(dateObject.getMinutes());

            result += ` - ${hour}:${minute}`;
        }

        return result;
    }

    // return same string value - (for case that date is already correct string format)
    return date;  
}

// use in cache clearing setting page
export const DateTimeToDisplayString = (dateTime: Date) => {

    const dayOfweekName = DayOfWeekEnum[dateTime.getDay()];
    return `${dayOfweekName} ${dateTime.toLocaleDateString('en-GB')}`;
} 

export const GetAllEnumString = (enumObject: { [s: number]: string }) => {
    return Object.values(enumObject).filter((enumName) => isNaN(Number(enumName)));
}

// export function GetEnumString<T>(enumIndex: number) {
//     return 
// }

const ConvertToDisplayStringOfNumber = (number: number) => {
    return number < 10 ? `0${number}` : number.toString();
} 
