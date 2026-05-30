import React, { useState } from 'react';
import AfriLearnMain from './AfriLearnMain';
import AdminPanel from './AdminPanel';

export default function App() {
  // Pour accéder au panel admin : ajouter ?admin à l'URL
  const isAdmin = window.location.search.includes('admin');
  if (isAdmin) return <AdminPanel />;
  return <AfriLearnMain />;
}
