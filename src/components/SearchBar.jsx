import React, {useEffect, useCallback} from 'react';

export default function SearchBar({onKeyDown, callBackFn, delay, searchRef, searchText, setSearchText, placeholder, className}) {
  const callback = useCallback(callBackFn, [searchText]);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);

  return <input
    type="text"
    placeholder={placeholder}
    className={className}
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    onKeyDown={onKeyDown}
    ref={searchRef}
  />
}