export function getUtcNow() {
    var localNow = new Date(Date.now()); 
    var utcNow = getUtcFromLocal(localNow);
    return utcNow;
}

export function getUtcFromLocal(localDate: Date) {
    var utcMilliseconds =  Date.UTC(
        localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(),
        localDate.getUTCHours(), localDate.getUTCMinutes(), localDate.getUTCSeconds()
    );   
    return new Date(utcMilliseconds);
}