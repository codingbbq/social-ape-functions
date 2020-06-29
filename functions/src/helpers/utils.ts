export function isEmpty(str: string): boolean {
    if(str.trim() === '') {
        return true;
    }else {
        return false;
    }
}

export function isEmail(str: string) : boolean {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(str.match(emailRegEx)) {
        return true;
    }else {
        return false;
    }
}
