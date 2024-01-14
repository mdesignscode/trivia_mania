export default function storageAvailable(): boolean {
  const type = "localStorage";
  let storage: Storage | null = null; // initialize storage to null
  try {
    storage = window[type as keyof Window] as Storage; // Let TS know storage is available
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.name === "NotFoundError" || // e.code Updated to use e.name
        // Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      !!storage &&
      storage.length !== 0
    );
  }
}
