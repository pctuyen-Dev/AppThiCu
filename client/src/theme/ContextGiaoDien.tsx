import React, { createContext, useContext, useEffect, useState } from 'react';

type CheDoGiaoDien = 'sang' | 'toi';

interface ContextGiaoDienType {
  cheDoGiaoDien: CheDoGiaoDien;
  chuyenDoiCheDoGiaoDien: (cheDo?: CheDoGiaoDien) => void;
}

const ContextGiaoDien = createContext<ContextGiaoDienType | undefined>(undefined);

export const ContextGiaoDienProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cheDoGiaoDien, setCheDoGiaoDien] = useState<CheDoGiaoDien>(() => {
    const cheDoLuu = localStorage.getItem('uneti_exam_theme');
    if (cheDoLuu === 'toi' || cheDoLuu === 'sang') return cheDoLuu;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'toi' : 'sang';
  });

  useEffect(() => {
    const rootElement = document.documentElement;
    if (cheDoGiaoDien === 'toi') {
      rootElement.classList.add('dark');
    } else {
      rootElement.classList.remove('dark');
    }
    localStorage.setItem('uneti_exam_theme', cheDoGiaoDien);
  }, [cheDoGiaoDien]);

  const chuyenDoiCheDoGiaoDien = (cheDoMoi?: CheDoGiaoDien) => {
    if (cheDoMoi) {
      setCheDoGiaoDien(cheDoMoi);
    } else {
      setCheDoGiaoDien((prev) => (prev === 'sang' ? 'toi' : 'sang'));
    }
  };

  return (
    <ContextGiaoDien.Provider value={{ cheDoGiaoDien, chuyenDoiCheDoGiaoDien }}>
      {children}
    </ContextGiaoDien.Provider>
  );
};

export const useGiaoDien = () => {
  const context = useContext(ContextGiaoDien);
  if (!context) {
    throw new Error('useGiaoDien phải được dùng trong ContextGiaoDienProvider');
  }
  return context;
};
