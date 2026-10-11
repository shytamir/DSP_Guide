(() => {
  const locale = document.documentElement.lang;
  const source = document.currentScript?.src || document.baseURI;
  const url = new URL(`../data/locales/${locale}/ui.json`, source);
  const ready = fetch(url).then(async (response) => {
    if (!response.ok)
      throw Error(`Locale UI request failed: ${response.status}`);
    const data = await response.json();
    if (data.schema !== 1 || data.locale !== locale)
      throw Error("Locale UI identity mismatch");
    for (const key of [
      "saved",
      "unavailable",
      "reset",
      "resetUnavailable",
      "required",
      "implicit",
      "unlocks",
      "rank",
    ])
      if (typeof data.strings?.[key] !== "string" || !data.strings[key].trim())
        throw Error(`Missing locale UI message: ${key}`);
    return Object.freeze(data.strings);
  });
  window.DspLocale = Object.freeze({ locale, ready });
})();
