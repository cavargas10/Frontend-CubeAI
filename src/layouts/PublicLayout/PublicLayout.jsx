import { Outlet } from 'react-router-dom';
import { Header } from '../Header'; 

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col"> 
      <Header /> 
      <main className="flex-grow flex flex-col">
        <Outlet /> 
      </main>
    </div>
  );
};